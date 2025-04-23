use fb2::FictionBook;
use quick_xml::de::from_str;
use reqwest::{self, Client};
use std::path::Path;
use std::{
    fs::File,
    io::{BufReader, Read, Seek},
};
use structures::{
    ModelsResponse, OllamaModels, OllamaResponse, ProcessingError, TranslateProgress,
};
use tauri::ipc::IpcResponse;
use tauri::{AppHandle, Emitter};
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

fn process_into_chunks(flatten: Vec<String>, max_bytes: usize) -> Vec<Vec<String>> {
    let mut chunks = Vec::new();
    let mut current = Vec::new();
    let mut current_size = 0;

    for s in flatten {
        let len = s.len();
        if !current.is_empty() && current_size + len > max_bytes {
            chunks.push(current);
            current = Vec::new();
            current_size = 0;
        }
        current_size += len;
        current.push(s);
    }

    if !current.is_empty() {
        chunks.push(current);
    }
    println!("CHUNKS: {:?}", chunks);
    chunks
}

async fn send_request_to_backend(
    chunks: Vec<Vec<String>>,
    client: &Client,
    app: &AppHandle,
    model: String,
    language: String,
) -> Result<Vec<String>, ProcessingError> {
    let mut result: Vec<String> = Vec::new();
    for (index, chunk) in chunks.iter().enumerate() {
        app.emit(
            "translate_progress",
            TranslateProgress {
                total: chunks.len(),
                current: index,
            },
        )
        .unwrap();
        let combined_string = chunk.join("\n");
        let payload = serde_json::json!({
            "model": model,
            "prompt": format!("You are professional translator. Translate this text from English to {}. Answer only with translated text: {}", language, combined_string),
            "stream": false
        });
        println!("Sending request>>>");
        let response = client
            .post("http://localhost:11434/api/generate")
            .json(&payload)
            .send()
            .await;
        match response {
            Ok(body) => {
                let body = body.text().await?;
                let parsed: OllamaResponse = serde_json::from_str(&body)?;
                let translated_lines: Vec<String> = parsed
                    .response
                    .lines()
                    .map(|line| line.trim().to_string())
                    .collect();
                for line in translated_lines {
                    result.push(line);
                }
                println!("Done working on a chunk");
            }
            Err(e) => println!("Request failed with status: {:?}", e),
        }
    }
    Ok(result)
}

#[tauri::command]
async fn translate_book(
    app: AppHandle,
    book: Vec<String>,
    model: String,
    language: String,
) -> Vec<String> {
    app.emit("translate_progress", "pickle").unwrap();
    println!("Starting process...");
    let model = "gemma3:12b".to_string();
    let language = "Russian".to_string();
    let chunks = process_into_chunks(book, 3000);
    let client = reqwest::Client::new();
    let temp = send_request_to_backend(chunks, &client, &app, model, language).await;
    let translated = match temp {
        Ok(result) => result,
        Err(e) => {
            println!("Error : {:?}", e);
            Vec::new()
        }
    };
    app.emit("translate_progress", "rick").unwrap();
    println!("Translated: {:?}", translated);
    translated
}

#[tauri::command]
async fn get_model_list() -> Result<Vec<Option<String>>, String> {
    let client = reqwest::Client::new();
    let response = client
        .get("http://localhost:11434/api/tags")
        .send()
        .await
        .map_err(|e| e.to_string())?;
    let body = response.text().await.map_err(|e| e.to_string())?;
    let parsed: OllamaModels = serde_json::from_str(&body).map_err(|e| e.to_string())?;
    let collected: Vec<Option<String>> = parsed.models.iter().map(|m| m.model.clone()).collect();
    Ok(collected)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            open_file,
            validate_paths,
            translate_book,
            get_model_list
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
