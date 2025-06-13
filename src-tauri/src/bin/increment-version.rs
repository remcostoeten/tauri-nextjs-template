use tauri_nextjs_template_lib::version::{get_version, save_version};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut version = get_version()?;
    version.increment_minor();
    save_version(&version)?;
    println!("Version incremented to {}", version.to_string());
    Ok(())
} 