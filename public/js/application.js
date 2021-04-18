const dels = document.querySelectorAll('.del');

if (dels.length !== 0) {
  dels.forEach((el) => {
    el.addEventListener('click', async (e) => {
      e.preventDefault();

      console.log(el.href);
      const response = await fetch(el.href, {
        method: 'DELETE',
      });

      const data = await response.text();

      console.log(data);
      el.parentElement.parentElement.parentElement.remove();
    });
  });
}

const buyer = document.querySelectorAll('.buyer');

buyer.forEach((buy) => {
  buy.addEventListener('click', async (e) => {
    e.preventDefault();

    const response = await fetch(buy.href)
    const data = await response.text()
    
  });
});
