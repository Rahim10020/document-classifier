
'use client';

import { useState, useEffect, useCallback } from 'react';
import apiService from '@/services/api';
import {
    DocumentsState,
    DocumentListItem,
    DocumentStats,
    DocumentUploadData,
    DocumentCategory,
    Document
} from '@/types';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/utils/constants';

export const useDocuments = () => {
    const [documentsState, setDocumentsState] = useState<DocumentsState>({
        documents: [],
        stats: null,
        isLoading: true,
        error: null,
    });

    const [uploadProgress, setUploadProgress] = useState<{
        isUploading: boolean,
        fileName: string | null,
    }>({
        isUploading: false,
        fileName: null
    });

    // charger les documents au montage du composant 
    useEffect(() => {
        loadDocuments();
        loadStats();
    }, []);


    // charger la liste des documents
    const loadDocuments = useCallback(async (category?: DocumentCategory) => {
        setDocumentsState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const documents = await apiService.getDocuments(category);
            setDocumentsState(prev => ({
                ...prev,
                documents,
                isLoading: false,
            }));
        } catch (error: any) {
            setDocumentsState(prev => ({
                ...prev,
                isLoading: false,
                error: error.message || ERROR_MESSAGES.GENERIC_ERROR,
            }));
        }
    }, []);


    // charger les statistiques
    const loadStats = useCallback(async () => {
        try {
            const stats = await apiService.getDocumentStats()
            setDocumentsState(prev => ({
                ...prev,
                stats,
            }));
        } catch (error: any) {
            console.error('Error lors du changement des statistiques:', error);
        }
    }, []);


    // upload d'un document
    const uploadDocument = useCallback(async (file: File, title?: string): Promise<Document> => {
        const fileName = file.name;
        const documentTitle = title || fileName.split('.')[0];

        setUploadProgress({
            isUploading: true,
            fileName,
        });

        try {
            const uploadData: DocumentUploadData = {
                title: documentTitle,
                file,
            };

            const document = await apiService.uploadDocument(uploadData);

            // Recharger la liste des documents et les stats
            await Promise.all([loadDocuments(), loadStats()]);

            setUploadProgress({
                isUploading: false,
                fileName: null,
            });

            return document;
        } catch (error: any) {
            setUploadProgress({
                isUploading: false,
                fileName: null,
            });

            throw error;
        }
    }, [loadDocuments, loadStats]);


    // Upload multiple de documents

}