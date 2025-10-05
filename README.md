# CasaDividendes

La première plateforme dédiée aux dividendes de la Bourse de Casablanca (BVC).

## Description

CasaDividendes est une application web moderne qui fournit :
- Un calendrier des dividendes avec ex-dates et dates de paiement
- Un palmarès des sociétés par rendement
- Des fiches détaillées pour chaque société
- Des outils d'analyse et de suivi

## Installation

```bash
npm install
```

## Commandes

### Développement
```bash
npm run dev
```
Lance le serveur de développement sur http://localhost:5173

### Build de production
```bash
npm run build
```
Crée une version optimisée pour la production dans `/dist`

### Preview de production
```bash
npm run preview
```
Prévisualise le build de production localement

## Étape 1 — Home (prod)

### Changements effectués

#### 1. Structure & Code Split
- ✅ Créé `src/pages/Home.jsx` avec toutes les sections de la page d'accueil
- ✅ Sections extraites : Hero, Values, PalmaresPreview, Newsletter, PremiumBand
- ✅ App.jsx nettoyé et importation du composant Home
- ✅ Suppression du code mort et des imports inutilisés
- ✅ Removed `useEffect` import (non utilisé)

#### 2. Styling & Accessibilité
- ✅ Hiérarchie des titres corrigée :
  - `h1` pour le Hero principal
  - `h2` pour les titres de sections
  - Utilisation de `sr-only` pour les titres cachés visuellement mais accessibles
- ✅ ARIA labels ajoutés :
  - `aria-label` sur tous les boutons interactifs
  - `aria-labelledby` sur les sections
  - `aria-current="page"` pour la navigation active
  - `aria-pressed` pour les boutons toggle
  - `scope="col"` et `scope="row"` pour les tableaux
  - `aria-hidden="true"` pour les éléments décoratifs
- ✅ États de focus améliorés :
  - `focus:outline-none focus:ring-2 focus:ring-teal-400` sur tous les éléments interactifs
  - Contraste WCAG AA respecté (ratio > 4.5:1)
  - `focus:ring-offset` pour meilleure visibilité
- ✅ Formulaires accessibles :
  - Labels avec `htmlFor` et `id` associés
  - `sr-only` pour labels cachés visuellement
  - `required` et `aria-required` pour champs obligatoires
  - Types d'input appropriés (`email`, `search`, etc.)

#### 3. Performance
- ✅ Meta `theme-color` ajoutée pour mobile
- ✅ SVG favicon optimisé (moins de 1KB)
- ✅ Pas d'images externes bloquantes
- ✅ Illustrations en CSS (gradients, pas d'images)
- ✅ Build optimisé :
  - HTML: 2.91 KB (0.91 KB gzippé)
  - CSS: 17.71 KB (4.12 KB gzippé)
  - JS: 184.60 KB (54.23 KB gzippé)

#### 4. SEO & Social
- ✅ Balises meta complètes :
  - Title optimisé (60 caractères)
  - Description détaillée (155 caractères)
  - Keywords pertinents
  - Author et robots
- ✅ Open Graph (Facebook) :
  - og:title, og:description, og:type, og:url
  - og:image, og:locale, og:site_name
- ✅ Twitter Cards :
  - twitter:card (summary_large_image)
  - twitter:title, twitter:description
  - twitter:image, twitter:url
- ✅ Favicon complet :
  - SVG moderne
  - PNG fallback (16x16, 32x32)
  - Apple touch icon (180x180)
  - Web manifest
- ✅ Canonical URL configurée
- ✅ Format-detection pour téléphones

#### 5. Navigation
- ✅ Tous les liens header/footer fonctionnels
- ✅ Navigation accessible avec `aria-label`
- ✅ Logo cliquable pour retour accueil
- ✅ États actifs visuels avec `aria-current`

#### 6. Responsiveness
- ✅ Mobile-first avec Tailwind
- ✅ Breakpoints testés :
  - 360px (mobile small)
  - 768px (tablet)
  - 1024px (laptop)
  - 1440px (desktop)
- ✅ Grilles adaptatives (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
- ✅ Textes fluides (`text-3xl md:text-5xl`)
- ✅ Espacement cohérent (`gap`, `p-`, `m-`)
- ✅ Débordement horizontal évité (`overflow-x-auto` sur tableaux)
- ✅ Flexwrap sur tous les conteneurs flex

#### 7. Quality Gates
- ✅ Build réussi sans erreurs
- ✅ Aucun avertissement console
- ✅ Imports React optimisés (useState seulement où nécessaire)
- ✅ Keys uniques sur tous les .map() (`${item.t}-${i}`)
- ✅ Échappement des apostrophes (`&apos;`)
- ✅ Transitions fluides (`transition-all`, `transition-colors`)

### Validation

#### Test en développement
```bash
npm run dev
# Ouvrir http://localhost:5173
# Vérifier :
# - Navigation entre toutes les pages
# - Responsive sur différentes tailles
# - Aucune erreur console
# - Focus keyboard accessible
```

#### Test en production
```bash
npm run build
npm run preview
# Ouvrir http://localhost:4173
# Vérifier :
# - Assets chargés correctement
# - Performance optimale
# - Favicon visible
```

#### Lighthouse (recommandé)
```bash
# Installer lighthouse-cli si nécessaire
npm install -g lighthouse

# Lancer l'audit
lighthouse http://localhost:4173 --view

# Cibles attendues :
# - Performance: > 90
# - Accessibility: 100
# - Best Practices: > 95
# - SEO: 100
# - LCP < 2.5s
# - CLS < 0.1
```

### Checklist de production

- [x] Code split (Home.jsx séparé)
- [x] Accessibilité WCAG AA
- [x] SEO complet (meta tags, OG, Twitter)
- [x] Favicon multi-format
- [x] Responsive 360-1440px
- [x] Performance optimisée
- [x] Zero console errors
- [x] Build réussi
- [x] Navigation fonctionnelle
- [x] Focus states visibles

## Technologies

- **React 18** - Bibliothèque UI
- **Vite 5** - Build tool
- **Tailwind CSS 3** - Framework CSS
- **React Router** - Navigation (client-side routing via state)

## Structure

```
/
├── src/
│   ├── pages/
│   │   └── Home.jsx          # Page d'accueil (prod-ready)
│   ├── App.jsx               # Router principal + autres pages
│   ├── main.jsx              # Point d'entrée
│   └── index.css             # Styles globaux Tailwind
├── public/
│   ├── favicon.svg           # Favicon SVG
│   └── site.webmanifest      # PWA manifest
├── index.html                # Template HTML avec SEO
└── README.md                 # Documentation

```

## Notes de développement

### Conventions de code
- Composants fonctionnels React
- Hooks (useState) pour l'état local
- Tailwind pour tous les styles
- Pas de CSS-in-JS
- Props destructurées

### Accessibilité
- Focus visible sur tous les éléments interactifs
- Navigation au clavier fonctionnelle
- ARIA labels sur éléments complexes
- Hiérarchie sémantique HTML5

### Performance
- Lazy loading des images (quand implémenté)
- Code splitting par page
- Minification en production
- Tree-shaking automatique

## Étape 2 — Pages principales & navigation

### Dépendances & Routage

**Versions installées** :
- `react-router-dom@6.22.0` - Routing SPA avec React Router v6
- `react-helmet-async@2.0.5` - Meta tags dynamiques par page

**Commandes d'installation** :
```bash
# Installation des dépendances
npm install react-router-dom@^6.22.0 react-helmet-async@^2.0.5

# En cas d'erreur "[plugin:vite:import-analysis] Failed to resolve import"
rm -rf node_modules package-lock.json
npm install

# Vérifier l'installation
npm list react-router-dom react-helmet-async
```

### Changements effectués

#### 1. Installation des dépendances
- ✅ Installé `react-router-dom` v6.22.0 pour la navigation
- ✅ Installé `react-helmet-async` v2.0.5 pour les meta tags dynamiques
- ✅ Configuration avec `createRoot` de React 18
- ✅ Lazy loading avec `React.lazy()` et `Suspense`

#### 2. Structure des pages
Toutes les pages ont été extraites dans `src/pages/` :
- ✅ **Calendar.jsx** - Calendrier complet des dividendes avec filtres
- ✅ **Rankings.jsx** - Palmarès des sociétés
- ✅ **Company.jsx** - Fiche détaillée d'une société (dynamique avec :ticker)
- ✅ **Premium.jsx** - Page d'abonnement Premium
- ✅ **Blog.jsx** - Blog et articles pédagogiques
- ✅ **About.jsx** - À propos & formulaire de contact
- ✅ **Legal.jsx** - Mentions légales & CGU
- ✅ **NotFound.jsx** - Page 404 avec liens de retour

#### 3. Composants partagés
- ✅ `src/components/StatCard.jsx` - Composants réutilisables (StatCard, Pill)
- ✅ `src/utils/calendar.js` - Utilitaires pour le calendrier
- ✅ `src/data/companies.js` - Données centralisées des sociétés

#### 4. React Router
- ✅ Intégration complète de React Router v6
- ✅ `<BrowserRouter>` dans main.jsx
- ✅ `<Routes>` et `<Route>` dans App.jsx
- ✅ Navigation via `<Link>` dans Header et Footer
- ✅ `useNavigate()` pour navigation programmatique
- ✅ `useParams()` pour routes dynamiques (/company/:ticker)
- ✅ `useLocation()` pour état actif de la navigation
- ✅ Route 404 avec `path="*"`

#### 5. SEO dynamique par page
Chaque page utilise `react-helmet-async` :
- ✅ `<title>` unique par page
- ✅ `<meta name="description">` personnalisée
- ✅ Maintien de `lang="fr"` dans index.html

#### 6. O2switch compatibility
- ✅ `.htaccess` dans `/public` pour redirections
- ✅ Gestion des routes frontend avec RewriteRule
- ✅ Compatible hébergement Apache

### Routes disponibles

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Page d'accueil |
| `/calendar` | Calendar | Calendrier des dividendes |
| `/rankings` | Rankings | Palmarès |
| `/company/:ticker` | Company | Fiche société (IAM, BCP, ATW, etc.) |
| `/premium` | Premium | Offre Premium |
| `/blog` | Blog | Articles & guides |
| `/about` | About | Contact |
| `/legal` | Legal | Mentions légales |
| `/*` | NotFound | 404 |

### Test de navigation

```bash
# Dev
npm run dev
# Tester toutes les routes :
# → http://localhost:5173/
# → http://localhost:5173/calendar
# → http://localhost:5173/rankings
# → http://localhost:5173/company/IAM
# → http://localhost:5173/premium
# → http://localhost:5173/blog
# → http://localhost:5173/about
# → http://localhost:5173/legal
# → http://localhost:5173/404 (devrait afficher NotFound)

# Production
npm run build
npm run preview
# Tester routes en production sur http://localhost:4173
```

### Caractéristiques techniques

#### Navigation SPA (Single Page Application)
- ✅ Pas de rechargement de page
- ✅ Historique navigateur fonctionnel (back/forward)
- ✅ Liens partageables
- ✅ États actifs dans la navigation

#### Performance
- **Build size** (avec code splitting) :
  - HTML: 2.91 KB (0.91 KB gzippé)
  - CSS: 18.03 KB (4.18 KB gzippé)
  - JS principal: 184.62 KB (60.48 KB gzippé)
  - Home: 7.63 KB (2.30 KB gzippé)
  - Calendar: 11.77 KB (3.23 KB gzippé)
  - Company: 5.15 KB (1.70 KB gzippé)
  - Premium: 3.46 KB (1.12 KB gzippé)
  - Blog: 4.57 KB (1.34 KB gzippé)
  - About: 3.88 KB (1.21 KB gzippé)
  - Rankings: 3.09 KB (1.16 KB gzippé)
  - Legal: 1.31 KB (0.59 KB gzippé)
  - NotFound: 1.41 KB (0.63 KB gzippé)
- ✅ Code splitting automatique par route
- ✅ Lazy loading avec React.lazy() et Suspense
- ✅ Chargement progressif des pages

#### Accessibilité
- ✅ `aria-current="page"` sur lien actif
- ✅ `aria-label` sur navigation
- ✅ Focus states sur tous les liens
- ✅ Navigation au clavier

### Checklist de validation

- [x] Toutes les pages créées et isolées
- [x] React Router configuré
- [x] Navigation fonctionne sans reload
- [x] Routes dynamiques (/company/:ticker)
- [x] Page 404 opérationnelle
- [x] SEO meta tags sur chaque page
- [x] .htaccess pour production
- [x] Build réussi
- [x] Aucune erreur console
- [x] Links accessibles

## Prochaines étapes

1. **Images réelles** : Remplacer les placeholders CSS par de vraies images WebP
2. **Données dynamiques** : Connecter à une API ou base de données Supabase
3. **Authentification** : Système de login pour fonctionnalités Premium
4. **Analytics** : Intégrer Google Analytics ou Matomo
5. **Tests** : Ajouter tests unitaires (Vitest) et E2E (Playwright)
6. **i18n** : Support multilingue (FR/AR/Darija)
7. **Mobile menu** : Ajouter hamburger menu pour navigation mobile

## Licence

© 2025 CasaDividendes. Tous droits réservés.
