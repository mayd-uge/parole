# Parole

Application web de communication assistée (CAA) pour personne ayant perdu l'usage de la parole mais conservant lecture, écriture et motricité de la main. Conçue pour iPad (Safari), fonctionne sur tout navigateur récent, sans installation, sans compte, sans connexion une fois chargée.

Principe : des phrases classées par catégories, prononcées par la voix de synthèse du système au simple toucher, affichées en gros caractères pour l'interlocuteur, complétées par une saisie libre.

Adresse de l'application : `https://mayd-uge.github.io/parole/`

---

## Fichiers du dépôt

| Fichier | Rôle | À modifier ? |
|---|---|---|
| `index.html` | **L'application entière** : interface, phrases, réglages, mécanique. Un seul fichier, sans dépendance externe. | Oui — bloc `PHRASES` pour le contenu ; reste du code pour les évolutions. |
| `sw.js` | **Service worker** : met les fichiers en cache pour que l'application fonctionne hors ligne et s'ouvre instantanément. | Uniquement la ligne `VERSION`, à chaque publication. |
| `manifest.webmanifest` | **Fiche d'identité** de l'application pour l'écran d'accueil : nom, icône, mode plein écran, couleurs. | Rarement (nom, couleurs). |
| `icone.png` | Icône affichée sur l'écran d'accueil de l'iPad. | Libre. Format carré PNG, 512 × 512 px conseillé. |
| `README.md` | Ce document. | À tenir à jour, notamment le journal des versions. |

---

## Où se trouve quoi dans `index.html`

Le fichier se lit de haut en bas en quatre zones :

1. **`<style>`** — l'apparence (couleurs, tailles, disposition). Les variables en tête (`--accent`, `--tap`, etc.) pilotent l'essentiel.
2. **Le HTML** — la structure : bandeau de lecture, rail des catégories, grille, barre de saisie, panneau de réglages.
3. **`APP_VERSION` et `PHRASES`** — le numéro de version, puis **le contenu**. C'est ici, et seulement ici, que l'on ajoute ou modifie des phrases.
4. **La mécanique** — voix, affichage, saisie, réglages. Ne pas y toucher pour une simple modification de contenu.

Format du bloc `PHRASES` :

```js
const PHRASES = {
  "Nom de la catégorie": [
    "Première phrase.",
    "Deuxième phrase."
  ],
  "Autre catégorie": [
    "…"
  ]
};
```

Guillemets doubles, virgules entre les phrases et entre les catégories. Une apostrophe dans une phrase ne pose aucun problème.

---

## Versionnage

Un **numéro unique** identifie chaque état publié de l'application. Il vit à deux endroits qui doivent toujours coïncider :

- `index.html` → `const APP_VERSION = 'X.Y.Z';` (affiché dans les Réglages de l'application, ce qui permet de vérifier sur l'iPad quelle version s'exécute).
- `sw.js` → `const VERSION = 'parole-X.Y.Z';` (c'est ce changement qui force l'iPad à remplacer sa copie en cache).

Schéma `X.Y.Z` :

- **Z** (correctif) — retouche de phrases, correction mineure. Ex. `1.0.0 → 1.0.1`.
- **Y** (évolution) — nouvelle fonction, nouvelle catégorie majeure, changement d'ergonomie. Ex. `1.0.1 → 1.1.0`.
- **X** (refonte) — changement de structure ou de format des données. Ex. `1.4.2 → 2.0.0`.

### Procédure de publication

1. Modifier `index.html` (et `sw.js` si nécessaire).
2. Incrémenter `APP_VERSION` dans `index.html` **et** `VERSION` dans `sw.js`, à l'identique.
3. Ajouter une ligne au journal des versions ci-dessous.
4. Commit sur la branche `main` → GitHub Pages redéploie automatiquement (1 à 2 minutes).
5. Sur l'iPad : fermer complètement l'application, la rouvrir, la refermer, la rouvrir. Vérifier le numéro dans Réglages.

Si le numéro n'a pas été incrémenté, l'iPad continuera d'afficher l'ancienne version depuis son cache : c'est le piège classique.

### Journal des versions

| Version | Date | Changements |
|---|---|---|
| 1.0.0 | 2026-09-10 | Première version publiée. Six catégories, saisie libre, onglet Récent, réglages voix/vitesse/taille, fonctionnement hors ligne, affichage du numéro de version. |

---

## Règles du projet

**Contenu impersonnel.** Le dépôt est public : la page et son code sont lisibles par quiconque a l'adresse. Aucun nom de famille, adresse, numéro de téléphone, prénom identifiant ni information médicale ne doit figurer dans les phrases. « Peux-tu appeler le médecin ? » convient ; un nom ou un numéro, non.

**Aucune ressource externe.** La sûreté de l'application tient à ce qu'elle ne charge rien depuis internet : pas de police web, pas de bibliothèque hébergée ailleurs, pas de script tiers, pas d'appel réseau. Cette règle est ce qui permet d'affirmer que rien ne sort de l'iPad. Toute contribution qui l'enfreint doit être refusée.

**Aucun stockage de données.** L'application n'enregistre rien (ni cookies, ni stockage local) : l'onglet Récent vit en mémoire et disparaît à la fermeture. Le seul cache est celui du service worker, qui ne contient que les fichiers du dépôt.

**Un seul fichier applicatif.** `index.html` reste autonome. Découper le code en plusieurs fichiers rendrait l'audit et le partage plus difficiles sans bénéfice pour un projet de cette taille.

---

## Réutiliser le projet

Le dépôt peut être copié (« fork ») par toute personne souhaitant l'adapter à une autre situation. Il suffit de modifier le bloc `PHRASES`, d'activer GitHub Pages sur la copie, et d'ouvrir l'adresse obtenue dans Safari sur l'iPad, puis « Partager » → « Sur l'écran d'accueil ».

Sur l'iPad, les voix disponibles dépendent de celles installées dans Réglages → Accessibilité → Contenu énoncé → Voix. Les modes d'accès du système (Contrôle de sélection, Adaptations tactiles, AssistiveTouch, Accès guidé) s'appliquent à l'application comme à toute page web.

---

## Licence

Projet publié sans restriction d'usage pour toute finalité d'aide à la communication. Les fichiers ne contiennent aucun élément soumis à licence tierce.
