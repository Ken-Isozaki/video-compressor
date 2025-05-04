use std::env;
use std::fs;
use std::io::Write;
use std::io::{BufRead, BufReader};
use std::path::Path;
use std::path::PathBuf;
use std::process::{Command, Stdio};
use tauri::{AppHandle, Emitter};
mod encode_options;
use encode_options::*;

// アプリの設定を読み出す
#[tauri::command]
fn load_app_settings() -> Result<serde_json::Value, String> {
    let settings_path = Path::new("./settings/config.json");

    // 設定ファイルが存在するか確認
    if !settings_path.exists() {
        return Err("設定ファイルが見つかりません".to_string());
    }

    // 設定ファイルを読み込む
    match fs::read_to_string(settings_path) {
        Ok(content) => match serde_json::from_str(&content) {
            Ok(json) => Ok(json),
            Err(e) => Err(format!("JSONの解析に失敗しました: {}", e)),
        },
        Err(e) => Err(format!("設定ファイルの読み込みに失敗しました: {}", e)),
    }
}

// アプリの設定を保存する
#[tauri::command]
fn save_app_settings(settings: serde_json::Value) {
    let settings_path = Path::new("./settings/config.json");

    // フォルダがあるか確認しなければ作る
    if let Some(parent) = settings_path.parent() {
        if !parent.exists() {
            if let Err(e) = fs::create_dir_all(parent) {
                eprintln!("フォルダ作成失敗: {}", e);
                return;
            }
        }
    }

    // 設定をファイルに書き出し
    match fs::File::create(settings_path) {
        Ok(mut file) => {
            if let Err(e) = file.write_all(settings.to_string().as_bytes()) {
                eprintln!("ファイル書き出し失敗: {}", e);
            } else {
                println!("書き出し完了");
            }
        }
        Err(e) => {
            eprintln!("設定ファイル作成失敗: {}", e);
        }
    }
}

// 元ビデオの長さを取得する関数
fn get_video_duration(path: &str) -> Result<f64, String> {
    let output = Command::new("ffmpeg/ffprobe.exe")
        .args([
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            path,
        ])
        .output()
        .map_err(|e| format!("Failed to execute ffprobe: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    stdout
        .trim()
        .parse::<f64>()
        .map_err(|e| format!("Parse error: {}", e))
}

#[tauri::command]
fn execute_compression(
    app: AppHandle,
    params: CompressionParams,
    force: bool,
) -> Result<(), String> {
    // ffmpegとffprobeの存在確認
    if !PathBuf::from("ffmpeg/ffmpeg.exe").exists() || !PathBuf::from("ffmpeg/ffprobe.exe").exists()
    {
        return Err("FFmpeg or FFprobe not found".to_string());
    }

    // 出力パスの検証
    let output_path = PathBuf::from(&params.output_path);

    // パスがディレクトリとして有効か確認
    if output_path.is_dir() {
        return Err("Not a file".to_string());
    }

    // 親ディレクトリが有効か確認
    if let Some(parent) = output_path.parent() {
        if !parent.exists()
            || !parent.is_dir()
            || parent == Path::new("\\")
            || parent == Path::new("\\\\")
        {
            return Err("Invalid output path".to_string());
        }
    } else {
        return Err("Invalid output path".to_string());
    }

    // 出力ファイルがあるか確認
    let output_exists = output_path.exists();

    // 出力ファイルがあれば一旦エラーを返す
    if output_exists && !force {
        return Err("File already exists".to_string());
    }

    // 圧縮オプションのargsを作成
    let args = build_ffmpeg_args(&params);

    // ffmpegを実行して圧縮
    let mut child = Command::new("ffmpeg/ffmpeg.exe")
        .args(&args)
        .stdout(Stdio::piped())
        .spawn()
        .map_err(|e| format!("FFmpeg failed: {}", e))?;

    // 入力ビデオの長さを取得
    let input_video_duration = match get_video_duration(&params.input_path) {
        Ok(duration) => duration,
        Err(e) => return Err(format!("動画の長さ取得に失敗: {}", e)),
    };

    // 進捗を取得しemitする
    if let Some(stdout) = child.stdout.take() {
        let reader = BufReader::new(stdout);
        for line in reader.lines() {
            if let Ok(l) = line {
                if l.starts_with("out_time_ms=") {
                    let ms_str = l.trim_start_matches("out_time_ms=");
                    if let Ok(ms) = ms_str.parse::<u64>() {
                        // ms を秒に変換して動画全体の長さと比べる
                        let current_sec = ms as f64 / 1_000_000.0;
                        let percent = (current_sec / input_video_duration) * 100.0;
                        let percent_clamped = percent.min(100.0).max(0.0); // 安全のため0〜100に制限
                        let _ = app.emit("compressionProgress", percent_clamped as u32);
                    }
                }
            }
        }
    }

    let _ = child.wait();
    let _ = app.emit("compressionProgress", 100u32); // 完了時に100%をemit
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            execute_compression,
            save_app_settings,
            load_app_settings
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
