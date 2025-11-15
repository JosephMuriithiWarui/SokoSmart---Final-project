# SokoSmart

A MERN-stack marketplace that connects farmers and buyers. Farmers list products, buyers browse and place orders, and both manage their dashboards.

## Features
- **Authentication** with JWT for farmers and buyers
- **Farmer Dashboard** to add/manage products and view orders
- **Buyer Dashboard** to browse products, see farmer info (name, location, phone), and place/cancel orders
- **Products API** with farmer details populated
- **Responsive UI** with React + Tailwind CSS

## Tech Stack
- **Frontend:** React, React Router, Axios, Vite, Tailwind CSS
- **Backend:** Node.js, Express, Mongoose, JWT, bcryptjs, dotenv, CORS
- **Database:** MongoDB

## Folder Structure
```
SokoSmart---Final-project/
├─ client/                    
│  ├─ index.html               
│  ├─ package.json            
│  ├─ public/
│  └─ src/
│     ├─ main.jsx              
│     ├─ App.jsx               
│     ├─ components/           
│     ├─ pages/                
│     ├─ services/
│     │  └─ api.js             
│     └─ assets/
│        └─ images/
│           └─ logo.png        
│
└─ server/                     
   ├─ server.js               
   ├─ package.json             
   ├─ .env                     
   ├─ models/
   │  ├─ buyerModel.js
   │  ├─ farmerModel.js
   │  └─ productModel.js
   ├─ routes/
   │  ├─ productRoutes.js      
   │  ├─ farmerRoutes.js       
   │  └─ (orders routes)       
   └─ middleware/
      └─ authMiddleware.js     
```

## Getting Started
### Prerequisites
- Node.js LTS (v18+ recommended)
- MongoDB connection string (local or Atlas)

### 1) Install dependencies
```
git clone <repo-url>
cd SokoSmart---Final-project

# Server deps
cd server && npm install

# Client deps
cd ../client && npm install
```

### 2) Configure environment (server/.env)
Create `server/.env` with:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

### 3) Run in development
- Start the server:
```
cd server
npm run dev
```
- Start the client (new terminal):
```
cd client
npm run dev
```
- Open the Vite URL (usually http://localhost:5173)

### 4) Production
- Client build:
```
cd client
npm run build
```
- Server start:
```
cd server
npm start
```

## Live Demo 
https://sokosmart.vercel.app/

## Scripts
### Client (Vite)
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — lint code

### Server (Express)
- `npm run dev` — start with nodemon
- `npm start` — start with node

- **Products**
  - `GET /products` — List all products (farmer: name, location, phone populated)
  - `POST /products` — Add product (protected: farmer)

- **Orders**
  - `GET /orders/my-orders` — List orders for current buyer
  - `POST /orders` — Place order `{ productId, quantity }`
  - `DELETE /orders/:id` — Cancel pending order

- **Farmers**
  - `GET /farmers` — List all farmers
  - `GET /farmers/:id` — Get farmer by id
  - `POST /farmers` — Create farmer
  - `PUT /farmers/:id` — Update farmer
  - `DELETE /farmers/:id` — Delete farmer

Authentication uses Bearer tokens: `Authorization: Bearer <token>`.

## Live Demo 
https://sokosmart.vercel.app/

## UI Notes
- Buyer product cards show farmer name, phone, location, and stock.
## Contributing
- Use feature branches and small focused commits
- Run linters and ensure build passes

## License
Educational project. Add a license if you plan to open-source it.
