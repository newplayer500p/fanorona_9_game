# 🎮 Fanorona 9x9 Game

Un jeu de stratégie **Fanorona** (Fanoron-tsivy) sur mobile et web. Jouez en local (Humain vs Humain) ou contre une IA intelligente.

## 📋 Table des matières

- [À propos](#à-propos)
- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Démarrage rapide](#démarrage-rapide)
- [Structure du projet](#structure-du-projet)
- [Règles du jeu](#règles-du-jeu)
- [Technologies](#technologies)

## 📖 À propos

**Fanorona** est un ancien jeu de stratégie traditionnel malgache sur plateau 9x9. Cette implémentation moderne offre :
- ✅ Logique de jeu complète
- ✅ IA stratégique
- ✅ Thèmes personnalisables
- ✅ Multi-plateforme (iOS, Android, Web)

## ✨ Fonctionnalités

- **Plateau 9x9** complet
- **Deux modes de jeu** :
  - Humain vs Humain (local)
  - Humain vs IA
- **Validation complète** des coups
- **Captures en chaîne** (approche et retrait)
- **Interface thématisée** avec plusieurs styles visuels
- **Animations** des mouvements de l'IA

## 🚀 Installation

### Prérequis
- [Node.js](https://nodejs.org/) (v16+)
- [Expo CLI](https://docs.expo.dev/)

### Setup

```bash
git clone https://github.com/newplayer500p/fanorona_9_game.git
cd fanorona_9_game
npm install
```

## 🎯 Démarrage rapide

**Lancer en web** :
```bash
npm run web
```

**Mode Expo** :
```bash
npm start
```

**iOS/Android** :
```bash
npm run ios    # ou npm run android
```

## 📁 Structure du projet

```
src/
├── components/          # Composants UI
│   ├── BoardSvg.jsx     # Plateau SVG
│   ├── GameScreen.jsx   # Écran de jeu
│   ├── MenuScreen.jsx   # Menu principal
│   ├── SettingsModal.jsx# Paramètres
│   └── ...
├── useGameState.js      # État du jeu
├── boardLogic.js        # Logique du plateau
├── aiEngine.js          # IA du jeu
├── themes.js            # Thèmes visuels
└── constants.js         # Constantes
```

## 🎲 Règles du jeu

- **2 Joueurs** : 9 pièces chacun
- **Mouvements** : orthogonal ou diagonal sur cases adjacentes vides
- **Captures** :
  - **Approche** : avancer vers une pièce adverse (capture si case libre derrière)
  - **Retrait** : reculer d'une pièce adverse (capture si case libre entre)
- **Chaînes de captures** : continuer les captures si d'autres sont possibles
- **Victoire** : réduire l'adversaire à 1 pièce ou immobiliser ses pièces

## 🛠 Technologies

- **React Native** & **Expo** - Framework mobile/web
- **React** 19.2.0 - UI
- **SVG** - Rendu du plateau
- **JavaScript ES6+** - Code

## 📝 Licence

MIT License

---

**Amusez-vous bien ! 🎮✨**
