const express = require('express');
const { model } = require('../middleware/db-connect');
const router = express.Router();
const User = require('../models/users');
const Order = require('../models/foods');
const Deliver = require('../models/deliver');
const { sessionChecker } = require('../middleware/auth');
const bcrypt = require("bcrypt");

const saltRounds = 5

router.get('/', sessionChecker, (req, res) => {
  res.render('dashboard');
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

router.post('/registerForUser', async (req, res) => {
  try {
  const { userName, userEmail, userPassword, userPhone } = req.body;
  // console.log(req.body);
  const user = new User({
    user: userName,
    email: userEmail,
    password: await bcrypt.hash(userPassword, saltRounds),
    phone:userPhone,
  });

  console.log(user);
  await user.save();
  
  req.session.user = user
  
  res.redirect('/');
  
} catch (error) {
  next(error)
}
});

router.get('/courier', (req, res) => {
  res.render('courier')
})

router.post('/registerForDeliver', async (req, res, next) => {
  try {
  const { deliverName, deliverEmail, deliverPassword, deliverPhone } = req.body;
  // console.log(req.body);
  const deliver = new Deliver({
    deliverName,
    deliverEmail,
    deliverPassword: await bcrypt.hash(deliverPassword, saltRounds),
    deliverPhone,
  });

  console.log(deliver);

  await deliver.save();

  req.session.deliver = deliver

  console.log('1111111' + deliver);
  console.log('222222' + req.session.deliver);

  res.redirect('/courier')

  } catch (error) {
    next(error)
  }
})

router.get('/dashboard', async (req, res) => {
    
    console.log(orders);
})



module.exports = router;
