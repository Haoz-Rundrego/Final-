let orderBtn = document.querySelector("#orderBtn");
let orderSection = document.querySelector(".order");

orderBtn.addEventListener("click", function () {
  orderBtn.style.display = "none";
  orderSection.style.display = "block";
});

//LESSON3:
let cart_list = document.querySelector(".cart-items-list");
let cart_total = document.querySelector(".cart-total");

function get_item(item) {
  return `<div class = "cart-item">
        <h4 class="cart-item-title">${item.name}</h4>
        <img src="${item.img}" width="90px"/>
        <div class="cart-item-quantity">Кількість: 
        <input data-item="${
          item.name
        }" class="form-control quantity-input" type="number" name="quantity" min="1" value="${
    item.quantity
  }">
        </div>
        <div class="cart-item-price" data-price="${item.price}">${
    item.price * item.quantity
  } грн</div>
        </div>`;
}

function showCartList() {
  cart_list.innerHTML = "";
  for (let key in cart.items) {
    // проходимося по всіх ключах об'єкта cart.items
    cart_list.innerHTML += get_item(cart.items[key]);
  }
  cart_total.innerHTML = cart.calculateTotal();
}

showCartList();

cart_list.addEventListener("change", (event) => {
  let target = event.target;
  const itemTitle = target.getAttribute("data-item");
  const newQuantity = +target.value;
  if (newQuantity > 0) {
    cart.updateQuantity(itemTitle, newQuantity);
    showCartList(); // Оновити список товарів у кошику
  }
});
//LESSON3
