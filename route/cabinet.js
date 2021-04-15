
// const router = require('cabinet').Router();
// const Order = require('../models/order')


// //добавить ручку
// router.get('/', (req, res) => {
//   res.render('courier');
// });






// router.get('/', (req, res) => {
//   res.render('orders');
// });






// router.post('/courier', async (req, res, next) => {
//   // let userInfo = await req.body
//   let order = new Order({
//     name: req.body.name,
//     place: req.body.place,
//     price: req.body.price,
//     discount: req.body.discount
//   })
//   await order.save()



//   res.redirect('/')
// })


const express = require('express');
const path = require('path');
const app = express();




app.set('view engine', 'hbs');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('views', path.join(__dirname, 'views'));


app.get('/courier', (req, res) => {
  res.render('courier');
});



// app.get('/order', (req, res) => {
//   res.render('orders');
// });


module.exports = app;



app.post('/courier', async (req, res, next) => {
  let orderInfo = await req.body
  console.log(orderInfo);
  console.log(req.body.place);
  let order = new Order({
    name: req.body.name,
    place: req.body.place,
    price: req.body.price,
    discount: req.body.discount
  })
  await order.save()



  // res.redirect('/')
})


