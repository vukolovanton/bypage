use serde::{Deserialize, Serialize};
use thiserror::Error;

#[derive(Serialize)]
pub struct RequestPayload {
    pub model: String,
    pub prompt: String,
    // pub stream: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct OllamaResponse {
    pub model: String,
    pub created_at: String,
    pub response: String,
    pub done: bool,
    pub context: Vec<i32>,
    pub total_duration: i64,
    pub load_duration: i64,
    pub prompt_eval_count: i8,
    pub prompt_eval_duration: i64,
    pub eval_count: i32,
    pub eval_duration: i64,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct OllamaStreamResponse {
    model: String,
    created_at: String,
    response: String,
    done: bool,
    context: Vec<i32>,
    total_duration: i64,
    load_duration: i64,
    prompt_eval_count: i32,
    prompt_eval_duration: i64,
    eval_count: i32,
    eval_duration: i64,
}

#[derive(Error, Debug)]
pub enum ProcessingError {
    #[error("Network or API request failed")]
    RequestError(#[from] reqwest::Error),

    #[error("Failed to serialize data for API request")]
    SerializationError(#[from] serde_json::Error),

    #[error("API returned an error status: {status}")]
    ApiError { status: reqwest::StatusCode },

    #[error("Task failed to execute: {0}")]
    JoinError(#[from] tokio::task::JoinError),

    #[error("An underlying task failed")]
    TaskError(#[source] Box<dyn std::error::Error + Send + Sync>),
}
