import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const SRC_DIR = path.join(process.cwd(), 'src');
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'] as const;

interface FileReference {
  path: string;
  referencedBy: Set<string>;
}

async function findAllFiles(): Promise<string[]> {
  const patterns = EXTENSIONS.map(ext => `${SRC_DIR}/**/*${ext}`);
  const files = await glob(patterns);
  return files.map((file: string) => path.relative(process.cwd(), file));
}

function extractImports(content: string, filePath: string): string[] {
  const imports: string[] = [];
  
  // Match ES6 imports
  const importRegex = /from\s+['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (!importPath.startsWith('.')) continue; // Skip non-relative imports
    
    const fullPath = path.resolve(path.dirname(filePath), importPath);
    imports.push(fullPath);
  }
  
  return imports;
}

async function findUnusedFiles() {
  const files = await findAllFiles();
  const fileRefs: Map<string, FileReference> = new Map();
  
  // Initialize file references
  for (const file of files) {
    const absolutePath = path.resolve(file);
    fileRefs.set(absolutePath, {
      path: file,
      referencedBy: new Set<string>()
    });
  }
  
  // Analyze imports
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const imports = extractImports(content, file);
    
    for (const imp of imports) {
      // Try different extensions if the import doesn't specify one
      for (const ext of EXTENSIONS) {
        const possiblePath = imp + ext;
        const ref = fileRefs.get(possiblePath);
        if (ref) {
          ref.referencedBy.add(file);
          break;
        }
      }
    }
  }
  
  // Find unused files
  const unusedFiles: string[] = [];
  for (const [_, ref] of fileRefs) {
    // Skip pages, layouts, and api routes as they're entry points
    if (
      ref.path.includes('/pages/') ||
      ref.path.includes('/app/') ||
      ref.path.includes('/api/') ||
      ref.path.includes('layout.') ||
      ref.path.includes('page.')
    ) {
      continue;
    }
    
    if (ref.referencedBy.size === 0) {
      unusedFiles.push(ref.path);
    }
  }
  
  return unusedFiles;
}

// Run the analysis
findUnusedFiles().then(unusedFiles => {
  console.log('\nPotentially unused files:');
  console.log('------------------------');
  if (unusedFiles.length === 0) {
    console.log('No unused files found!');
  } else {
    unusedFiles.forEach(file => console.log(file));
  }
}).catch(error => {
  console.error('Error:', error);
}); 