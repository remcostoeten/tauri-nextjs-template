// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod version;
mod auth;

use version::{get_current_version, increment_version};
use auth::{hash_password, verify_password, generate_session_token, check_login_rate_limit, save_avatar, RateLimiter};

fn main() {
    let rate_limiter = RateLimiter::new();

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .manage(rate_limiter)
        .invoke_handler(tauri::generate_handler![
            greet,
            get_current_version,
            increment_version,
            get_recent_commits,
            hash_password,
            verify_password,
            generate_session_token,
            check_login_rate_limit,
            save_avatar,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn greet() -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    let now = SystemTime::now();
    let epoch_ms = now.duration_since(UNIX_EPOCH).unwrap().as_millis();
    format!("Hello world from Rust! Current epoch: {}", epoch_ms)
}

#[tauri::command]
async fn get_recent_commits() -> Result<Vec<CommitInfo>, String> {
    let output = std::process::Command::new("git")
        .args(["log", "--pretty=format:%H|%an|%ad|%s", "--date=iso", "-n", "10"])
        .output()
        .map_err(|e| e.to_string())?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    println!("[get_recent_commits] git log output:\n{}", stdout);

    let commits = stdout
        .lines()
        .filter_map(|line| {
            let mut parts = line.splitn(4, '|');
            let sha = parts.next()?.to_string();
            let author = parts.next()?.to_string();
            let date = parts.next()?.to_string();
            let message = parts.next()?.to_string();
            Some(CommitInfo {
                sha,
                commit: Commit { message, author, date },
            })
        })
        .collect();

    Ok(commits)
}

#[derive(serde::Serialize)]
struct CommitInfo {
    sha: String,
    commit: Commit,
}

#[derive(serde::Serialize)]
struct Commit {
    message: String,
    author: String,
    date: String,
}