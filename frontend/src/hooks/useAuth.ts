'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '@/services/api';
import { AuthState, LoginCredentials, RegisterData, User } from '@/types';
import { SUCCESS_MESSAGES } from '@/utils/constants';

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true
    });

    const router = useRouter();

    // verifier l'etat d'authentification au chargement
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                if (apiService.isAuthenticated()) {
                    const user = apiService.getCurrentUser();
                    if (user) {
                        // verifier que le token est toujours valide
                        try {
                            const updatedUser = await apiService.getProfile();
                            setAuthState({
                                user: updatedUser,
                                isAuthenticated: true,
                                isLoading: false,
                            });
                        } catch (error) {
                            // token invalide. Nettoyer et decconnecter
                            apiService.logout();
                            setAuthState({
                                user: null,
                                isAuthenticated: false,
                                isLoading: false
                            });
                        }
                    } else {
                        setAuthState({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false
                        });
                    }
                } else {
                    setAuthState({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false
                    });
                }
            } catch (error) {
                setAuthState({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false
                });
            }
        };

        initializeAuth();
    }, []);


    // Fonction de connexion
    const login = useCallback(async (credentials: LoginCredentials) => {
        setAuthState(prev => ({ ...prev, isLoading: true }));

        try {
            const response = await apiService.login(credentials);

            setAuthState({
                user: response.user,
                isAuthenticated: true,
                isLoading: false
            });

            // rediriger vers le dashboard
            router.push('/dashboard');

            return { success: true, message: SUCCESS_MESSAGES.LOGIN_SUCCESS };
        } catch (error: any) {
            setAuthState(prev => ({
                ...prev, isLoading: false,
            }));

            throw error;
        }
    }, [router]);


    // fonction d'inscription
    const register = useCallback(async (userData: RegisterData) => {
        setAuthState(prev => ({ ...prev, isLoading: true }));

        try {
            const response = await apiService.register(userData);

            setAuthState({
                user: response.user,
                isAuthenticated: true,
                isLoading: false
            });

            // rediriger vers le dashboard
            router.push('/dashboard');

            return { success: true, message: SUCCESS_MESSAGES.REGISTER_SUCCESS };

        } catch (error: any) {
            setAuthState(prev => ({ ...prev, isLoading: false }));
            throw error;
        }
    }, [router]);


    // Fonction de deconnexion
    const logout = useCallback(() => {
        apiService.logout();
        setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
        });

        // rediriger vers le login
        router.push('/login');

    }, [router]);


    // fonction pour mettre a jour les donnees utilisateurs
    const updateUser = useCallback(async (): Promise<User | null> => {
        try {
            const user = await apiService.getProfile();
            setAuthState(prev => ({ ...prev, user }));

            return user;
        } catch (error) {
            console.error("Erreur lors de la mise a jour du profil");
            return null;
        }
    }, []);


    // fonction pour verifier si l'utilisateur est authentifie
    const requireAuth = useCallback(() => {
        if (!authState.isLoading && !authState.isAuthenticated) {
            router.push('/login');
            return false;
        }
        return authState.isAuthenticated;
    }, [authState.isAuthenticated, authState.isLoading, router]);


    // Fonction pour rediriger les utilisateurs authenfies (utile pour les pages login/register)
    const requireGuest = useCallback(() => {
        if (!authState.isLoading && !authState.isAuthenticated) {
            router.push('/dashboard');
            return false;
        }
        return !authState.isAuthenticated;
    }, [authState.isAuthenticated, authState.isLoading, router]);


    return {
        // Etat
        user: authState.user,
        isAuthenticated: authState.isAuthenticated,
        isLoading: authState.isLoading,

        // actions
        login,
        register,
        logout,
        updateUser,

        // utilitaires
        requireAuth,
        requireGuest
    };

};