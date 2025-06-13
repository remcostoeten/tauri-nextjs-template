// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod version;

use version::{get_current_version, increment_version};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_current_version,
            increment_version,
            get_recent_commits
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
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
