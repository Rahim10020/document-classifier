// Types pour l'authentification

export interface User {
    id: number;
    username: string;
    email: string;
    date_joined: string;
}

export interface AuthResponse {
    message: string;
    user: User;
    tokens: {
        access: string;
        refresh: string;
    };
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
}


// Types pour les documents

export interface Document {
    id: number;
    title: string;
    file: string;
    file_name: string;
    category: DocumentCategory;
    content_preview: string;
    keywords: string[],
    file_type: string;
    file_size: number;
    created_at: string;
    updated_at: string;
}

export interface DocumentListItem {
    id: number;
    title: string;
    file_name: string;
    category: DocumentCategory;
    file_type: string;
    file_size: number;
    created_at: string;
}

export interface DocumentUploadData {
    title: string;
    file: File;
}

export interface DocumentStats {
    total_documents: number;
    categories: {
        math: number;
        algo: number;
        histoire: number;
        autres: number;
    };
}

// Types pour les categories

export type DocumentCategory = 'math' | 'algo' | 'histoire' | 'autres';

export interface CategoryInfo {
    key: DocumentCategory;
    label: string;
    color: string;
    icon: string;
}

// Types pour les erreurs api
export interface APIError {
    message?: string;
    detail?: string;
    [key: string]: any;
}

//Types pour les reponses api
export interface APIResponse<T> {
    data: T;
    status: number;
}

// Types pour les composants
export interface FileUploadProps {
    onUpload: (files: File[]) => void;
    isUploading: boolean;
    acceptedTypes: string[];
    maxSize: number;
}

export interface FileCardProps {
    document: DocumentListItem;
    onDelete: (id: number) => void;
    onView: (document: DocumentListItem) => void;
}


// Types pour les hooks
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface DocumentsState {
    documents: DocumentListItem[];
    stats: DocumentStats | null;
    isLoading: boolean;
    error: string | null;
}