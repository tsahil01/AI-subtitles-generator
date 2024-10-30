export interface User {
    id: string;
    web3Address: string;
    premium: boolean; // Add this if it's included in your schema
    createdAt: string;
    updatedAt: string;
    payments: Payment[];
    files: File[];
}

export interface Payment {
    id: string;
    userId: string; // Added userId for reference
    amount: number;
    transactionId: string; // Added transactionId for reference
    status: string; // Consider using specific enums if applicable
    createdAt: string;
}

export interface File {
    id: string;
    name: string;
    url: string;
    type: string;
    audioLanguage: string;
    key: string; // Added key for reference
    size?: number;
    userId: string; // Added userId for reference
    createdAt: string;
    updatedAt: string;
    transactionId: string; // Added transactionId for reference
    subtitles: SubtitlesFile[];
}

export interface SubtitlesFile {
    id: string;
    name: string;
    url: string;
    fileId: string; // Added fileId for reference
    transcriptionJobName: string;
    transcriptionStatus: string; // Consider using specific enums if applicable
}

export enum LanguageCodeEnum {
    ENGLISH = "en-US",
    SPANISH = "es-US",
    JAPANESE = "ja-JP",
    HINDI = "hi-IN",
    TAMIL = "ta-IN",
    TELUGU = "te-IN",
    KANNADA = "kn-IN",
    MALAYALAM = "ml-IN",
    BENGALI = "bn-IN",
    GUJARATI = "gu-IN",
    MARATHI = "mr-IN",
    PUNJABI = "pa-IN",
    URDU = "ur-IN",
  }
  