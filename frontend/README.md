# ProduitFlow

ProduitFlow est une plateforme de gestion de produits et de commandes. Elle propose deux roles principaux :

- `admin` : gestion des produits, commandes, factures et utilisateurs.
- `user` : consultation du catalogue, panier, commandes et factures.

## Stack Technique

- Vite
- React 18
- TypeScript
- React Router
- Axios
- Zustand
- React Hook Form

## Installation

```bash
git clone <url-du-repository>
cd frontend
npm install
npm run dev
```

L'application sera disponible sur l'URL indiquee par Vite dans le terminal, generalement `http://localhost:5173`.

## Structure `src/`

- `api/` : configuration de l'instance Axios et des helpers API.
- `components/` : composants reutilisables, dont les elements UI, layout et routes privees.
- `features/auth/` : logique d'authentification, contexte, reducer et page de login.
- `hooks/` : hooks React personnalises.
- `pages/admin/` : pages reservees au role admin.
- `pages/user/` : pages reservees au role user.
- `services/` : appels API organises par domaine.
- `store/` : etat global de l'application.
- `types/` : interfaces et types TypeScript partages.

## Routes Disponibles

### Routes publiques

- `/login`
- `/unauthorized`

### Routes admin

- `/admin/dashboard`
- `/admin/produits`
- `/admin/commandes`
- `/admin/factures`
- `/admin/utilisateurs`

### Routes user

- `/user/catalogue`
- `/user/produit/:id`
- `/user/panier`
- `/user/commandes`
- `/user/factures`

La route `/` redirige vers `/login`.

## Workflow Git

1. Creer une branche depuis `main` :

```bash
git checkout main
git pull
git checkout -b feature/nom-de-la-fonctionnalite
```

2. Commiter les changements :

```bash
git add .
git commit -m "Description claire des changements"
```

3. Pusher la branche :

```bash
git push origin feature/nom-de-la-fonctionnalite
```

4. Ouvrir une Pull Request vers `main` depuis la plateforme Git.

## Backend

Le backend doit tourner separement sur `http://localhost:5000/api`. Pensez a le lancer avant d'utiliser les fonctionnalites qui appellent l'API.
