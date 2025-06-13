use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;

#[derive(Debug, Serialize, Deserialize)]
pub struct Version {
    pub major: u32,
    pub minor: u32,
}

impl Version {
    pub fn new(major: u32, minor: u32) -> Self {
        Self {
            major,
            minor,
        }
    }

    pub fn to_string(&self) -> String {
        format!("{}.{}", self.major, self.minor)
    }

    pub fn increment_minor(&mut self) {
        self.minor += 1;
        if self.minor >= 100 {
            self.major += 1;
            self.minor = 0;
        }
    }
}

pub fn get_version() -> Result<Version, Box<dyn std::error::Error>> {
    let version_file = Path::new("version.json");
    
    if !version_file.exists() {
        let initial_version = Version::new(0, 10); // Start at 0.1
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