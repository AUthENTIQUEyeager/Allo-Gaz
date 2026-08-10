# AlloGaz 🔥

Marketplace de livraison de gaz butane — Client / Vendeur / Admin.
Stack : **Next.js 14 (React + API serverless Node.js) + Supabase (PostgreSQL, Auth) + Vercel**.

Ce projet est complet et fonctionnel : authentification par rôle, gestion de stock,
commandes avec suivi de statut, validation des vendeurs par l'admin, avis clients.

---

## 0. Ce dont tu as besoin avant de commencer

- [Node.js](https://nodejs.org) version 18 ou plus (vérifie avec `node -v`)
- Un compte gratuit sur [supabase.com](https://supabase.com)
- Un compte gratuit sur [vercel.com](https://vercel.com) (pour l'hébergement, plus tard)
- Un éditeur de code (VS Code recommandé)

---

## 1. Créer le projet Supabase (base de données + authentification)

1. Va sur [supabase.com](https://supabase.com) → **New project**.
2. Choisis un nom (ex: `allogaz`), un mot de passe pour la base (note-le, tu n'en auras
   normalement pas besoin mais garde-le en sécurité), et une région proche
   (Europe de l'Ouest est un bon choix depuis le Burkina Faso).
3. Attends 1-2 minutes que le projet soit prêt.
4. Dans le menu de gauche, va dans **SQL Editor**.
5. Ouvre le fichier `supabase/migrations/0001_init.sql` de ce projet, copie **tout** son
   contenu, colle-le dans l'éditeur SQL de Supabase, puis clique **Run**.
   → Cela crée toutes les tables (profils, vendeurs, stock, commandes, avis), les
   déclencheurs automatiques et les règles de sécurité (chacun ne voit que ses propres
   données).
6. Va dans **SQL Editor** et exécute aussi **`supabase/migrations/0002_onboarding_and_stats.sql`** (après le premier script) — il ajoute le suivi d'onboarding et la position domicile du client.
7. Va dans **Authentication → Providers → Email** et vérifie que l'authentification par
   email/mot de passe est activée (c'est le cas par défaut).
8. **Pour tester facilement en local**, va dans **Authentication → Settings** et désactive
   temporairement **"Confirm email"** (comme ça, un compte créé est utilisable
   immédiatement, sans cliquer sur un lien reçu par email). Tu pourras le réactiver avant
   la mise en production.
9. Va dans **Project Settings → API**. Tu vas y trouver trois informations à copier :
   - **Project URL** → ce sera `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → ce sera `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → ce sera `SUPABASE_SERVICE_ROLE_KEY` (garde-la secrète, ne la
     mets jamais dans du code visible côté navigateur)

---

## 2. Configurer le projet en local

1. Dézippe le projet, ouvre un terminal dedans.
2. Installe les dépendances :
   ```bash
   npm install
   ```
3. Duplique le fichier d'exemple des variables d'environnement :
   ```bash
   cp .env.example .env.local
   ```
4. Ouvre `.env.local` et colle les 3 valeurs récupérées à l'étape 1.8 :
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxxxxxxxxxxxxx
   SUPABASE_SERVICE_ROLE_KEY=eyJxxxxxxxxxxxxxxxxxxxxxxx
   ```
5. Lance le serveur de développement :
   ```bash
   npm run dev
   ```
6. Ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur.

Tu devrais arriver sur la page de connexion 🎉

---

## 3. Tester l'application en local

1. Clique sur **Inscris-toi**, crée un compte en choisissant **"Client"**. Tu arrives
   directement sur l'accueil client (aucun vendeur ne sera encore visible, c'est normal).
2. Déconnecte-toi, crée un **deuxième** compte en choisissant cette fois **"Vendeur"**.
   Tu arrives sur le tableau de bord vendeur, avec un message pour compléter ton profil.
3. Va dans **Profil** (en bas), remplis le nom du commerce, la ville, etc. Clique
   **"Utiliser ma position actuelle"** pour la géolocalisation (autorise l'accès à ta
   position dans le navigateur).
4. Va dans **Stock**, ajoute une bouteille (ex: Total, 12kg, 5 pleines, prix).
5. **Important** : par défaut, un nouveau vendeur est en statut `pending` (en attente) et
   n'apparaît pas encore pour les clients. Pour l'activer, tu dois passer par le compte
   admin (étape suivante).

### Créer le compte administrateur

Il n'y a pas de bouton pour devenir admin (c'est volontaire, pour la sécurité). Pour
créer ton premier admin :

1. Inscris-toi normalement (choisis "Client", peu importe).
2. Va dans Supabase → **SQL Editor**, et exécute cette requête en remplaçant l'email :
   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'ton-email@exemple.com');
   ```
3. Déconnecte-toi et reconnecte-toi dans l'appli : tu arrives sur l'espace admin.
4. Dans **Vendeurs**, tu peux maintenant **Activer** le vendeur que tu as créé plus tôt.
5. Reconnecte-toi avec le compte client : le vendeur activé apparaît maintenant sur
   l'accueil, avec son stock. Tu peux passer une commande de bout en bout !

---

## 4. Héberger en production (Vercel + Supabase)

1. Mets ton projet sur GitHub (crée un dépôt, `git init`, `git add .`, `git commit`,
   `git push`) — ou utilise l'import direct de dossier si tu préfères.
2. Va sur [vercel.com](https://vercel.com) → **Add New → Project** → importe ton dépôt
   GitHub.
3. Dans les réglages du projet Vercel, section **Environment Variables**, ajoute les
   3 mêmes variables que dans ton `.env.local` :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Clique **Deploy**. Après 1-2 minutes, ton appli est en ligne sur une URL du type
   `https://allogaz.vercel.app`.
5. **Avant de partager l'appli publiquement** : retourne dans Supabase →
   **Authentication → Settings** et **réactive "Confirm email"** pour éviter les faux
   comptes.
6. Optionnel : dans Vercel, tu peux relier un nom de domaine personnalisé (ex:
   `allogaz.bf`) dans **Settings → Domains**.

Chaque fois que tu pousses du code sur GitHub, Vercel redéploie automatiquement.

---

## 5. Comment le projet est organisé

```
allogaz/
├── supabase/migrations/0001_init.sql   # Schéma complet de la base (tables, sécurité)
├── src/
│   ├── app/                            # Toutes les pages (routing Next.js)
│   │   ├── login/, register/           # Authentification
│   │   ├── client/                     # Espace client (accueil, commander, historique, profil)
│   │   ├── vendor/                     # Espace vendeur (dashboard, stock, commandes, profil)
│   │   └── admin/                      # Espace admin (dashboard, vendeurs, commandes, utilisateurs)
│   ├── components/
│   │   ├── ui/                         # Boutons, cartes, champs — briques réutilisables
│   │   └── layout/                     # Barres de navigation, en-tête
│   └── lib/
│       ├── supabase/                   # Connexion à la base de données
│       └── actions/                    # Toute la logique métier (créer une commande, etc.)
└── middleware.js                       # Protège les pages selon le rôle connecté
```

### Ce qui est déjà fonctionnel

- Inscription minimale (email + mot de passe) suivie d'un **onboarding animé et progressif**
  façon appli mobile récente : un écran plein écran par info, swipe ou bouton pour avancer,
  aucune adresse à taper — le client partage sa position une fois chez lui et l'app déduit
  son quartier automatiquement (géocodage inverse via OpenStreetMap)
- Sécurité par ligne (RLS) : un vendeur ne voit jamais les données d'un autre vendeur
- Recherche des vendeurs actifs par ville, affichage du stock disponible en temps réel
- Commande complète (choix bouteille, quantité, livraison/retrait, paiement)
- Suivi de statut de commande (en attente → acceptée → en livraison → terminée)
- Gestion de stock vendeur (ajout, mise à jour, suppression)
- Validation / suspension des vendeurs par l'admin
- Avis clients avec note moyenne mise à jour automatiquement
- **Statistiques** : côté client (commandes totales, argent dépensé, vendeur préféré),
  côté vendeur (revenus, graphique d'activité des 7 derniers jours, taux de complétion)
- **Design responsive complet** : navigation par onglets en bas sur mobile, vraie barre
  latérale (sidebar) et grilles multi-colonnes sur desktop — pas juste une version mobile
  étirée
- Animations fluides (Framer Motion) sur l'onboarding et les listes de vendeurs
- Design "flamme" distinctif (orange/ambre, typographie Space Grotesk + Inter)

### Ce qu'il reste à brancher pour une vraie mise en production

- **Paiement mobile money réel** : le champ existe (Orange Money / Moov Money / Espèces)
  mais aucune vraie transaction n'est déclenchée — il faudra intégrer l'API d'Orange
  Money / Moov Money (nécessite un compte marchand).
- **Notifications** (SMS ou push) quand une commande change de statut.
- **Envoi d'email transactionnel** (confirmation de commande) — Supabase peut s'en
  charger via ses templates, ou un service comme Resend.
- **Carte interactive** (actuellement les vendeurs sont listés par ville ; une vraie
  carte avec Mapbox ou Google Maps serait une belle amélioration).

---

## 6. Si quelque chose ne marche pas

- **Page blanche ou erreur au démarrage** → vérifie que `.env.local` contient bien les
  3 bonnes valeurs, sans espace ni guillemet.
- **"Aucun vendeur actif"** → normal tant qu'un admin n'a pas activé un vendeur (voir
  étape 3).
- **Erreur lors de l'inscription** → vérifie dans Supabase que le SQL de l'étape 1.5 a
  bien été exécuté sans erreur (onglet **Table Editor**, tu dois voir les tables
  `profiles`, `vendors`, `gas_stock`, `orders`, `reviews`).
- Pour toute autre erreur, ouvre la console du navigateur (F12) et/ou le terminal où
  tourne `npm run dev` — le message d'erreur y est presque toujours explicite.

Bon développement 🔥
