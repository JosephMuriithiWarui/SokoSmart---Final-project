const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const farmerAuthRoutes = require('./routes/farmerAuthRoutes')
const farmerRoutes = require('./routes/farmerRoutes');
const buyerRoutes = require('./routes/buyerRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
    origin: 'http://localhost:5173' // or your production URL
  }));
app.use(express.json());
app.use('/api/farmers/auth', farmerAuthRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/buyers', buyerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send('🌿 Welcome to SokoSmart API!');
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});