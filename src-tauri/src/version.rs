use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;

#[derive(Debug, Serialize, Deserialize, PartialEq)]
pub struct Version {
    pub major: u32,
    pub minor: u32,
    pub patch: u32,
}

impl Version {
    pub fn new(major: u32, minor: u32, patch: u32) -> Self {
        Self {
            major,
            minor,
            patch,
        }
    }

    pub fn to_string(&self) -> String {
        format!("{}.{:02}", self.major, self.patch)
    }

    pub fn increment_minor(&mut self) {
        self.patch += 1;
        if self.patch >= 100 {
            self.major += 1;
            self.patch = 0;
        }
    }
}

pub fn get_version() -> Result<Version, Box<dyn std::error::Error>> {
    let version_file = Path::new("version.json");
    
    if !version_file.exists() {
        let initial_version = Version::new(0, 0, 0); // Start at 0.00
        let version_str = serde_json::to_string_pretty(&initial_version)?;
        fs::write(version_file, version_str)?;
        return Ok(initial_version);
    }

    let version_str = fs::read_to_string(version_file)?;
    let version: Version = serde_json::from_str(&version_str)?;
    Ok(version)
}

pub fn save_version(version: &Version) -> Result<(), Box<dyn std::error::Error>> {
    let version_str = serde_json::to_string_pretty(version)?;
    fs::write("version.json", version_str)?;
    Ok(())
}

#[tauri::command]
pub fn get_current_version() -> Result<String, String> {
    get_version()
        .map(|v| v.to_string())
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn increment_version() -> Result<String, String> {
    let mut version = get_version().map_err(|e| e.to_string())?;
    version.increment_minor();
    save_version(&version).map_err(|e| e.to_string())?;
    Ok(version.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    
    #[test]
    fn test_version_increment() {
        let mut version = Version::new(0, 0, 0);
        assert_eq!(version.to_string(), "0.00");
        
        version.increment_minor();
        assert_eq!(version.to_string(), "0.01");
        
        // Test rolling over to next major
        for _ in 0..98 {
            version.increment_minor();
        }
        assert_eq!(version.to_string(), "0.99");
        
        version.increment_minor();
        assert_eq!(version.to_string(), "1.00");
        
        // Test a few more increments
        version.increment_minor();
        assert_eq!(version.to_string(), "1.01");
    }
    
    #[test]
    fn test_version_file_operations() -> Result<(), Box<dyn std::error::Error>> {
        let test_file = "test_version.json";
        
        // Clean up any existing test file
        let _ = fs::remove_file(test_file);
        
        // Test saving version
        let version = Version::new(0, 0, 50); // 0.50
        let version_str = serde_json::to_string_pretty(&version)?;
        fs::write(test_file, &version_str)?;
        
        // Test reading version
        let read_str = fs::read_to_string(test_file)?;
        let read_version: Version = serde_json::from_str(&read_str)?;
        assert_eq!(read_version, version);
        assert_eq!(read_version.to_string(), "0.50");
        
        // Clean up
        fs::remove_file(test_file)?;
        Ok(())
    }
} 