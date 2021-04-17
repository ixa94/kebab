
const dels = document.querySelectorAll('.del')

if(dels.length !== 0){
  dels.forEach(el=>{
    el.addEventListener('click',async(e)=>{
      e.preventDefault()
      console.log(el.parentElement);
      console.log(el.href);
      const response = await fetch(el.href,{
        method:'DELETE'
      })
  
      const data = await response.text()
      
  
      console.log(data);
      el.parentElement.parentElement.remove()
    })
  })
  
}
