# Exercice Pratique : Système d'Inscription Sécurisé (Fastify + TypeScript + Fetch)

Ce document contient le sujet complet, les indications pas-à-pas et la solution entièrement annotée avec des repères visuels

---

## 1. LE SUJET D'EXAMEN

### Contexte
Vous devez concevoir la brique d'inscription des utilisateurs pour une application web. Pour des raisons de sécurité, les mots de passe ne doivent jamais être stockés en clair. Ils doivent être hachés en utilisant l'algorithme **SHA-256** (via l'API Web Crypto) avant d'interagir avec la base de données.

### Spécifications de l'API Backend
- **Route :** `/register`
- **Méthode :** `POST`
- **Format du Body (JSON) :**

```json
{
  "email": "user@example.com",
  "password": "monMotDePasseSecurise"
}
```

* **Codes de Réponses attendus :**
* `201 Created` : Si l'utilisateur est enregistré avec succès.
* `400 Bad Request` : Si l'un des deux champs est manquant.

---

## 2. SOLUTION COMPLÈTE & ANNOTÉE

### Étape 1 : Utilitaire de Sécurité - Le Hachage (utils/crypto.ts)

Cette fonction transforme le mot de passe clair en une chaîne de caractères hexadécimale sécurisée de 64 caractères.

```typescript
// Fonction de hachage native utilisant l'API Web Crypto
export async function hashPassword(password: string): Promise<string> {
    // 1. Conversion de la chaîne de caractères en tableau d'octets (ArrayBuffer)
    const textEncoder = new TextEncoder();
    const arrayBuffer = textEncoder.encode(password);
    
    // 2. Application de l'algorithme de hachage SHA-256
    // ⚠️ À CHANGER : Modifier l'algorithme si le sujet demande du SHA-512 ou autre
    const hash = await crypto.subtle.digest({ name: "SHA-256" }, arrayBuffer);
    
    // 3. Conversion du tableau d'octets en chaîne hexadécimale (base 16)
    return Array.from(new Uint8Array(hash)).map((byte) => {
        return byte.toString(16).padStart(2, "0");
    }).join("");
}
```

### Étape 2 : Le Serveur Backend (server.ts)

Création de la route de réception `POST /register`, hachage du mot de passe et simulation d'enregistrement.

```typescript
import Fastify from "fastify";
import cors from "@fastify/cors";
import { hashPassword } from "./utils/crypto"; // Import de l'étape 1

const fastify = Fastify();
fastify.register(cors);

// ⚠️ À CHANGER : Adapter l'interface aux colonnes envoyées par le formulaire du sujet
interface RegisterDTO {
    email: string;
    password: string;
}

// Déclaration de la route POST
// ⚠️ À CHANGER : Modifier la route ("/register") selon les spécifications du sujet
fastify.post("/register", async (request, reply) => {
    try {
        // 1. Récupération et typage des données du body
        const { email, password } = request.body as RegisterDTO;

        // 2. Validation stricte des données (Erreur 400 si vide)
        if (!email || !password) {
            return reply.code(400).send({ error: "Email et mot de passe obligatoires." });
        }

        // 3. Hachage du mot de passe avant insertion
        const encryptedPassword = await hashPassword(password);

        // 4. Insertion dans la Base de Données SQLite (Simulée ici)
        // ⚠️ À CHANGER : Remplacer par vos requêtes better-sqlite3 réelles de l'examen
        // const stmt = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)");
        // stmt.run(email, encryptedPassword);

        console.log(`Utilisateur enregistré ! Email: ${email}, Mot de passe haché: ${encryptedPassword}`);

        // 5. Envoi de la réponse de succès (201 Created)
        reply.code(201).send({ message: "Inscription validée avec succès !" });

    } catch (error) {
        console.error(error);
        reply.code(500).send({ error: "Erreur interne du serveur." });
    }
});

// Démarrage du serveur backend
fastify.listen({ port: 8080 });
```

### Étape 3 : Requête Fetch du Client (front/api.ts)

Fonction frontend chargée d'envoyer les identifiants d'inscription bruts au serveur de manière asynchrone.

```typescript
// ⚠️ À CHANGER : Nom de l'interface correspondant au modèle d'inscription
interface RegisterDTO {
    email: string;
    password: string;
}

export async function submitRegistration(data: RegisterDTO): Promise<boolean> {
    try {
        // ⚠️ À CHANGER : Ajuster l'adresse IP, le port ou la route de l'API
        const response = await fetch("http://localhost:8080/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data) // Conversion de l'objet en texte JSON
        });

        // Retourne true si le serveur renvoie un code entre 200 et 299 (201 ici)
        return response.ok;

    } catch (error) {
        console.error("Erreur réseau lors de l'inscription :", error);
        return false;
    }
}
```

### Étape 4 : Liaison avec le Formulaire HTML (front/main.ts)

Interception de la soumission du formulaire, extraction des valeurs des inputs et mise à jour de l'interface graphique.

```typescript
import { submitRegistration } from "./api";

window.addEventListener("load", () => {
    
    // 1. Sélection des éléments du DOM
    // ⚠️ À CHANGER : Adapter les sélecteurs ID à votre fichier index.html d'examen
    const form = document.querySelector("#form-register") as HTMLFormElement;
    const emailInput = document.querySelector("#reg-email") as HTMLInputElement;
    const passwordInput = document.querySelector("#reg-password") as HTMLInputElement;
    const messageDiv = document.querySelector("#message-box") as HTMLDivElement;

    if (!form) return;

    // 2. Écoute de l'événement submit
    form.addEventListener("submit", async (event) => {
        // 3. Blocage du rechargement natif de la page
        event.preventDefault();

        // 4. Construction du package de données (DTO)
        const registerData = {
            email: emailInput.value,
            password: passwordInput.value
        };

        // 5. Appel de la fonction Fetch (Étape 3)
        const isSuccess = await submitRegistration(registerData);

        // 6. Gestion du retour visuel
        if (isSuccess) {
            messageDiv.textContent = "Inscription réussie !";
            messageDiv.className = "text-success"; // Classe CSS verte
            form.reset(); // Réinitialise les champs textuels
        } else {
            messageDiv.textContent = "Échec de l'inscription. Vérifiez vos informations.";
            messageDiv.className = "text-danger"; // Classe CSS rouge
        }
    });
});
```
