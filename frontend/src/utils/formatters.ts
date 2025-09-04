import { CATEGORIES_INFO } from './constants';
import { DocumentCategory } from '@/types';


// Formate la taille d'un fichier en bytes vers un format lisible
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};


// Formate une date ISO en format français

export const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};


// Formate une date en format relatif (il y a X jours)

export const formatRelativeDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return 'À l\'instant';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        return `Il y a ${diffInWeeks} semaine${diffInWeeks > 1 ? 's' : ''}`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    return `Il y a ${diffInMonths} mois`;
};

// Récupère les informations d'une catégorie
export const getCategoryInfo = (category: DocumentCategory) => {
    return CATEGORIES_INFO[category] || CATEGORIES_INFO.autres;
};


// Valide le format d'un email
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};


// Valide la force d'un mot de passe 
export const validatePassword = (password: string): { isValid: boolean; message: string } => {
    if (password.length < 8) {
        return { isValid: false, message: 'Le mot de passe doit contenir au moins 8 caractères.' };
    }

    if (!/(?=.*[a-z])/.test(password)) {
        return { isValid: false, message: 'Le mot de passe doit contenir au moins une lettre minuscule.' };
    }

    if (!/(?=.*[A-Z])/.test(password)) {
        return { isValid: false, message: 'Le mot de passe doit contenir au moins une lettre majuscule.' };
    }

    if (!/(?=.*\d)/.test(password)) {
        return { isValid: false, message: 'Le mot de passe doit contenir au moins un chiffre.' };
    }

    return { isValid: true, message: 'Mot de passe valide.' };
};


// Valide le type et la taille d'un fichier
export const validateFile = (file: File): { isValid: boolean; message: string } => {
    // Vérifier la taille
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        return {
            isValid: false,
            message: `Le fichier "${file.name}" est trop volumineux (max 10MB).`
        };
    }

    // Vérifier le type
    const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];

    if (!allowedTypes.includes(file.type)) {
        return {
            isValid: false,
            message: `Le fichier "${file.name}" n'est pas d'un type supporté (PDF, DOCX, PPTX).`
        };
    }

    return { isValid: true, message: 'Fichier valide.' };
};

// Génère un nom de fichier sécurisé
export const sanitizeFileName = (fileName: string): string => {
    return fileName
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/_{2,}/g, '_')
        .replace(/^_|_$/g, '');
};


//Tronque un texte avec des ellipses
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
};


// Capitalise la première lettre d'une chaîne
export const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};