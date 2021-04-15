const express = require('express');
const { model } = require('../middleware/db-connect');
const router = express.Router();
const User = require('../models/users');
const Deliver = require('../models/deliver');
const Order = require('../models/foods');

router.get('/', async (req, res) => {
  let orders = await Order.find({}).sort({ price: -1 });

  let ordersDiscount = orders.map((el) => {
    let percent = (+el.price + el.discount) / 100;

    el.discountPrice = percent;

    return el;
  });

  //console.log(order);

  res.render('dashboard', { ordersDiscount });
});

router.get('/regForDeliver', (req, res) => {
  res.render('regForDeliver');
});

router.get('/regForUser', (req, res) => {
  res.render('regForUser');
});

router.get('/register', (req, res) => {
  res.render('register');
});



router.get('/login/:name', (req, res) => {
  let name = req.params.name;
  let check = name === 'user'
  console.log(check);
  
    res.render('loginFor',{check})
  
 
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/registerForUser', async (req, res) => {
  const { userName, userEmail, userPassword, userPhone } = req.body;
  console.log(req.body);
  const user = new User({
    user: userName,
    email: userEmail,
    password: userPassword,
    phone: userPhone,
  });

  console.log(user);

  await user.save();

  res.redirect('/');
});

router.get('/courier', (req, res) => {
  res.render('courier');
});

router.post('/regForDeliver', async (req, res) => {
  const { deliverName, deliverEmail, deliverPassword, deliverPhone } = req.body;
  console.log(req.body);
  const deliver = new Deliver({
    deliverName,
    deliverEmail,
    deliverPassword,
    deliverPhone,
  });

  console.log(deliver);

  await deliver.save();

  res.redirect('/courier');
});

router.post('/courier', async (req, res, next) => {
  let order = new Order({
    name: req.body.name,
    place: req.body.place,
    price: req.body.price,
    discount: req.body.discount,
  });

  console.log(order);
  await order.save();

  res.redirect('/');
});

module.exports = router;
