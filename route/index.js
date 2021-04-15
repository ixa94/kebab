const express = require('express');
const { model } = require('../middleware/db-connect');
const router = express.Router();
const User = require('../models/users');
const Deliver = require('../models/deliver');
const Order = require('../models/foods');
const { sessionChecker } = require('../middleware/auth');
const bcrypt = require("bcrypt");
// const path = require('path')

const saltRounds = 5

router.get('/', async (req, res) => {

  if (req.session.user) {
    let username = req.session.user.user 
    let order = await Order.find({}).sort({ price: -1 });

    let ordersDiscount = order.map((el) => {
      let percent = (+el.price + el.discount) / 100;
      el.discountPrice = percent;
      return el;
    });

  res.render('dashboard', { ordersDiscount,username,checked:!!username });

  } 
  if(!req.session.user) {
    let order = await Order.find({}).sort({ price: -1 });
    let ordersDiscount = order.map((el) => {
    let percent = (+el.price + el.discount) / 100;
    el.discountPrice = percent;
    return el;
  });

  res.render('dashboard', { ordersDiscount});
  }
})

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
  res.render('loginFor',{check})
});

router.get('/login', (req, res) => {
  res.render('login');
});

// ========================================РЕГИСТРАЦИЯ========================================
// Регистрация нового пользователя:
router.post('/registerForUser', async (req, res, next) => {
  try {
    // создаем нового пользователя, записываем в базу с шифрованием пароля
  const { userName, userEmail, userPassword, userPhone } = req.body;

  const user = new User({
    user: userName,
    email: userEmail,
    password: await bcrypt.hash(userPassword, saltRounds),
    phone:userPhone,
  });

  await user.save();
  
  // создаем новую сессию для пользователя
  req.session.user = user

  let username = req.session.user.user 
  
  res.redirect('/');
  
} catch (error) {
  next(error)
}
});

// регистрация нового курьераЖ
router.post('/registerForDeliver', async (req, res, next) => {
  try {
    // создаем курьера, записываем в бд
  const { deliverName, deliverEmail, deliverPassword, deliverPhone } = req.body;
  const deliver = new Deliver({
    deliverName,
    deliverEmail,
    deliverPassword: await bcrypt.hash(deliverPassword, saltRounds),
    deliverPhone,
  });

  await deliver.save();
  
  // создаем сессию для курьера
  req.session.deliver = deliver

  res.redirect('/courier')

  } catch (error) {
    next(error)
  }
})

// =========================================ВХОД ДЛЯ ЗАРЕГИСТРИРОВАННЫХ====================================
// For User:
router
  .route("/login/user")
  .get(sessionChecker, (req, res) => {
    res.render("loginFor");
  })
router
  .post('/', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email});

    // bcrypt - шифровальщик паролей, сравнивает пароль из POST запроса и пароль из БД
    if (user && (await bcrypt.compare(password, user.password))) {

      // формирование сессии, user добавляется в нее как объект
      req.session.user = user; 

      res.redirect('/');

    } else {
      res.redirect("/login/user");
    }
  });

router.get("/", (req, res) => {

  // если сессия есть, то вытаскиваем Юзер, чтобы рендерить его на странице
  if (req.session.user) {
    const { deliver } = req.session;
    res.render("dashboard", {user: req.session.user}) 
  } else {
    res.redirect("/login");
  }
});

// for deliver:

router
  .route("/login/deliver")
  .get(sessionChecker, (req, res) => {
    res.render("loginFor");
  })

router
  .post('/courierLog', async (req, res) => {
    const { deliverEmail, deliverPassword } = req.body;
    const deliver = await Deliver.findOne({deliverEmail});
     
    // bcrypt - шифровальщик паролей, сравнивает пароль из POST запроса и пароль из БД
    if (deliver && (await bcrypt.compare(deliverPassword, deliver.deliverPassword))) {

      // формирование сессии, user добавляется в нее как объект
      req.session.deliver = deliver; 
      res.redirect("/courier");

    } else {
      res.redirect("/login/deliver");
    }
  });

// router.get("/", (req, res) => {
//   // если сессия есть, то вытаскиваем Юзер, чтобы рендерить его на странице
//   if (req.session.user) {
//     const { deliver } = req.session;
//     res.render("dashboard")
//   } else {
//     res.redirect("/login");
//   }
// });

router.get("/logout", async (req, res, next) => {
  // если сессия существует, то выполняем код через try/catch
  // ДЛЯ ПОЛЬЗОВАТЕЛЯ
  if (req.session.user) {
    try {
      // уничтожение сессии (удаление файла)
      await req.session.destroy();
      // чистим куку (удаление в браузере)
      res.clearCookie("user_sid");
      // перенаправляемся на корень
      res.redirect("/");
    } catch (error) {
      // улетаем в обработчик ошибок (middleware/error-handlers)
      next(error);
    }
  } 
  // для курьера
  else if (req.session.deliver) {
    try {
      // уничтожение сессии (удаление файла)
      await req.session.destroy();
      // чистим куку (удаление в браузере)
      res.clearCookie("user_sid");
      // перенаправляемся на корень
      res.redirect("/");
    } catch (error) {
      // улетаем в обработчик ошибок (middleware/error-handlers)
      next(error);
    }
  } 
  else {
    res.redirect("/login");
  }
});


router.get('/dashboard', async (req, res) => {
})

router.get('/courier', (req, res) => {
  res.render('courier')
})

router.post('/courier', async (req, res, next) => {
 const title = 'Пользователь успешно создан'
  let order = new Order({
    name: req.body.name,
    place: req.body.place,
    price: req.body.price,
    discount: req.body.discount,
    deliver: req.session.deliver.deliverName,
  })

  await order.save()
  res.render('courier', {order} )
  // res.send({title})
})

module.exports = router;

// Отключить проверялки и включить обратно
// Из регистрации пользователя неправильный редирект
// поставить эмодзи рядом с "Я хочу"
// Зарендерить ошибки при регистрации.
// Подключить сессии для логина
// При верстке сделать "красоту" для карточек (обозначение валюты, скидки и проч.)
// доделать добавление картинки в кабинете курьера
// деплой
