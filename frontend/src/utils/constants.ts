import { CategoryInfo, DocumentCategory } from "@/types";

// configuration api
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// endpoints api
export const API_ENDPOINTS = {
    // auth
    LOGIN: '/auth/login/',
    REGISTER: '/auth/register/',
    PROFILE: '/auth/profile/',
    TOKEN_REFRESH: '/auth/token/refresh/',

    // documents
    DOCUMENTS: '/documents/',
    DOCUMENTS_UPLOAD: '/documents/upload/',
    DOCUMENTS_STATS: '/documents/stats/',
    DOCUMENTS_DOWNLOAD_ZIP: '/documents/download-zip/',
} as const;

// configuration des fichiers
export const FILE_CONFIG = {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB en bytes
    ACCEPTED_TYPES: [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ],
    ACCEPTED_EXTENSIONS: ['.pdf', '.docx', '.pptx'],
} as const;

// Information sur les catégories
export const CATEGORIES_INFO: Record<DocumentCategory, CategoryInfo> = {
    math: {
        key: 'math',
        label: 'Mathématiques',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: '📊'
    },
    algo: {
        key: 'algo',
        label: 'Algorithme',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: '💻'
    },
    histoire: {
        key: 'histoire',
        label: 'Histoire',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: '📚'
    },
    autres: {
        key: 'autres',
        label: 'Autres',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: '📄'
    }
} as const;


// Messages d'erreur
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Erreur de connexion. Veuillez réessayer.',
    UNAUTHORIZED: 'Session expirée. Veuillez vous reconnecter.',
    FILE_TOO_LARGE: 'Le fichier est trop volumineux (max 10MB).',
    FILE_TYPE_NOT_SUPPORTED: 'Type de fichier non supporté. Utilisez PDF, DOCX ou PPTX.',
    GENERIC_ERROR: 'Une erreur est survenue. Veuillez réessayer.',
    UPLOAD_ERROR: 'Erreur lors de l\'upload du fichier.',
    DELETE_ERROR: 'Erreur lors de la suppression du fichier.',
} as const;

// Messages de succès
export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Connexion réussie !',
    REGISTER_SUCCESS: 'Inscription réussie !',
    UPLOAD_SUCCESS: 'Fichier uploadé et classé avec succès !',
    DELETE_SUCCESS: 'Fichier supprimé avec succès !',
    LOGOUT_SUCCESS: 'Déconnexion réussie !',
} as const;


// Clés localStorage
export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
} as const;

// Configuration des toasts (4 secondes)
export const TOAST_DURATION = 4000;