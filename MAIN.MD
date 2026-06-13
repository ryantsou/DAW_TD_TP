
---

## 1. COMMANDES ET CONFIGURATION



```bash
# --- INITIALISER FRONTEND ---
npm create vite@latest
# ⚠️ À CHANGER : Choisir Vanilla ou React, puis TypeScript

# --- INITIALISER BACKEND ---
npm init -y
npm i fastify @fastify/cors better-sqlite3 jsonwebtoken dotenv
npm i --save-dev typescript @types/node @types/better-sqlite3 @types/jsonwebtoken tsx
npx tsc --init

```

### LANCER LE PROJET (PENDANT LE DÉVELOPPEMENT)

*⚠️ IMPORTANT : Il faut ouvrir **DEUX terminaux séparés** (un pour le front, un pour le back).*

```bash
# --- TERMINAL 1 : FRONTEND ---
cd mon-projet-front    # ⚠️ À CHANGER : Va dans le dossier de ton frontend
npm run dev            # Lance le serveur Vite (généralement sur http://localhost:5173)

# --- TERMINAL 2 : BACKEND ---
cd mon-projet-back     # ⚠️ À CHANGER : Va dans le dossier de ton backend
npx tsx --watch src/server.ts  # Lance le serveur et redémarre auto à chaque sauvegarde (--watch)
# (Note : "npx tsc -w" sert uniquement à compiler les fichiers .ts en .js en arrière-plan)
```

### TSCONFIG.JSON (Backend)

*⚠️ À CHANGER : Décommenter et modifier ces lignes dans tsconfig.json*

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src", 
    "outDir": "./dist", 
    "strict": true,
    "skipLibCheck": true,
    "verbatimModuleSyntax": false
  }
}

```

---

## 2. MODÈLES DE DONNÉES (TYPESCRIPT)

*📁 Fichier Backend et Frontend : `src/types.ts` ou `src/interfaces.ts`*

```typescript
// ⚠️ À CHANGER : Nom de l'interface (ex: User, Message, Task)
export interface MonEntite {
    // ⚠️ À CHANGER : Mettre les attributs qui correspondent à la BDD
    id: number;
    name: string;
    isActive: number;
}

// ⚠️ À CHANGER : Type utilisé pour la création (sans l'ID auto-incrémenté)
export type CreateMonEntiteDTO = Omit<MonEntite, 'id'>;

```

---

## 3. SERVEUR BACKEND (FASTIFY)

*📁 Fichier Backend : `src/server.ts` (⚠️ Souvent appelé `index.js` ou `index.ts` )*

```typescript
// ⚠️ POINT D'ENTRÉE BACKEND : C'est ici que tu configures ton API et tes routes.
import Fastify from "fastify";
import cors from "@fastify/cors";

const fastify = Fastify();
fastify.register(cors); // Obligatoire pour éviter les erreurs CORS

// --- SCHEMA DE VALIDATION ---
const createSchema = {
    body: {
        type: 'object',
        required: ['name'],
        properties: {
            name: { type: 'string', minLength: 3 },
            isActive: { type: 'number', enum: [0, 1] }
        }
    }
};

// --- MIDDLEWARE : AUTHENTIFICATION ---
// ⚠️ À UTILISER DANS LA ROUTE AINSI : fastify.get("/private", { preHandler: [authenticate] }, async ...)
const authenticate = async (request: any, reply: any) => {
    try {
        // ⚠️ NE PAS CHANGER "Bearer " : C'est un standard HTTP
        const token = request.headers.authorization?.replace("Bearer ", "");
        if (!token) throw new Error("Token manquant");
        // request.user = verifyToken(token); // Fonction définie dans la section Sécurité
    } catch (err) {
        reply.code(401).send({ error: "Non autorisé" });
    }
};

// ⚠️ CONFIGURATION DES ROUTES
const ROUTE_PATH = "/items"; // ⚠️ À CHANGER : Le chemin de ta ressource (ex: "/users")

// ==========================================
// ROUTE GET : LECTURE
// ==========================================
fastify.get(ROUTE_PATH, async (request, reply) => {
    try {
        // const data = db.prepare("SELECT * FROM table").all();
        
        reply.code(200).send({ /* data */ });
    } catch (error) {
        reply.code(500).send({ error: "Internal Server Error" });
    }
});

// ==========================================
// ROUTE POST : CREATION
// ==========================================
fastify.post(ROUTE_PATH, { schema: createSchema }, async (request, reply) => {
    try {
        const body = request.body as CreateMonEntiteDTO;
        
        // ⚠️ À CHANGER : Code pour insérer dans la BDD (voir section SQLite)
        
        reply.code(201).send({ message: "Créé avec succès" });
    } catch (error) {
        // ⚠️ À CHANGER : Gérer les conflits (ex: email déjà existant -> 409)
        reply.code(500).send({ error: "Internal Server Error" });
    }
});

// ==========================================
// ROUTE PUT : MISE À JOUR AVEC PARAMÈTRE
// ==========================================
fastify.put(`${ROUTE_PATH}/:id`, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { attr1 } = request.body as CreateMonEntiteDTO;

    // ⚠️ À CHANGER : Code UPDATE SQLite ici

    reply.code(204).send(); // 204 = Succès, pas de contenu à renvoyer
});

// ==========================================
// ROUTE DELETE : SUPPRESSION
// ==========================================
fastify.delete(`${ROUTE_PATH}/:id`, async (request, reply) => {
    const { id } = request.params as { id: string };

    // ⚠️ À CHANGER : Code DELETE SQLite ici

    reply.code(204).send();
});

// --- DÉMARRAGE DU SERVEUR ---
const start = async () => {
    try {
        await fastify.listen({ port: 8080, host: '0.0.0.0' });
        console.log("Serveur lancé sur http://localhost:8080");
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();

```

---

## 4. BASE DE DONNÉES (BETTER-SQLITE3)

*📁 Fichier recommandé (Backend) : `src/database.ts` ou `src/db.ts`*

```typescript
import Sqlite3 from "better-sqlite3";
// ⚠️ À CHANGER : Le chemin vers le fichier de la base de données
const db = Sqlite3("./database/db.sqlite");

// --- INITIALISATION AUTOMATIQUE ---
// ⚠️ À CHANGER : Structure de ta table
db.exec(`
    CREATE TABLE IF NOT EXISTS MA_TABLE (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        COL1 TEXT NOT NULL,
        COL2 TEXT
    );
`);

// --- SELECT ALL ---
// ⚠️ À CHANGER : Le nom de la table
const getAll = () => {
    const query = db.prepare("SELECT * FROM MA_TABLE;");
    return query.all();
};

// --- SELECT ONE (Paramétré) ---
// ⚠️ À CHANGER : Le nom de la table et la colonne de condition
const getOne = (valeurRecherchee: string) => {
    const query = db.prepare("SELECT * FROM MA_TABLE WHERE MA_COLONNE = ?;");
    return query.get(valeurRecherchee);
};

// --- INSERT ---
// ⚠️ À CHANGER : La table, les colonnes et le nombre de '?'
const insertData = (val1: string, val2: string) => {
    const query = db.prepare("INSERT INTO MA_TABLE (COL1, COL2) VALUES (?, ?);");
    const result = query.run(val1, val2);
    return result.lastInsertRowid; // Retourne l'ID créé
};

// --- UPDATE ---
// ⚠️ À CHANGER : La table, les colonnes
const updateData = (id: number, val1: string) => {
    const query = db.prepare("UPDATE MA_TABLE SET COL1 = ? WHERE id = ?;");
    const result = query.run(val1, id);
    return result.changes; // Retourne le nombre de lignes modifiées
};

// --- DELETE ---
const deleteData = (id: number) => {
    const query = db.prepare("DELETE FROM MA_TABLE WHERE id = ?;");
    query.run(id);
};

```

---

## 5. SÉCURITÉ (JWT & HACHAGE)

### HACHAGE (Web Crypto API - Natif JS)

*📁 Fichier recommandé (Backend) : `src/security.ts` ou `src/auth.ts`*

```typescript
async function hashPassword(password: string): Promise<string> {
    const textEncoder = new TextEncoder();
    const arrayBuffer = textEncoder.encode(password);
    
    const hash = await crypto.subtle.digest({name: "SHA-256"}, arrayBuffer);
    
    return Array.from(new Uint8Array(hash)).map((byte) => {
        return byte.toString(16).padStart(2, "0");
    }).join("");
}

```

### JSON WEB TOKEN (JWT)

```typescript
import JWT from "jsonwebtoken";
// ⚠️ À CHANGER : Créer un fichier .env à la racine avec JWT_SECRET=MaCleSecrete
const privateKey = process.env.JWT_SECRET || "CLE_SECOURS_EN_CAS_D_OUBLI";

// Créer le token
const generateToken = (userId: number) => {
    // ⚠️ À CHANGER : Les données qu'on veut stocker dans le token
    const payload = { id: userId }; 
    return JWT.sign(payload, privateKey);
};

// Vérifier le token (ex: middleware dans une route Fastify)
const verifyToken = (token: string) => {
    try {
        const decoded = JWT.verify(token, privateKey);
        return decoded; // Retourne le payload
    } catch (err) {
        throw new Error("Token invalide");
    }
};

```

---

## 6. FRONTEND : STRUCTURE DE BASE (HTML / CSS)

### ARBORESCENCE TYPE (VITE)

```text
/mon-projet-front
├── index.html         <-- À la racine : ⚠️ POINT D'ENTRÉE VISUEL (Le navigateur charge ce fichier en 1er)
├── package.json       
└── /src               <-- Dossier source
    ├── main.ts        <-- (GÉNÉRÉ PAR VITE) ⚠️ SCRIPT PRINCIPAL (Souvent appelé "index.js" sans Vite)
    ├── style.css      <-- (GÉNÉRÉ PAR VITE) Styles globaux
    ├── api.ts         <-- ⚠️ À CRÉER TOI-MÊME : Pour ton fetch global
    └── /mvc           <-- ⚠️ À CRÉER TOI-MÊME : Si tu utilises l'architecture MVC
```

### INDEX.HTML (À la racine)

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mon App</title>
    <!-- ⚠️ À CHANGER : Lien vers le CSS -->
    <link rel="stylesheet" href="./src/style.css">
</head>
<body>
    <div id="app">
        <!-- ⚠️ À CHANGER : Structure de base -->
        <h1>Mon Application</h1>
        
        <form id="monForm"> <!-- Formulaire manipulé dans main.ts ou index.js -->
            <input type="text" id="input1" placeholder="Entrez un texte...">
            <button type="submit" id="monBouton">Valider</button>
        </form>

        <div id="affichage"></div>
    </div>

    <!-- ⚠️ NE PAS CHANGER : "type='module'" est obligatoire avec Vite -->
    <script type="module" src="./src/main.ts"></script> <!-- ⚠️ C'est ici qu'on relie l'HTML au JS/TS -->
</body>
</html>
```

### STYLE.CSS (src/style.css)

```css
:root {
    --primary-color: #007bff;
    --bg-color: #f4f4f4;
}
body { font-family: Arial, sans-serif; background-color: var(--bg-color); margin: 20px; }
.text-success { color: green; font-weight: bold; }
```

---

## 7. FRONTEND VANILLA : DOM & EVENTS

*📁 Fichier recommandé (Frontend) : `src/main.ts`*

```javascript
// ⚠️ CONFIGURATION DES SELECTEURS DOM (À CHANGER)
const FORM_SELECTOR = "#monForm";
const INPUT_SELECTOR = "#input1";
const OUTPUT_SELECTOR = "#affichage";

window.addEventListener("load", () => {
    
    // --- SELECTION ---
    const form = document.querySelector(FORM_SELECTOR) as HTMLFormElement;
    const output = document.querySelector(OUTPUT_SELECTOR) as HTMLDivElement;

    if (!form) return;

    // --- EVENEMENT SUBMIT FORMULAIRE ---
    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Annule le rechargement

        const input1 = document.querySelector(INPUT_SELECTOR) as HTMLInputElement;
        
        // --- MANIPULATION DOM ---
        // ⚠️ À CHANGER : Création dynamique de HTML
        const p = document.createElement("p");
        p.textContent = `Valeur saisie : ${input1.value}`;
        p.classList.add("text-success"); // Ajout de classe CSS
        output.appendChild(p);
        
        form.reset(); // Vide le formulaire
    });
});

```

### LOCALSTORAGE

*📁 Fichier recommandé (Frontend) : `src/storage.ts` ou au début de `src/main.ts`*

```typescript
// ⚠️ À CHANGER : Le nom de la clé (ex: "user_auth", "app_state", ou "mon_projet_data")
const STORAGE_KEY = "sessionData";
const storage = {
    save: (data: any) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data)),
    get: () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"),
    remove: () => localStorage.removeItem(STORAGE_KEY),
    getToken: () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")?.token
};

```

---

## 8. FRONTEND VANILLA : REQUÊTES FETCH

### FONCTION GLOBALE FETCH (À PRIVILÉGIER)

*📁 Fichier recommandé (Frontend) : `src/api.ts`*

```typescript
const API_URL = "http://localhost:8080";

// ⚠️ EXEMPLES D'APPEL : 
// const users = await apiCall<User[]>("/users");
// const success = await apiCall("/users", "POST", { name: "Bob" });
async function apiCall<T = any>(endpoint: string, method: string = "GET", body?: any): Promise<T | null> {
    const token = storage.getToken(); // Utilise l'objet de la section LocalStorage
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method,
            headers: { 
                "Content-Type": "application/json",
                // ⚠️ NE PAS CHANGER "Bearer" : C'est le standard HTTP, seul ${token} change
                ...(token && { "Authorization": `Bearer ${token}` })
            },
            body: body ? JSON.stringify(body) : undefined
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Erreur HTTP ${response.status}`);
        }
        
        if (response.status === 204) return null; // Pas de contenu (ex: DELETE)
        return await response.json();
    } catch (e) {
        console.error("Fetch Error:", e);
        return null; // Retourner null permet de tester facilement "if (!data)" côté UI
    }
}

```

---

## 9. FRONTEND : ARCHITECTURE MVC (CLASSES)

*📁 Fichiers (Frontend) : À placer dans un dossier `src/mvc/`*

```typescript
// --- 1. OBSERVER / NOTIFIER (pattern.ts) ---
export class Observer {
    notify() { throw new Error("A définir !"); }
}

export class Notifier {
    #observers: Observer[] = [];
    addObserver(obs: Observer) { this.#observers.push(obs); }
    notify() { this.#observers.forEach(obs => obs.notify()); }
}

// --- 2. LE MODELE (model.ts) ---
// ⚠️ À CHANGER : Nom de la classe et attributs métier
export class MonModele {
    #data: string;
    constructor() { this.#data = "Initial"; }
    get data() { return this.#data; }
    set data(val) { this.#data = val; }
}

// --- 3. LE CONTROLEUR (controller.ts) ---
// ⚠️ À CHANGER : Nom de la classe et méthodes
export class MonController extends Notifier {
    #model: MonModele;
    constructor() {
        super(); // OBLIGATOIRE
        this.#model = new MonModele();
    }
    
    getData() { return this.#model.data; }
    
    updateData(newVal: string) {
        this.#model.data = newVal;
        this.notify(); // Met à jour la vue !
    }
}

// --- 4. LA VUE (view.ts) ---
// ⚠️ CONFIGURATION DES SELECTEURS (Source de Vérité)
const BTN_SELECTOR = "#monBouton";
const OUTPUT_SELECTOR = "#affichage";

// ⚠️ À CHANGER : Nom de la classe
export class MaVue extends Observer {
    #controller: MonController;
    
    constructor(ctrl: MonController) {
        super();
        this.#controller = ctrl;
        this.#controller.addObserver(this); // S'abonne
        
        // Attache les événements
        document.querySelector(BTN_SELECTOR)?.addEventListener("click", (e) => {
            e.preventDefault();
            this.#controller.updateData("Nouvelle valeur !");
        });
    }
    
    // Appelée automatiquement quand updateData() fait this.notify()
    notify() {
        const affichage = document.querySelector(OUTPUT_SELECTOR);
        if(affichage) affichage.innerHTML = this.#controller.getData();
    }
}

// --- 5. INITIALISATION (À mettre dans main.ts) ---
// ⚠️ C'est ici qu'on branche le tout !
// const appController = new MonController();
// const appView = new MaVue(appController);

```

---

## 10. FRONTEND : REACT

*📁 Fichier recommandé (Frontend) : `src/components/MonComposant.tsx` (⚠️ Attention, l'extension est bien `.tsx` !)*

```typescript
import React, { useState, useRef, MouseEvent } from 'react';

// ==========================================
// TYPES & PROPS
// ==========================================
// ⚠️ À CHANGER : Les attributs attendus par le composant
type MonComposantProps = {
    titre: string;
    onAction: (valeur: string) => void;
}

// ==========================================
// COMPOSANT REACT PRINCIPAL
// ==========================================
export function MonComposant({ titre, onAction }: MonComposantProps) {
    
    // --- STATE (Déclenche un re-rendu) ---
    const [texte, setTexte] = useState<string>("");
    const [liste, setListe] = useState<string[]>(["Item 1", "Item 2"]);

    // --- FONCTION DE GESTION (Handler) ---
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!texte.trim()) return; // Anti-spam (pas de texte vide)
        
        onAction(texte);
        setListe([...liste, texte]);
        setTexte(""); // Vide l'input
    };

    return (
        <div className="container">
            <h1>{titre}</h1>
            
            {/* Formulaire natif (valide avec la touche Entrée) */}
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={texte} 
                    onChange={(e) => setTexte(e.target.value)} 
                    placeholder="Saisir un texte..." 
                />
                <button type="submit" disabled={!texte}>Valider</button>
            </form>
            
            <p>Valeur courante : {texte}</p>

            {/* --- RENDU DE LISTE (MAP) --- */}
            <ul>
                {liste.map((item, index) => (
                    // ⚠️ À CHANGER : La clé (key) doit être unique !
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
}

```
