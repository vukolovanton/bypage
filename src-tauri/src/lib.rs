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

fn read_file_to_string(file: &File) -> String {
    let mut content = String::new();
    let mut reader = BufReader::new(file);
    reader.get_mut().seek(SeekFrom::Start(0)).expect("sd");
    reader
        .read_to_string(&mut content)
        .expect("Error reading a file to string");
    println!(
        "Done reading to string. Content length is: {}.",
        content.len()
    );
    content
}

fn parse_string_to_fb2(content: &str) -> FictionBook {
    let book = from_str::<FictionBook>(content).expect("Failed to parse FB2");
    // let converted = match serde_json::to_string_pretty(&book) {
    //     Ok(json) => json,
    //     Err(e) => panic!("Error while converting to JSON: {}", e),
    // };
    book
}

#[tauri::command]
fn open_file(path: String) -> Result<FictionBook, String> {
    let file = File::open(path);
    let book: Result<FictionBook, String> = match file {
        Ok(result) => {
            let content: String = read_file_to_string(&result);
            let book: FictionBook = parse_string_to_fb2(&content);
            Ok(book)
        }
        Err(error) => Err(format!("Operation failed in `open_file`: {}", error)),
    };
    book
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
