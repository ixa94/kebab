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
    let percent = (+el.price + el.discount) / 100;

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
  const deliver = new Deliver({
    deliverName,
    deliverEmail,
    deliverPassword: await bcrypt.hash(deliverPassword, saltRounds),
    deliverPhone,
  });

  await deliver.save();

  req.session.deliver = deliver

  res.redirect('/courier')

  } catch (error) {
    next(error)
  }
})

// =============================================================================
// Добавляю сессии для логина


// For User:
router
  .route("/login")
  .get(sessionChecker, (req, res) => {
    res.render("login");
  })
  .post(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // bcrypt - шифровальщик паролей, сравнивает пароль из POST запроса и пароль из БД
    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.user = user; // формирование сессии, user добавляется в нее как объект
      console.log(req.session)
      res.redirect("/");
    } else {
      res.redirect("/login");
    }
  });

// router.get("/", (req, res) => {
//   // если сессия есть, то вытаскиваем Юзер, чтобы рендерить его на странице
//   if (req.session.user) {
//     const { user } = req.session;
//     res.render("dashboard", { name: user.username });
//   } else {
//     res.redirect("/login");
//   }
// });

router.get("/logout", async (req, res, next) => {
  // если сессия существует, то выполняем код через try/catch
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
  } else {
    res.redirect("/login");
  }
});



router.get('/dashboard', async (req, res) => {
    
    // console.log(orders);
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
