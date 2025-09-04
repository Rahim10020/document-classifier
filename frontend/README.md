# DocClassifier Frontend

Application Next.js pour la classification automatique de documents avec IA.

## 🚀 Fonctionnalités

- **Authentification** : Inscription et connexion sécurisées
- **Upload de documents** : Drag & drop pour PDF, DOCX, PPTX
- **Classification automatique** : IA pour catégoriser les documents
- **Interface moderne** : TailwindCSS avec composants réutilisables
- **Gestion d'état** : Hooks personnalisés pour auth et documents
- **Notifications** : Toasts pour feedback utilisateur
- **Responsive** : Interface adaptative mobile/desktop

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn
- Backend Django DRF fonctionnel

## 🛠️ Installation

1. **Installer les dépendances**
```bash
cd frontend
npm install
```

2. **Configuration environnement**
```bash
# Créer .env.local
cp .env.example .env.local
```

Configurer les variables dans `.env.local` :
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

3. **Lancer en développement**
```bash
npm run dev
```

L'application sera disponible sur http://localhost:3000

## 🏗️ Structure du projet

```
frontend/
├── src/
│   ├── app/                    # App Router Next.js
│   │   ├── (auth)/            # Pages d'authentification
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/         # Pages du dashboard
│   │   │   ├── stats/
│   │   │   └── page.tsx
│   │   ├── layout.tsx         # Layout racine
│   │   └── page.tsx           # Page d'accueil
│   ├── components/            # Composants réutilisables
│   │   ├── ui/               # Composants UI de base
│   │   ├── auth/             # Composants d'authentification
│   │   ├── dashboard/        # Composants du dashboard
│   │   └── common/           # Composants communs
│   ├── hooks/                # Hooks personnalisés
│   │   ├── useAuth.ts        # Gestion authentification
│   │   ├── useDocuments.ts   # Gestion documents
│   │   └── useToast.ts       # Notifications
│   ├── services/             # Services API
│   │   └── api.ts            # Client Axios configuré
│   ├── types/                # Types TypeScript
│   │   └── index.ts
│   └── utils/                # Utilitaires
│       ├── constants.ts      # Constantes
│       ├── formatters.ts     # Fonctions de formatage
│       └── cn.ts            # Utility classes
├── public/                   # Assets statiques
└── package.json
```

## 🔧 Scripts disponibles

```bash
# Développement
npm run dev

# Build production
npm run build

# Démarrer production
npm run start

# Linter
npm run lint
```

## 🎨 Composants UI

### Composants de base
- `Button` : Boutons avec variants et états
- `Input` : Champs de saisie avec validation
- `Card` : Conteneurs avec variants
- `Toast` : Notifications temporaires

### Hooks personnalisés
- `useAuth` : Gestion complète de l'authentification
- `useDocuments` : CRUD documents avec état global  
- `useToast` : Système de notifications

## 📡 Intégration API

Le service API (`src/services/api.ts`) gère :
- Authentification JWT avec refresh automatique
- Upload de fichiers multipart
- Gestion centralisée des erreurs
- Intercepteurs pour les tokens

### Endpoints utilisés
```
POST /api/auth/login/           # Connexion
POST /api/auth/register/        # Inscription
GET  /api/auth/profile/         # Profil utilisateur
POST /api/auth/token/refresh/   # Refresh token

GET  /api/documents/            # Liste documents
POST /api/documents/upload/     # Upload document
GET  /api/documents/{id}/       # Détails document
DELETE /api/documents/{id}/     # Supprimer document
GET  /api/documents/stats/      # Statistiques
GET  /api/documents/download-zip/ # Télécharger ZIP
```

## 🔒 Sécurité

- JWT stockés en localStorage avec refresh automatique
- Protection des routes par middleware
- Validation côté client des formulaires
- Sanitisation des noms de fichiers
- Gestion des erreurs CORS

## 🚀 Déploiement

### Vercel (recommandé)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configuration env vars sur dashboard Vercel
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

### Autres plateformes
```bash
# Build
npm run build

# Les fichiers de production sont dans .next/
# Configurer votre serveur pour servir ces fichiers
```

## 🧪 Fonctionnalités avancées

### Classification automatique
- Upload drag & drop multiple
- Validation fichiers (taille, type)
- Classification par IA backend
- Aperçu du contenu extrait
- Mots-clés détectés

### Interface utilisateur
- Mode sombre/clair (à implémenter)
- Animations fluides
- États de chargement
- Gestion d'erreurs gracieuse
- Interface responsive

### Performance
- Lazy loading des composants
- Optimisation des images Next.js
- Mise en cache des requêtes
- Bundle splitting automatique

## 🐛 Dépannage

### Erreurs communes

**1. Erreur CORS**
```
Vérifier CORS_ALLOWED_ORIGINS dans le backend Django
```

**2. Token expiré**
```
Le refresh est automatique, vérifier la configuration JWT
```

**3. Upload échoue**
```
Vérifier FILE_UPLOAD_MAX_MEMORY_SIZE côté Django
Valider les types de fichiers côté client
```

### Variables d'environnement
```env
# Production
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api

# Développement
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 📝 To-Do / Améliorations

- [ ] Mode sombre
- [ ] Tests unitaires avec Jest
- [ ] Tests E2E avec Playwright
- [ ] PWA Support
- [ ] Internationalisation (i18n)
- [ ] Gestion offline
- [ ] Analytics utilisateur
- [ ] Compression d'images
- [ ] Pagination des documents
- [ ] Recherche avancée
- [ ] Tri personnalisé
- [ ] Export CSV des stats

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/improvement`)
3. Commit (`git commit -am 'Add improvement'`)
4. Push (`git push origin feature/improvement`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.