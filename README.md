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

## Prochaines étapes

1. **Images réelles** : Remplacer les placeholders CSS par de vraies images WebP
2. **Données dynamiques** : Connecter à une API ou base de données
3. **Authentification** : Système de login pour fonctionnalités Premium
4. **Analytics** : Intégrer Google Analytics ou Matomo
5. **Tests** : Ajouter tests unitaires (Vitest) et E2E (Playwright)
6. **i18n** : Support multilingue (FR/AR/Darija)

## Licence

© 2025 CasaDividendes. Tous droits réservés.
