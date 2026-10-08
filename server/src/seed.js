import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Product from './models/Product.js';
import User from './models/User.js';
dotenv.config();
await mongoose.connect(process.env.MONGO_URI);
await Product.deleteMany({});
await Product.insertMany([
  {name:'Wireless Headphones',description:'Bluetooth over-ear headphones',price:79,category:'Audio',stock:50},
  {name:'Mechanical Keyboard',description:'Compact mechanical keyboard',price:109,category:'Workspace',stock:30},
  {name:'USB-C Hub',description:'7-in-1 USB-C hub',price:39,category:'Accessories',stock:80},
  {name:'Webcam Pro',description:'1080p webcam for calls',price:59,category:'Workspace',stock:40}
]);
const hash=await bcrypt.hash('Demo123!',10);
await User.updateOne({email:'admin@shopsphere.pro'},{$set:{name:'Demo Admin',email:'admin@shopsphere.pro',password:hash,role:'admin'}},{upsert:true});
console.log('ShopSphere seed complete. Admin: admin@shopsphere.pro / Demo123!');
await mongoose.disconnect();
