use serde::{Deserialize, Serialize};

// 圧縮オプションの構造体
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CompressionParams {
    pub input_path: String,
    pub output_path: String,
    pub vcodec: VideoCodec,
    pub preset: Preset,
    pub crf: u8,
    pub acodec: AudioCodec,
    pub resolution: Resolution,
}

// オプションビルダー
pub fn build_ffmpeg_args(params: &CompressionParams) -> Vec<String> {
    let mut args = vec![
        "-y".into(),
        "-i".into(),
        params.input_path.clone(),
        "-vcodec".into(),
        params.vcodec.as_str().into(),
        "-preset".into(),
        params.preset.as_str().into(),
    ];

    // CRFの範囲チェック
    args.push("-crf".into());
    if params.crf > 51 {
        // CRFの範囲外の場合はデフォルト値を使用
        args.push("51".into());
    } else {
        args.push(params.crf.to_string());
    }

    // 音声設定
    if let AudioCodec::Delete = params.acodec {
        args.push(params.acodec.as_str().into()); // 音声を削除
    } else {
        args.push("-acodec".into());
        args.push(params.acodec.as_str().into());
    }

    // 解像度設定
    if let Some(filter) = params.resolution.scale_filter() {
        args.push("-vf".into());
        args.push(filter);
    }

    // 進捗表示のためのオプション
    args.push("-progress".into());
    args.push("pipe:1".into());

    // 出力パス
    args.push(params.output_path.clone());
    args
}

// ビデオコーデック
#[derive(Debug, Serialize, Deserialize)]
pub enum VideoCodec {
    LibX264,
    LibX265,
}

impl VideoCodec {
    fn as_str(&self) -> &'static str {
        match self {
            VideoCodec::LibX264 => "libx264",
            VideoCodec::LibX265 => "libx265",
        }
    }
}

// 圧縮のスピード
#[derive(Debug, Serialize, Deserialize)]
pub enum Preset {
    UltraFast,
    SuperFast,
    VeryFast,
    Faster,
    Fast,
    Medium,
    Slow,
    Slower,
    VerySlow,
}

impl Preset {
    fn as_str(&self) -> &'static str {
        match self {
            Preset::UltraFast => "ultrafast",
            Preset::SuperFast => "superfast",
            Preset::VeryFast => "veryfast",
            Preset::Faster => "faster",
            Preset::Fast => "fast",
            Preset::Medium => "medium",
            Preset::Slow => "slow",
            Preset::Slower => "slower",
            Preset::VerySlow => "veryslow",
        }
    }
}

// オーディオコーデック
#[derive(Debug, Serialize, Deserialize)]
pub enum AudioCodec {
    Copy,
    Aac,
    Mp3,
    Delete,
}

impl AudioCodec {
    fn as_str(&self) -> &'static str {
        match self {
            AudioCodec::Copy => "copy",
            AudioCodec::Aac => "aac",
            AudioCodec::Mp3 => "mp3",
            AudioCodec::Delete => "-an", // 音声削除のオプション
        }
    }
}

// 解像度
#[derive(Debug, Serialize, Deserialize)]
pub enum Resolution {
    Original,
    W2560,
    W1920,
    W1680,
    W1600,
    W1440,
    W1280,
    W1024,
    W960,
    W800,
    W720,
    W640,
    W576,
    W480,
    W320,
    W240,
    W160,
}

impl Resolution {
    /// 数値解像度を取得（Original は None）
    fn as_u32(&self) -> Option<u32> {
        match self {
            Resolution::Original => None,
            Resolution::W2560 => Some(2560),
            Resolution::W1920 => Some(1920),
            Resolution::W1680 => Some(1680),
            Resolution::W1600 => Some(1600),
            Resolution::W1440 => Some(1440),
            Resolution::W1280 => Some(1280),
            Resolution::W1024 => Some(1024),
            Resolution::W960 => Some(960),
            Resolution::W800 => Some(800),
            Resolution::W720 => Some(720),
            Resolution::W640 => Some(640),
            Resolution::W576 => Some(576),
            Resolution::W480 => Some(480),
            Resolution::W320 => Some(320),
            Resolution::W240 => Some(240),
            Resolution::W160 => Some(160),
        }
    }

    /// FFmpegのscaleフィルター用の文字列を生成
    pub fn scale_filter(&self) -> Option<String> {
        self.as_u32().map(|w| format!("scale=trunc({}/2)*2:-2", w))
    }
}
