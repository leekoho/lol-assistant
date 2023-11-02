// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{command};
use serde::{Deserialize, Serialize};
use sysinfo::{ProcessExt, System, SystemExt};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

const TARGET_PROCESS: &str = "LeagueClientUx.exe";

#[derive(Serialize, Deserialize, Debug)]
pub struct Auth {
    port: String,
    password: String
}

#[command]
fn authenticate() -> Result<Auth, String> {
    let mut sys: System = System::new_all();
    sys.refresh_processes();

    let mut auth = Auth {
        port: "".into(),
        password: "".into()
    };

    let process = sys
        .processes()
        .values()
        .find(|p| p.name() == TARGET_PROCESS);

    let args: &[String] = process
        .map(|p: &sysinfo::Process| p.cmd())
        .ok_or("Riot/League client process could not be found".to_string())?;

    auth.port = args
        .iter()
        .find(|arg| arg.starts_with("--app-port="))
        .map(|arg| arg.strip_prefix("--app-port=").unwrap().to_string())
        .ok_or("Riot/League client process could not be found".to_string())?;

    auth.password = args
        .iter()
        .find(|arg| arg.starts_with("--remoting-auth-token="))
        .map(|arg| {
            arg.strip_prefix("--remoting-auth-token=")
            .unwrap()
            .to_string()
        })
        .ok_or("Riot/League client process could not be found".to_string())?;

//     println!("{:?}{:?}", port,auth_token);

    Ok(auth)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            authenticate
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
