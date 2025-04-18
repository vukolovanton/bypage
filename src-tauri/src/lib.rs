use fb2::FictionBook;
use quick_xml::de::from_str;
use reqwest::{self, Client};
use std::path::Path;
use std::{
    fs::File,
    io::{BufReader, Read, Seek},
};
use structures::{OllamaResponse, ProcessingError};
mod structures;

pub async fn process_strings_in_chunks(
    input_strings: Vec<String>,
    api_url: String,
    target_chunk_length: usize,
    client: &Client,
) -> Result<Vec<String>, ProcessingError> {
    // --- 1. Chunking Logic ---
    let mut chunks: Vec<Vec<String>> = Vec::new();
    let mut current_chunk: Vec<String> = Vec::new();
    let mut current_chunk_len: usize = 0;

    for s in input_strings.into_iter() {
        let s_len = s.len();
        if current_chunk.is_empty() || (current_chunk_len + s_len <= target_chunk_length) {
            current_chunk_len += s_len;
            current_chunk.push(s);
        } else {
            if !current_chunk.is_empty() {
                chunks.push(current_chunk);
            }
            current_chunk = vec![s];
            current_chunk_len = s_len;
        }
    }
    if !current_chunk.is_empty() {
        chunks.push(current_chunk);
    }
    println!("Created {} chunks.", chunks.len());
    // --- 2. API Request Logic (Concurrent) ---
    let mut results = Vec::new();
    for chunk in chunks {
        println!("Results: {:?}", results);
        let client = client.clone();
        let combined_string = chunk.join(" ");
        let payload = serde_json::json!({
            "model": "gemma3:12b",
            "prompt": format!("Translate this text from English to Russian. Answer only with translated text: {:?}", combined_string),
            "stream": false
        });
        println!("Working on chunk. Payload: {:?}", payload);
        let response = client
            .post(&api_url)
            .json(&payload)
            .send()
            .await
            .map_err(|e| e.to_string())
            .expect("Error");

        let response_text = response
            .text()
            .await
            .map_err(|e| e.to_string())
            .expect("Error");
        println!("Raw response text: {}", response_text);

        let json: Result<OllamaResponse, _> = serde_json::from_str(&response_text);

        let some = match json {
            Ok(parsed) => {
                println!("Parsed response OK");
                parsed
            }
            Err(e) => {
                eprintln!("Failed to parse JSON: {}", e);
                eprintln!("Response text was: {}", response_text);
                return Err(ProcessingError::SerializationError(e));
            }
        };
        println!("{:?}", some);
        results.push(some.response);
    }
    Ok(results)
}

#[tauri::command]
async fn send_request_to_ollama(flatten_book: Vec<String>) -> Result<Vec<String>, String> {
    let client = Client::builder()
        .build()
        .expect("Failed to build reqwest client");
    let api_endpoint = "http://localhost:11434/api/generate".to_string();
    let target_length = 1000;
    println!("Starting processing...");

    match process_strings_in_chunks(flatten_book, api_endpoint, target_length, &client).await {
        Ok(output) => Ok(output),
        Err(e) => Err(format!("Error: {}", e)),
    }
}

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
        .invoke_handler(tauri::generate_handler![
            open_file,
            validate_paths,
            send_request_to_ollama,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
