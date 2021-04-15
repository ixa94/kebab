const express = require('express');
const { model } = require('../middleware/db-connect');
const router = express.Router();
const User = require('../models/users');
const Deliver = require('../models/deliver');
const Order = require('../models/foods');
const { sessionChecker } = require('../middleware/auth');
const bcrypt = require("bcrypt");

const saltRounds = 5

router.get('/', async (req, res) => {
  let order = await Order.find({}).sort({ price: -1 });

  let ordersDiscount = order.map((el) => {
    let percent = (+el.price * el.discount) / 100;
    percent = Math.floor(+el.price - percent)

    el.discountPrice = percent;

    return el;
  });

 

  res.render('dashboard', { ordersDiscount });
})



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


router.post('/courier', async (req, res, next) => {
 const title = 'Пользователь успешно создан'
  let order = new Order({
    name: req.body.name,
    place: req.body.place,
    price: req.body.price,
    discount: req.body.discount
  })

  await order.save()
  res.send({title})
})


module.exports = router;
