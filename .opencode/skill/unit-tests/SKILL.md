---
name: unit-tests
description: Méthode réutilisable pour analyser une fonctionnalité et produire des tests unitaires pertinents à partir du besoin fonctionnel et du code existant.
---

# Tests unitaires

## Analyse

Avant d'écrire des tests :

1. Comprendre le comportement attendu à partir de la User Story et de ses critères d'acceptation.
2. Explorer le code concerné et son contexte.
3. Examiner les tests unitaires déjà présents et identifier les conventions du projet.
4. Identifier les comportements à tester :
   - cas nominaux ;
   - cas limites ;
   - cas d'erreur ou comportements invalides.
5. Distinguer les comportements déjà couverts de ceux qui restent à tester.

## Planification

Proposer un plan de tests priorisé avant toute modification.

Le plan doit :
- couvrir les comportements métier importants ;
- éviter les tests redondants ;
- rester proportionné au périmètre de la tâche ;
- signaler les points nécessitant une vérification humaine.

**Attendre la validation du plan avant de modifier les fichiers**.

## Implémentation

Après validation :

1. Créer ou compléter les tests en respectant le framework et les conventions existants.
2. Privilégier les tests de comportement plutôt que les détails d'implémentation.
3. Limiter les modifications du code applicatif au strict nécessaire pour permettre les tests.
4. Signaler explicitement toute modification du code applicatif.

## Vérification

1. Exécuter la suite de tests.
2. Analyser les éventuels échecs.
3. Corriger les problèmes rencontrés.
4. Vérifier que les tests ajoutés correspondent aux comportements attendus.
5. Identifier les comportements importants qui restent éventuellement non couverts.

## Compte rendu

Indiquer :
- les fichiers de tests créés ou modifiés ;
- les comportements couverts ;
- le nombre de tests ajoutés ;
- les problèmes rencontrés ;
- les modifications éventuelles du code applicatif ;
- les points nécessitant une vérification humaine.