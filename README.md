# Bellman-Kalaba - Recherche de chemin optimal

Petite application web pour visualiser et calculer le chemin optimal (minimal ou maximal) dans un graphe orienté, en utilisant l'algorithme de Bellman-Kalaba (programmation dynamique).

Ce projet a été fait dans le cadre d'un cours de recherche opérationnelle, avec l'idée de rendre l'algo un peu plus concret qu'un simple tableau de calcul sur papier : ici on construit le graphe à la souris, on lance le calcul, et on voit directement le résultat dessiné sur le graphe.

## Fonctionnalités

- Création de sommets et d'arcs directement sur un canvas (glisser-déposer, clic droit pour les menus)
- Renommage et suppression des sommets et des arcs
- Choix du sommet de départ et d'arrivée
- Deux modes de calcul : minimisation (plus court chemin) et maximisation (plus long chemin)
- Détection automatique des cycles dans le graphe : en cas de cycle, seul l'arc de valeur minimale du cycle est ignoré pour le calcul (il reste visible sur le graphe, il est juste exclu du calcul)
- Affichage de **tous** les chemins optimaux quand plusieurs chemins ont exactement la même valeur (pas seulement le premier trouvé)
- Tableau des itérations de l'algorithme, pour suivre l'évolution des valeurs à chaque étape
- Thème clair / sombre
- Aucun backend : tout tourne côté client, en React

## Stack technique

- React (via Vite)
- Canvas natif pour le dessin du graphe (pas de librairie de graphe externe)
- lucide-react pour les icônes
- Pas de gestion d'état externe (Redux, etc.), tout est fait avec les hooks React

## Installation

```bash
git clone https://github.com/Fanantenana-RAKOTO/recherche-operationnelle-.git
cd bellman-kalaba
npm install
npm run dev
```

L'application est ensuite disponible sur `http://localhost:5173`.

## Utilisation

1. Ajouter des sommets depuis le panneau de gauche (donner un nom ou un numéro).
2. Déplacer les sommets sur le canvas si besoin pour mieux organiser le graphe.
3. Clic droit sur un sommet → "Ajouter un arc", puis cliquer sur le sommet d'arrivée pour créer la liaison (une valeur sera demandée).
4. Choisir le sommet de départ et d'arrivée dans le panneau de gauche.
5. Choisir le mode (minimisation ou maximisation).
6. Cliquer sur "Calculer".

Le résultat s'affiche dans le panneau du bas (valeur optimale + liste des chemins) et directement sur le graphe (les arcs et sommets du/des chemin(s) optimal(aux) sont mis en couleur).

Le fichier `algorithms/bellmanKalaba.js` peut être testé et réutilisé indépendamment de l'interface, si un jour on veut ajouter des tests unitaires ou réutiliser l'algo ailleurs.

## Limites connues

- Pas de sauvegarde du graphe (tout est perdu au rechargement de la page). Ce serait la prochaine amélioration logique (export/import JSON, ou localStorage).
- Le nombre de chemins optimaux affichés est plafonné (pour éviter une explosion combinatoire sur de gros graphes avec beaucoup d'égalités).
- L'algorithme suppose un graphe orienté ; les arcs non orientés ne sont pas gérés (il faut créer les deux arcs manuellement si besoin).