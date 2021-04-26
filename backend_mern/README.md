# MERN Backend
```
mkdir backend
cd backend
npm init (by default the starting point would be index.js but I have chosen it to be server.js, totally your preference)
git init if you want to
```
make few changes in package.json before proceeding( can be done later too :))
1. After `"main":"server.js"`, add `"type": "module"`
    This will allow to have ES6 syntax
2. In scripts block add `"start": "node server.js"`

Install dependencies
```
$npm i express mongoose cors pusher
```