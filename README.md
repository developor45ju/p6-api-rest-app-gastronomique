# PIQUANTE
Cette application web a pour but de vendre nos sauces piquantes à travers une interface web

![Logo web site](https://user.oc-static.com/upload/2021/07/29/16275605596354_PiiquanteLogo.png)

## Fonctionnalités
**Système d'authentification**
* Login
* Signup

**Gestion des sauces piquantes**
* Création d'une sauce piquante
* Modification d'une sauce piquante
* Suppression d'une sauces piquantes

## Fonctionnement 
1. Inscrivez-vous
2. Connectez-vous
3. Cliquez sur le bouton **ADD SAUCE**
4. Remplisez tous les champs (**OBLIGATOIRE**)
5. Séléctionez une image (**OBLIGATOIRE**)

## Installation
1. Cloner le dépot, installer les dépendances et lancer le serveur :
```shell
git clone git@github.com:developor45ju/p6-api-rest-app-gastronomique.git
npm install
npm start
```
2. Se rendre sur le [Front-End](https://piquante-j7q6.onrender.com)

## Sécurités

- Argon2, un *algorithme de hashage* pour mot de passe
- dotenv, un package qui permet de créer des variables d'environnements pour sécurisé les donnés sensibles
- mongoose-unique-validator, pour que l'entrée *email* soit unique dans la base de donnée
- Helmet, un middleware qui permet d'aidé à la sécurisation de l'application web 
- express-rate-limit, un middleware qui permet de limité le nombre de requêtes dans uun intervalle de temps