
const express = require("express");
const app = express()

  // Body POST запросов.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

 // Подключаем views(hbs)
 app.set("views", path.join(__dirname, "..", "views"));
 app.set("view engine", "hbs");

 app.use(express.static(path.join(__dirname, "..", "public")));

const order = document.querySelector('refusedOrder')

console.log(order);

order.addEventListener('submit', async (event) => {
  event.preventDefault();
  console.log(event.target.login.value);
  const response = await fetch('/', {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "adress": event.target.place.value,
      "price": event.target.price.value,
      "discount": event.target.discount.value,
    })
  })
  let res = response.json();
console.log(res);
  document.body.innerText += res
})


