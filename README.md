# PublicFlow

PublicFlow est une application pédagogique permettant de consulter des dispositifs d'accompagnement public et de déposer des demandes.

Le projet sert de support aux ateliers de développement avec l'IA.

Les fonctionnalités de l'application seront construites progressivement à partir de User Stories, en utilisant un agent IA de développement.

## Stack

* Next.js 14
* TypeScript
* Tailwind CSS
* Prisma 6
* SQLite
* npm

## Installation

Après avoir cloné le dépôt :

```bash
npm install
```

## Configuration

Créer un fichier `.env` à la racine du projet avec :

```env
DATABASE_URL="file:./dev.db"
```

## Base de données

Le projet utilise SQLite avec Prisma.

Pour initialiser la base de données :

```bash
npm run db:migrate
```

Les données de démonstration pourront ensuite être chargées avec :

```bash
npm run db:seed
```

## Lancer l'application

Démarrer le serveur de développement :

```bash
npm run dev
```

Puis ouvrir :

```text
http://localhost:3000
```

Si le port 3000 est déjà utilisé, Next.js proposera automatiquement un autre port. Utiliser alors l'adresse indiquée dans le terminal.

## Vérifications

Pour vérifier le code :

```bash
npm run lint
```

Pour construire l'application :

```bash
npm run build
```

> Pendant le workshop, ne pas lancer systématiquement `npm run lint` ou `npm run build` après chaque modification. Ces commandes servent principalement aux vérifications finales.

## Structure

Les principaux éléments du projet sont :

* `app/` — pages et routes de l'application
* `components/` — composants React réutilisables
* `lib/` — logique applicative
* `prisma/schema.prisma` — modèle de données
* `prisma/migrations/` — migrations de la base de données
* `prisma/seed.ts` — données de démonstration
* `public/` — fichiers statiques

## Workshop

Le projet démarre volontairement avec un socle technique minimal.

Les fonctionnalités seront développées progressivement à partir de User Stories, avec une démarche :

**Contexte → User Story → Agent → Test → Observation → Itération → Validation**
