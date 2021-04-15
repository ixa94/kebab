const express = require('express');
const { model } = require('../middleware/db-connect');
const router = express.Router();
const User = require('../models/users');
const Deliver = require('../models/deliver');
const { sessionChecker } = require('../middleware/auth');

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
  try {
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

  req.session.user = user

  res.redirect('/');
  } catch (error) {
    next(error)
  }
});


router.post('/regForDeliver', async (req, res) => {
  try {
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

  req.session.deliver = deliver

  res.redirect('register');
  } catch (error) {
    next(error)
  }
});

module.exports = router;
