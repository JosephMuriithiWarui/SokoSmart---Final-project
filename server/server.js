const express = require('express');
const connectDB = require('./config/db');
const farmerRoutes = require('./routes/farmerRoutes');
const buyerRoutes = require('./routes/buyerRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use('/api/farmers', farmerRoutes);
app.use('/api/buyers', buyerRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
    res.send('🌿 Welcome to SokoSmart API!');
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});