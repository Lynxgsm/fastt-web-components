# FastT Web Components

Une bibliothèque de composants web modernes et réutilisables pour créer des interfaces de chat interactives.

## 🚀 Installation

Ajoutez les scripts suivants à votre HTML :

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- CSS global -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Lynxgsm/fastt-web-components@main/dist/fastt-web-components/fastt-web-components.css" />

    <!-- Script principal -->
    <script type="module" src="https://cdn.jsdelivr.net/gh/Lynxgsm/fastt-web-components@main/dist/fastt-web-components/fastt-web-components.esm.js"></script>
  </head>
  <body>
    <!-- Vos composants ici -->
  </body>
</html>
```

## 📦 Composants Disponibles

### Chat Modal

Un modal de chat complet avec streaming en temps réel.

```html
<chat-modal modal-title="Comment puis-je vous aider ?" icon-size="16"></chat-modal>
```

**Propriétés :**

- `modal-title` : Titre du modal (défaut: "Que puis-je faire pour vous ?")
- `icon-size` : Taille de l'icône d'envoi (défaut: 16)

### Chat Widget

Un widget de chat compact pour les sites web.

```html
<chat-widget position="bottom-right"> </chat-widget>
```

**Propriétés :**

- `position` : Position du widget ("bottom-right", "bottom-left", "top-right", "top-left")

### Chat Skeleton

Un composant de chargement pour les réponses AI.

```html
<chat-skeleton></chat-skeleton>
```

### Satisfaction Buttons

Boutons de satisfaction pour évaluer les réponses.

```html
<satisfaction-buttons></satisfaction-buttons>
```

## 🔧 Configuration Backend

Le composant `chat-modal` nécessite un backend compatible avec l'endpoint `/stream-chat`.

**Format de requête :**

```json
{
  "message": "Votre message",
  "conversation_id": "optional-conversation-id"
}
```

**Format de réponse (Server-Sent Events) :**

```
data: {"content": "Partie de la réponse"}
data: {"content": "Suite de la réponse"}
data: {"type": "end", "status": "completed"}
```

## 🎨 Personnalisation

### Styles CSS

Les composants utilisent des variables CSS personnalisables :

```css
:root {
  --main-color: #ff8834;
  --font-family-primary: 'Yantramanav', sans-serif;
  --font-family-secondary: 'Signika', sans-serif;
}
```

### Thème personnalisé

```html
<chat-modal modal-title="Support Client" title-style='{"fontSize": "1.8rem", "fontWeight": "700", "color": "#2c3e50"}'> </chat-modal>
```

## 📱 Responsive Design

Tous les composants sont entièrement responsifs et s'adaptent automatiquement aux différentes tailles d'écran.

## 🌐 Compatibilité

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 🚀 Développement

### Installation locale

```bash
git clone https://github.com/[votre-username]/fastt-web-components.git
cd fastt-web-components
npm install
```

### Scripts disponibles

```bash
# Développement avec hot reload (sert src/index.html sur le port 3333)
npm run start

# Build, en utilisant API_URL de votre .env
npm run build

# Build destiné au CDN : épingle API_URL sur la production
npm run build:prod

# Tests
npm run test
```

### ⚠️ `API_URL` et ce qui part sur le CDN

`stencil.config.ts` embarque `API_URL` **au moment du build** (`env: { API_URL }`) : la
valeur est figée dans le bundle, elle n'est pas lue à l'exécution. Comme `.env` est
gitignoré, `npm run build` produit un artefact qui dépend de la machine — et le `dist/`
publié a déjà contenu `http://127.0.0.1:8000` pour cette raison.

**Tout `dist/` destiné à `main` doit donc être produit par `npm run build:prod`**, qui
épingle l'URL de production, `main` étant la branche servie par jsDelivr. À défaut de
valeur, les composants se replient sur `DEFAULT_API_ENDPOINT`
(`src/utils/api-service.ts`).

### ⚠️ `npm start` et `npm test` salissent `dist/`

`stencil.config.ts` déclare les cibles `dist` et `dist-custom-elements` sans
condition : **toute** construction y écrit, y compris `npm start` (build de
développement) et `npm test` (qui construit pour les tests e2e). Or `dist/` est
suivi par git et c'est l'artefact publié.

C'est ainsi que le commit `58812d6` de la branche `feat/decision-tree` a livré un
bundle de développement et supprimé la moitié des fichiers de `dist/`. Après une
session de développement ou de tests, si vous ne voulez pas republier :

```bash
git checkout -- dist && git clean -fd dist
```

Avant de pousser un `dist/` sur `main` :

```bash
grep -rl '127\.0\.0\.1' dist/                        # doit ne rien renvoyer
grep -c 'BUILD.isDev' dist/fastt-web-components/fastt-web-components.esm.js   # doit valoir 0
```

## 📄 Licence

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📞 Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub.
