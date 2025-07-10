# 🚀 Instructions de démarrage MCP Frontend

## Démarrage rapide

### Option 1 : Script automatique (Windows)
```bash
# Double-cliquer sur start.bat
# OU en ligne de commande :
.\start.bat
```

### Option 2 : Commandes manuelles
```bash
# Installation des dépendances (première fois uniquement)
npm install

# Démarrage du serveur de développement
npm start
# OU
npm run dev

# L'application s'ouvrira automatiquement à http://localhost:4200
```

## Vérifications avant démarrage

### 1. Backend MCP Client (Spring Boot)
```bash
# Doit tourner sur http://localhost:8066
# Vérifier avec :
curl http://localhost:8066/chat?query=hello
```

### 2. Python MCP Server
```bash
# Doit tourner avec uv run dans le dossier python-mcp-server
cd ../python-mcp-server
uv run python server.py
```

### 3. Java MCP Server  
```bash
# Doit tourner sur http://localhost:8899 (si utilisé)
cd ../mcp-server
mvn spring-boot:run
```

## Commandes disponibles

```bash
npm start           # Démarre le dev server avec ouverture auto
npm run dev         # Alias pour start
npm run build       # Build de production
npm run build:dev   # Build de développement
npm test            # Tests unitaires
npm run preview     # Preview de la version production
```

## Troubleshooting

### Port 4200 déjà utilisé
```bash
# Utiliser un autre port
ng serve --port 4201
```

### Backend non accessible
1. Vérifier que Spring Boot MCP Client tourne sur 8066
2. Vérifier les CORS dans le backend
3. Consulter la console navigateur (F12)

### Hot reload ne fonctionne pas
```bash
# Redémarrer le serveur
Ctrl+C puis npm start
```

## Structure du projet

```
mcp-frontend/
├── src/app/
│   ├── components/     # Chat, Tools, History
│   ├── services/       # API et Streaming services
│   ├── models/         # Interfaces TypeScript
│   └── environments/   # Configuration
├── README.md           # Documentation complète
└── start.bat          # Script de démarrage Windows
```

---
**Happy coding! 🚀**
