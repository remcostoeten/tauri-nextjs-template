use argon2::{
    password_hash::SaltString,
    Argon2, PasswordHash, PasswordHasher, PasswordVerifier,
};
use rand_core::OsRng;
use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::State;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct HashPasswordResponse {
    hash: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct VerifyPasswordResponse {
    matches: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GenerateTokenResponse {
    token: String,
    expires_at: u64,
}

#[tauri::command]
pub async fn hash_password(password: String) -> Result<HashPasswordResponse, String> {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();

    argon2
        .hash_password(password.as_bytes(), &salt)
        .map(|hash| HashPasswordResponse {
            hash: hash.to_string(),
        })
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn verify_password(
    password: String,
    hash: String,
) -> Result<VerifyPasswordResponse, String> {
    let parsed_hash = PasswordHash::new(&hash).map_err(|e| e.to_string())?;
    let argon2 = Argon2::default();

    Ok(VerifyPasswordResponse {
        matches: argon2
            .verify_password(password.as_bytes(), &parsed_hash)
            .is_ok(),
    })
}

#[tauri::command]
pub async fn generate_session_token() -> Result<GenerateTokenResponse, String> {
    let token = Uuid::new_v4().to_string();
    let expires_at = SystemTime::now()
        .checked_add(std::time::Duration::from_secs(30 * 24 * 60 * 60)) // 30 days
        .unwrap()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();

    Ok(GenerateTokenResponse { token, expires_at })
}

// Rate limiting implementation
use std::collections::HashMap;
use std::sync::Mutex;
use std::time::Instant;

pub struct RateLimiter {
    attempts: Mutex<HashMap<String, Vec<Instant>>>,
}

impl RateLimiter {
    pub fn new() -> Self {
        Self {
            attempts: Mutex::new(HashMap::new()),
        }
    }

    pub fn check_rate_limit(&self, key: &str, max_attempts: usize, window_secs: u64) -> bool {
        let now = Instant::now();
        let mut attempts = self.attempts.lock().unwrap();
        
        // Clean up old attempts
        attempts.entry(key.to_string())
            .and_modify(|timestamps| {
                timestamps.retain(|&timestamp| {
                    now.duration_since(timestamp).as_secs() < window_secs
                });
            })
            .or_insert_with(Vec::new);

        let current_attempts = attempts.get(key).unwrap();
        
        if current_attempts.len() >= max_attempts {
            false
        } else {
            attempts.get_mut(key).unwrap().push(now);
            true
        }
    }
}

#[tauri::command]
pub async fn check_login_rate_limit(
    ip_address: String,
    rate_limiter: State<'_, RateLimiter>,
) -> Result<bool, String> {
    Ok(rate_limiter.check_rate_limit(&ip_address, 5, 300)) // 5 attempts per 5 minutes
}

// File system operations for avatar handling
use std::fs;
use std::path::PathBuf;

#[tauri::command]
pub async fn save_avatar(
    file_path: String,
    user_id: String,
) -> Result<String, String> {
    let avatar_dir = PathBuf::from("avatars");
    fs::create_dir_all(&avatar_dir).map_err(|e| e.to_string())?;

    let file_name = format!("{}.jpg", user_id);
    let dest_path = avatar_dir.join(&file_name);

    // Process and optimize image and save directly
    let img = image::open(&file_path)
        .map_err(|e| e.to_string())?
        .resize(200, 200, image::imageops::FilterType::Lanczos3);

    // Save as JPEG directly
    img.save_with_format(&dest_path, image::ImageFormat::Jpeg)
        .map_err(|e| e.to_string())?;
    fs::remove_file(file_path).map_err(|e| e.to_string())?;

    Ok(file_name)
}