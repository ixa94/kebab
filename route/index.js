const express = require('express');
const { model } = require('../middleware/db-connect');
const router = express.Router();
const User = require('../models/users');
const Deliver = require('../models/deliver');

router.get('/', (req, res) => {
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
  const { userName, userEmail, userPassword, userPhone } = req.body;
  console.log(req.body);
  const user = new User({
    user: userName,
    email: userEmail,
    password:userPassword,
    phone:userPhone,
  });

  console.log(user);

  await user.save();

  res.redirect('/');
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

  res.redirect('register');
});

module.exports = router;
