# MCP Frontend - Angular Application

🤖 **Interface utilisateur moderne pour le système MCP (Model Context Protocol)**

Cette application Angular fournit une interface web complète pour interagir avec l'architecture MCP qui comprend :
- **Spring Boot MCP Client** (port 8066)
- **Python MCP Server** (outils HR)
- **NPX Filesystem Tools**
- **Java MCP Server** (données d'entreprise et stocks)

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+ 
- npm 9+
- Angular CLI 17+

### Installation et lancement

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npm start
# ou
ng serve

# 3. Ouvrir dans le navigateur
# http://localhost:4200
```

## 🏗️ Architecture du frontend

```
src/
├── app/
│   ├── components/           # Composants Angular
│   │   ├── chat/            # Interface de chat AI
│   │   ├── tools/           # Test des outils MCP
│   │   └── history/         # Historique des conversations
│   ├── services/            # Services Angular
│   │   └── api.service.ts   # Communication avec le backend
│   ├── models/              # Interfaces TypeScript
│   │   └── interfaces.ts    # Types de données
│   └── environments/        # Configuration
├── styles.css              # Styles globaux
└── index.html
```

## 📱 Fonctionnalités

### 💬 Chat Assistant (`/chat`)
- Interface de chat en temps réel avec l'AI
- Support des **Server-Sent Events (SSE)** pour le streaming
- Affichage des outils utilisés par l'AI
- Historique de conversation en mémoire
- Interface responsive et moderne

### 🔧 Tools Explorer (`/tools`)
- **Java MCP Server Tools** :
  - `getAllCompanies()` - Liste toutes les entreprises
  - `getCompanyByName(name)` - Détails d'une entreprise
  - `getStockByCompanyName(name)` - Cours de bourse
  
- **Python MCP Server Tools** :
  - `getEmployeeInfo(name)` - Informations employé
  
- **Node.js Filesystem Tools** :
  - `listFiles(path)` - Liste des fichiers
  - `readFile(path)` - Lecture de fichier

### 📝 History (`/history`)
- Historique complet des conversations
- Filtres et recherche
- Export des données JSON
- Statistiques d'utilisation

## 🔌 Endpoints API

L'application se connecte au Spring Boot MCP Client (port 8066) :

```bash
GET /chat?query=<question>          # Chat avec l'AI
```

**Happy coding! 🚀**

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
