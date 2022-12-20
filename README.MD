# NextJs + Express + TypeOrm + Postgres | Social Wires

This is a web application that allows you to publish your own posts and share them with your friends. It is a social network that allows you to share your thoughts and ideas with your friends.

## Getting Started

### Install dependencies

```bash
npm install
# or
yarn install
```

### Run db

Create a postgres database with the name that you will `specify` in .env file and run the backend server to create the tables.

### Create .env file

Create a .env file in the root of the project and add the variables that you will find in the .env.example file in backend folder


### Generate random info in database

Use the following endpoint to generate random info in database

```bash
curl --location --request GET 'http://localhost:4000/api/seed'
```

### Run the NextJs server


```bash
cd frontend
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Run the backend server

```bash
cd backend
npm run dev
# or
yarn dev
```

Open [http://localhost:4000](http://localhost:4000) with your browser to see the result.

### Run the production server

```bash
npm run build
npm run start
# or
yarn build
yarn start
```

### Check postman collection

You can find the postman collection in the root of the project.
