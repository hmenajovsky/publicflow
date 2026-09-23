# AGENTS.md — PublicFlow

## Objectif

L'application permet de **consulter des dispositifs d'accompagnement public** et de **déposer une demande** pour ces dispositifs.

Volontairement **simple**, elle sert de **support pédagogique** pour travailler avec un agent IA de développement : le code reste minimal, compréhensible et didactique.

## Entités principales (modèle Prisma en place)

* **Dispositif (Program)** — un dispositif d'accompagnement consultable : nom, description, dates, catégorie et capacité.
  Champs : `id`, `name`, `description`, `startDate`, `endDate`, `category`, `capacity`, `createdAt`.
* **Usager (User)** — une personne enregistrée dans l'application.
  Champs : `id`, `name`, `email` (`@unique`), `createdAt`.
* **Demande (Application)** — lien entre un usager et un dispositif (`@unique` sur `programId` + `userId`).
  Champs : `id`, `programId`, `userId`, `status`, `createdAt`.
* Relations : `Program` 1―N `Application`, `User` 1―N `Application` (cascade à la suppression).
* **ApplicationStatus** (`enum`) : `CONFIRMED` | `WAITLISTED`.

## Stack (à conserver)

* Next.js 14 (App Router)
* TypeScript
* Tailwind CSS
* ESLint (`next/core-web-vitals`)
* npm
* **Prisma 6** (SQLite), Client généré via `prisma-client-js`

## Structure

* `app/` — routes et pages (App Router à la racine, pas de dossier `src/`)
* `app/layout.tsx` — layout racine
* `app/page.tsx` — page d'accueil
* `app/globals.css` — styles globaux Tailwind
* `app/fonts/` — polices locales Geist
* `prisma/schema.prisma` — modèle de données (source de vérité)
* `prisma/migrations/` — migrations appliquées, ne pas modifier à la main
* `prisma/seed.ts` — données de test
* `.env` — `DATABASE_URL` (SQLite `file:./dev.db`, ne pas committer)
* `public/` — fichiers statiques (s'il est créé)
* `next.config.mjs`, `postcss.config.mjs`, `tailwind.config.ts`, `tsconfig.json` — configuration

## Conventions de code

* Composants React en **fonction composant** + hooks
* Composants serveur par défaut ; `"use client"` uniquement si nécessaire
* Imports via l'alias `@/*`
* Composants UI supplémentaires dans `app/` ou un dossier dédié (à définir)
* Pas d'import d'images distantes sans configurer `next.config.mjs`
* Tailwind via classes utilitaires ; pas de CSS custom sauf exceptions (`globals.css`)
* TypeScript strict : typer props et retours, éviter `any`

## À ne pas toucher (sans besoin explicite)

* `app/fonts/` — police Geist locale (suppression/renommage possible, mais à conserver par défaut)
* `package.json` — configuration et dépendances du projet
* `next.config.mjs`, `postcss.config.mjs`, `tailwind.config.ts` — configuration de base
* Versionnement : `next@14` et `prisma@6` ne doivent PAS être migrés vers des versions majeures supérieures sans validation
* `.gitignore` — ne pas y committer de secrets ni `node_modules`

## Base de données

* SQLite via Prisma 6 ; migrations dans `prisma/migrations/`.
* `prisma/schema.prisma` constitue la source de vérité du modèle.
* Le client doit être régénéré après modification du schéma : `npx prisma generate`
  (automatique avec `npm run db:migrate`).

## Vérification

* `npm run dev` — serveur de développement
* `npm run build` — build de production validant compile, lint et types
* `npm run lint` — lint ESLint
* `npm run db:migrate` (ou `npx prisma migrate dev`) — créer/appliquer une migration
* `npm run db:seed` — réinitialiser et recharger les données de test
* `npm run db:studio` — explorer la base avec Prisma Studio

## Environnement de développement

* Un serveur de développement peut déjà être lancé pour le projet.
* Ne lance pas `npm run dev` de ta propre initiative.
* Pour vérifier l'application, utilise le serveur existant.
* Ne démarre un autre serveur que sur demande explicite de l'utilisateur.
