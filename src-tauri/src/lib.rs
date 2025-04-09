use fb2::FictionBook;
use quick_xml::de::from_str;
use tauri::Manager;
// use reqwest::{self};
// use serde_json::json;
use std::{
    // error::Error,
    fs::File,
    io::{BufReader, Read, Seek, SeekFrom, Write},
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![open_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// fn write_file(handle: tauri::AppHandle) -> String {
//     let app_local_data_dir = handle.path().app_local_data_dir().unwrap();
//     let file = std::fs::File::open(&app_local_data_dir).unwrap();
//     let mut file = match File::create("Book.json") {
//         Ok(f) => f,
//         Err(e) => panic!("Error while creating a file: {}", e),
//     };
//     if let Err(e) = file.write_all(converted.as_bytes()) {
//         println!("Error while writing to file: {}", e);
//     } else {
//         println!("Done writing to disk");
//     }
//     String::new()
// }
