use fb2::FictionBook;
use quick_xml::de::from_str;
use std::path::Path;
// use reqwest::{self};
// use serde_json::json;
use std::{
    // error::Error,
    fs::File,
    io::{BufReader, Read, Seek},
};
mod structures;

fn read_file_to_string(file: &File) -> Result<String, std::io::Error> {
    let mut content = String::new();
    let mut reader = BufReader::new(file);
    if let Err(e) = reader.get_mut().seek(std::io::SeekFrom::Start(0)) {
        eprintln!("Error seeking in file: {}", e);
        return Err(e);
    }
    if let Err(e) = reader.read_to_string(&mut content) {
        eprintln!("Error reading file to string: {}", e);
        return Err(e);
    }
    println!(
        "Done reading to string. Content length is: {}.",
        content.len()
    );
    Ok(content)
}

fn parse_string_to_fb2(content: &str) -> Result<FictionBook, Box<dyn std::error::Error>> {
    let book = from_str::<FictionBook>(content)?;
    Ok(book)
}

#[tauri::command]
fn open_file(path: String) -> Result<FictionBook, String> {
    let file = File::open(&path);
    match file {
        Ok(file_handle) => {
            let content = read_file_to_string(&file_handle)
                .map_err(|e| format!("Error reading file: {}", e))?;
            parse_string_to_fb2(&content).map_err(|e| e.to_string())
        }
        Err(e) => Err(format!("Failed to open file '{}': {}", path, e)),
    }
}

#[tauri::command]
fn validate_paths(paths: Vec<String>) -> Vec<String> {
    let mut results = Vec::new();
    for path in paths {
        let exists = Path::new(&path).exists();
        if exists {
            results.push(path);
        }
    }
    results
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![open_file, validate_paths])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
