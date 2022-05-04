## Présentation

Ce projet utilise la stack suivante :
### back
Framework serveur : NestJS\
DB : PostgreSQL\
ORM : Prisma

### front
React

## Installation

```bash
$ yarn install

# front
$ cd front
$ yarn install
```

## Lier la base de donnée PostgreSQL à Prisma

Une fois la base de donnée créée en local, indiquer l'URL sur laquelle elle est lancée dans la variable `DATABASE_URL` du fichier `.env`.

Puis mettre à jour le client Prisma à l'aide de la commande suivante :
```bash
$ yarn prisma generate
```

## Lancer l'application

```bash
# back
$ yarn start:dev

# front
$ yarn start
```

## Compte administrateur

Une fois l'application lancée, faites un appel `POST` à l'URL suivante :\
`http://localhost:3000/auth/createAdmin`

### Identifiants du compte administrateur
Email : admin@groupomania.com \
Mot de passe : admin123
