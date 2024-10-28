export interface User {
    id: string;
    web3Address: string;
    premium: boolean;
    createdAt: string;
    updatedAt: string;
    payments: Payment[];
    files: File[];
}

export interface Payment {
    id: string;
    amount: number;
    status: string;
    createdAt: string;
}

export interface File {
    id: string;
    name: string;
    url: string;
    type: string;
    audioLanguage: string;
    size?: number;
    createdAt: string;
    updatedAt: string;
    subtitles: SubtitlesFile[];
}

export interface SubtitlesFile {
    id: string;
    name: string;
    url: string;
    transcriptionJobName: string;
    transcriptionStatus: string;
}