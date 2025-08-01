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
# Développement avec hot reload
npm run start

# Build de production
npm run build

# Tests
npm run test
```

## 📄 Licence

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📞 Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub.
