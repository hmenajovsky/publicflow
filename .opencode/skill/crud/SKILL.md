---
name: crud
description: Méthode réutilisable pour analyser et réaliser un CRUD dans une application existante.
---

# CRUD

## Analyse

Avant toute modification :

1. Comprendre le besoin fonctionnel et le périmètre du CRUD.
2. Explorer le projet et identifier les conventions existantes.
3. Identifier le modèle de données et ses éventuelles relations.
4. Identifier les opérations et interfaces nécessaires.
5. Examiner les tests existants et déterminer les comportements à couvrir.

## Planification

Proposer un plan d'implémentation avant toute modification.

Le plan doit préciser :

- les éléments à créer ou modifier ;
- les principales étapes de réalisation ;
- les tests à ajouter ou adapter ;
- les éventuels choix techniques nécessitant une validation.

**Attendre explicitement la validation humaine du plan avant de modifier les fichiers.**

## Implémentation

Après validation du plan :

1. Implémenter le CRUD en respectant l'architecture et les conventions du projet.
2. Ajouter les tests correspondant aux principaux comportements attendus.
3. Limiter les modifications au périmètre validé.
4. Signaler toute modification sortant de ce périmètre.

## Vérification

1. Exécuter les tests.
2. Vérifier les principaux parcours du CRUD.
3. Analyser les éventuels échecs.
4. Corriger les problèmes rencontrés.
5. Vérifier qu'aucun comportement existant n'a été dégradé.

## Compte rendu

Indiquer :

- les fichiers créés ou modifiés ;
- les fonctionnalités réalisées ;
- les tests ajoutés et leur résultat ;
- les éventuels problèmes rencontrés ;
- les choix ou points nécessitant une vérification humaine.
