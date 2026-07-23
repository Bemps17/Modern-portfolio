# Fusée hybride rétro-technique — design

## Objectif

Remplacer la fusée desktop actuelle par un visuel original, lisible et esthétique qui accompagne les cinq étapes d’un projet. La fusée est réservée aux écrans desktop larges ; mobile et tablette conservent un diaporama pleine largeur.

## Direction visuelle

- Silhouette originale, élancée et symétrique : ogive arrondie, corps métallique clair, quatre ailerons et moteur visible.
- Damier orange du site / ivoire limité à la partie haute et aux ailerons : référence rétro-futuriste, sans reproduction d’un visuel existant.
- Détails techniques modernes : hublots alignés, panneaux de coque, joints horizontaux et moteurs cohérents.
- Suppression des annotations blueprint décoratives qui nuisent à la lisibilité.

## Interaction desktop (`xl` et plus)

1. Le rail latéral sélectionne une des cinq étapes.
2. Le module associé de la fusée est accentué, puis les modules déjà parcourus se séparent légèrement vers le bas.
3. La carte de détail décrit l’étape active.
4. Le bouton `Lancer` déclenche une séquence : compte à rebours visuel, fumée basse progressive, vibration discrète, décollage lent, puis redirection vers `/contact`.

Les cinq modules restent alignés par défaut et leur espacement maximal doit conserver une silhouette lisible.

## Mobile et tablette (< `xl`)

- Aucune fusée ni bouton `Lancer`.
- Diaporama de cinq étapes pleine largeur avec flèches, points indicateurs et transition horizontale.
- Le contenu reste identique au desktop (titre, libellé et description de chaque étape).

## Accessibilité et robustesse

- Étapes utilisables au clavier.
- Avec `prefers-reduced-motion`, aucune séparation, vibration ou décollage : la navigation vers `/contact` est immédiate.
- Les couleurs conservent le contraste du design system.

## Vérification

- Desktop large : silhouette, alignement des hublots, modules, sélection des cinq étapes et séquence de lancement.
- Mobile 375 px et tablette 1024 px : diaporama seul, pas de fusée ni de bouton `Lancer`.
- Typecheck, build et test visuel aux deux breakpoints.
