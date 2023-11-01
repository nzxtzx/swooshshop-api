import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from "cors"
import mongoDataBase from './mongodb/mongodb.js';

import { handleValidationErrors, checkAuth } from './utils/index.js';

import { ProductController, SwiperController, UserController, ReviewController } from './controllers/index.js';

dotenv.config();
mongoDataBase();
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT || 5000, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server in order');
});

app.get('/', (req, res) => {
  res.send('Server launched')
})

app.post('/auth/login', UserController.login);
app.post('/auth/register', UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);
app.patch('/auth/me/edit/:id', UserController.editOne);
app.patch('/auth/me/edit/password/:id', UserController.getEditingUser);
app.post('/auth/me/address/:id', UserController.getUserAdress);
app.patch('/auth/me/address/edit/:id', UserController.getEditedAddress);
app.patch('/auth/me/address/remove/:id', UserController.getDeleteUserAddress);
app.get('/products', ProductController.getAll);
app.get('/products/paginate', ProductController.getProductsHome)
app.get('/products/discounted', ProductController.getDiscounted);
app.get('/products/filters', ProductController.getFiltered);
app.get('/products/product/:id', ProductController.getOne);
app.post('/products/product/:id/reviews/review/:userId', ReviewController.createReview)