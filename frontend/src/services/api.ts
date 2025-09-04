import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import {
    API_BASE_URL,
    API_ENDPOINTS,
    STORAGE_KEYS,
    ERROR_MESSAGES
} from "@/utils/constants";
import {
    AuthResponse,
    LoginCredentials,
    RegisterData,
    User,
    Document,
    DocumentListItem,
    DocumentStats,
    DocumentUploadData,
    APIError
} from "@/types";


class ApiService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json'
            },
        });

        // Intercepteur pour ajouter le token jwt a chaque requete
        this.api.interceptors.request.use(
            (config) => {
                const token = this.getAccessToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Intercepteur pour gerer les erreurs et le refresh token
        this.api.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config;

                // Si erreur 401 et qu'on n'a pas déjà tenté de refresh
                if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const refreshToken = this.getRefreshToken();
                        if (refreshToken) {
                            await this.refreshAccessToken(refreshToken);

                            // Retry la requête originale avec le nouveau token
                            const newToken = this.getAccessToken();
                            if (newToken) {
                                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                                return this.api(originalRequest);
                            }
                        }
                    } catch (refreshError) {
                        // Échec du refresh, rediriger vers login
                        this.logout();
                        if (typeof window !== 'undefined') {
                            window.location.href = '/login';
                        }
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    // methodes d'authentification
    private getAccessToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    }

    private getRefreshToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    }

    private setTokens(accessToken: string, refreshToken: string): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }

    private setUserData(user: User): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    }

    // API methods

    // connexion utilisateur
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            const response: AxiosResponse<AuthResponse> = await this.api.post(
                API_ENDPOINTS.LOGIN,
                credentials
            );

            const { tokens, user } = response.data;
            this.setTokens(tokens.access, tokens.refresh);
            this.setUserData(user);

            return response.data;

        } catch (error) {
            throw this.handleError(error);
        }

    }

    // inscription utilisateur
    async register(userData: RegisterData): Promise<AuthResponse> {
        try {
            const response: AxiosResponse<AuthResponse> = await this.api.post(
                API_ENDPOINTS.REGISTER,
                userData
            );

            const { tokens, user } = response.data;
            this.setTokens(tokens.access, tokens.refresh);
            this.setUserData(user);

            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Recuperer le profil utilisateur
    async getProfile(): Promise<User> {
        try {
            const response: AxiosResponse<User> = await this.api.get(
                API_ENDPOINTS.PROFILE
            );
            this.setUserData(response.data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // refresh du token d'acces
    async refreshAccessToken(refreshToken: string): Promise<void> {
        try {
            const response = await this.api.post(
                API_ENDPOINTS.TOKEN_REFRESH,
                { refresh: refreshToken }
            );

            const newAccessToken = response.data.access;
            const currentRefreshToken = this.getRefreshToken();

            if (newAccessToken && currentRefreshToken) {
                this.setTokens(newAccessToken, currentRefreshToken)
            }

        } catch (error) {
            throw this.handleError(error);
        }
    }

    // deconnexion
    logout(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }

    // recuperer la liste de documents
    async getDocuments(category?: string): Promise<DocumentListItem[]> {
        try {
            const params = category ? { category } : {};
            const response: AxiosResponse<DocumentListItem[]> = await this.api.get(
                API_ENDPOINTS.DOCUMENTS,
                { params }
            );

            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // recuperer les details d'un document
    async getDocument(id: number): Promise<Document> {
        try {
            const response: AxiosResponse<Document> = await this.api.get(
                `${API_ENDPOINTS.DOCUMENTS}${id}/`
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // upload d'un document
    async uploadDocument(uploadData: DocumentUploadData): Promise<Document> {
        try {
            const formData = new FormData();
            formData.append('title', uploadData.title);
            formData.append('file', uploadData.file);

            const response: AxiosResponse<Document> = await this.api.post(
                API_ENDPOINTS.DOCUMENTS_UPLOAD,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );

            return response.data;

        } catch (error) {
            throw this.handleError(error);
        }
    }

    // supprimer un document
    async deleteDocument(id: number): Promise<void> {
        try {
            await this.api.delete(`${API_ENDPOINTS.DOCUMENTS}${id}/`);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // recuperer les statistiques des documents
    async getDocumentStats(): Promise<DocumentStats> {
        try {
            const response: AxiosResponse<DocumentStats> = await this.api.get(
                API_ENDPOINTS.DOCUMENTS_STATS
            );

            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // telecharger le zip des documents organises
    async downloadDocumentsZip(): Promise<Blob> {
        try {
            const response: AxiosResponse<Blob> = await this.api.get(
                API_ENDPOINTS.DOCUMENTS_DOWNLOAD_ZIP,
                {
                    responseType: 'blob',
                }
            );

            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // verifier si l'utilisateur est authentifie
    isAuthenticated(): boolean {
        if (typeof window === 'undefined') return false;
        const token = this.getAccessToken();
        return !!token;
    }

    // recuperer les donnes utilisateur du localstorage
    getCurrentUser(): User | null {
        if (typeof window === 'undefined') return null;
        const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        return userData ? JSON.parse(userData) : null;
    }

    // gestion centralisee des erreurs
    private handleError(error: any): APIError {
        if (axios.isAxiosError(error)) {
            // erreur reseau
            if (!error.response) {
                return { message: ERROR_MESSAGES.NETWORK_ERROR };
            }

            // erreur http avec reponse
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    return { message: ERROR_MESSAGES.UNAUTHORIZED, ...data };
                case 400:
                    return { message: 'Données invalides', ...data };
                case 403:
                    return { message: 'Accès refusé', ...data };
                case 404:
                    return { message: 'Ressource non trouvée', ...data };
                case 500:
                    return { message: 'Erreur serveur', ...data };
                default:
                    return {
                        message: data?.detail || data?.message || ERROR_MESSAGES.GENERIC_ERROR,
                        ...data
                    };
            }
        }

        return { message: ERROR_MESSAGES.GENERIC_ERROR }
    }
}

// instance singleton
const apiService = new ApiService();
export default apiService;
