# CONTRUBITION OU DEV

```
Avant toutes choses, merci de vouloir contribuer au projet MenjiImmoFront!.
```
 
## Comment contribuer sur ce projet ?

Pour commencer, nous recommendons de consulter la liste des issues   sur la section issues.

- Chaque issue est catégorisée et nous demandons à ce qu'une première contribution soit obligatoire.  
- Un contributeur doit  faire  un  pull requests apres la fin de l'implementation de chaque fonctionnalité.  
- Les pulls requests seront ensuite revues et traitées. L'issue associée sera mise à jour en conséquence.  
- Les commentaires doivent contenir le numéro de l'issue.

```
Sur ce projet nous allons utiliser un workflow appelé gitFlow.
```

## Comment utiliser  gitFlow ?

### Structure des branches

``` 
- main           → Branche de production (stable)
- develop        → Branche de développement (intégration)
- feature/*      → Nouvelles fonctionnalités
- release/*      → Préparation des versions
- hotfix/*       → Corrections urgentes en production  
```

### Logique de gitFlow

1. Partir de develop

    *  git checkout develop  
    *  git pull

2. Créer une branche feature 

    * git checkout -b feature/nom-de-la-fonctionnalite

3. Développer et committer 

    * git add .
    *  git commit -m "feat: description (#num-issue)"

4. Pousser et créer une Pull Request

    *  git push

5. Code Review 

    *  Attendre 1 approbation requise sur le issues

## Auteurs

**Marien manima**