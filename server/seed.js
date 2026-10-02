import mongoose from 'mongoose';
import 'dotenv/config';
import Product from './models/Product.js';

const products = [
  { name: 'Wireless Headphones', price: 59.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', category: 'Electronics', stock: 20 },
  { name: 'Running Shoes', price: 89.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', category: 'Footwear', stock: 15 },
  { name: 'Coffee Maker', price: 45.5, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085', category: 'Home', stock: 10 },
  { name: 'Bluetooth Speaker', price: 34.99, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1', category: 'Electronics', stock: 25 },
  { name: 'Desk Lamp', price: 22, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c', category: 'Home', stock: 30 },
  { name: 'Backpack', price: 49.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62', category: 'Accessories', stock: 12 },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected for seeding');
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('Products seeded!');
    process.exit();
  })
  .catch((err) => {
    console.error('Seeding error:', err);
    process.exit(1);
  });