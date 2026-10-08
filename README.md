# shopsphere

Full-stack e-commerce platform.

## Features
products, search, cart, orders, JWT auth, MongoDB

## Run
1. Start MongoDB / MongoDB Atlas.
2. Server: `cd server && npm install && copy .env.example .env && npm run dev`
3. Client: `cd client && npm install && npm run dev`

## Environment
Set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`.

## GitHub
Create a dedicated repository for this project. Do not commit `.env`.

Run `npm run seed` once for demo products and an admin account (`admin@shopsphere.pro` / `Demo123!`).
