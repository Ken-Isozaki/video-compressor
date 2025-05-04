// 一部選択肢を減らしています
// 多すぎても選択しいづらいので

// 圧縮オプションのインターフェース定義
export interface CompressionParams {
  inputPath: string;
  outputPath: string;
  vcodec: VideoCodec;
  preset: Preset;
  crf: Crf;
  acodec: AudioCodec;
  resolution: Resolution;
}

// ビデオコーデック
export enum VideoCodec {
  LibX264 = "LibX264",
  LibX265 = "LibX265",
}

export const VideoCodecDispName: Record<VideoCodec, string> = {
  [VideoCodec.LibX264]: "LibX264（推奨）",
  [VideoCodec.LibX265]: "LibX265",
};

// プリセット
// 選択肢は以下の通り
// UltraFast, SuperFast, VeryFast, Faster, Fast, Medium, Slow, Slower, VerySlow
// ただし選択肢は一部減らしています
export enum Preset {
  VeryFast = "VeryFast",
  Medium = "Medium",
  VerySlow = "VerySlow",
}

// プリセットの表示名
export const PresetDispName: Record<Preset, string> = {
  [Preset.VeryFast]: "速い（速度重視）",
  [Preset.Medium]: "標準",
  [Preset.VerySlow]: "遅い（画質重視）",
};

// CRFのオプション (0から51までの整数値)
export enum Crf {
  Crf0 = 0,
  Crf18 = 18,
  Crf20 = 20,
  Crf23 = 23,
  Crf26 = 26,
  Crf30 = 30,
}

export const CrfDispName: Record<Crf, string> = {
  [Crf.Crf0]: "最高画質（劣化なし）",
  [Crf.Crf18]: "非常に高画質",
  [Crf.Crf20]: "高画質",
  [Crf.Crf23]: "標準画質",
  [Crf.Crf26]: "低画質",
  [Crf.Crf30]: "非常に低画質",
};

// オーディオコーデック
export enum AudioCodec {
  Copy = "Copy",
  Aac = "Aac",
  Mp3 = "Mp3",
  Delete = "Delete", // 音声削除
}

// オーディオコーデックの表示名
export const AudioCodecDispName: Record<AudioCodec, string> = {
  [AudioCodec.Copy]: "変更なし",
  [AudioCodec.Aac]: "AAC",
  [AudioCodec.Mp3]: "MP3",
  [AudioCodec.Delete]: "オーディオを削除",
};

// 解像度（横幅で指定）
export enum Resolution {
  Original = "Original",
  W2560 = "W2560",
  W1920 = "W1920",
  W1680 = "W1680",
  W1600 = "W1600",
  W1440 = "W1440",
  W1280 = "W1280",
  W1024 = "W1024",
  W960 = "W960",
  W800 = "W800",
  W720 = "W720",
  W640 = "W640",
  W576 = "W576",
  W480 = "W480",
  W320 = "W320",
  W240 = "W240",
  W160 = "W160",
}

// オーディオコーデックの表示名
export const ResolutionDispName: Record<Resolution, string> = {
  [Resolution.Original]: "元のサイズを維持",
  [Resolution.W2560]: "2560px に圧縮",
  [Resolution.W1920]: "1920px に圧縮",
  [Resolution.W1680]: "1680px に圧縮",
  [Resolution.W1600]: "1600px に圧縮",
  [Resolution.W1440]: "1440px に圧縮",
  [Resolution.W1280]: "1280px に圧縮",
  [Resolution.W1024]: "1024px に圧縮",
  [Resolution.W960]: "960px に圧縮",
  [Resolution.W800]: "800px に圧縮",
  [Resolution.W720]: "720px に圧縮",
  [Resolution.W640]: "640px に圧縮",
  [Resolution.W576]: "576px に圧縮",
  [Resolution.W480]: "480px に圧縮",
  [Resolution.W320]: "320px に圧縮",
  [Resolution.W240]: "240px に圧縮",
  [Resolution.W160]: "160px に圧縮",
};
