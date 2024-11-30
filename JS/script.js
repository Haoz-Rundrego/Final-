//LESSON3: Функція для отримання значення кукі за ім'ям
function getCookieValue(cookieName) {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  for (let cookie of cookies) {
    if (cookie.startsWith(cookieName + "=")) {
      return cookie.substring(cookieName.length + 1);
    }
  }
  return ""; // Return empty string if cookie is not found
}

//LESSON3: Оголошуємо асинхронну функцію для отримання продуктів з сервера
async function getProducts() {
  try {
    let response = await fetch("Game_DB.json");
    if (!response.ok) throw new Error("Failed to fetch products");

    let products = await response.json();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return an empty array if fetch fails
  }
}

// Генерація карток
// Генерація карток
function getCartHTML(product) {
  // Ensure that the product object is correctly stringified
  let productData = JSON.stringify(product);
  return `
    <div class="cart">
        <img class="cart-img" src="${product.img}">
        <h3 class="cart-name">${product.name}</h3>
        <h4 class="cart-def-price">Ринкова ціна: <span class="cart-def-price-sum">${product.FullPrice}</span></h4>
        <h4 class="cart-price">Наша ціна: <span class="cart-price-sum">${product.price}</span></h4>
        <button class="cart-buy" data-product='${productData}'>В кошик</button>
    </div>
  `;
}

//LESSON3: Функція для додавання товару до кошика при кліку на кнопку "Купити"
function addToCart(event) {
  const productData = event.target.getAttribute("data-product");

  // Log the productData to see what it looks like
  console.log("Product Data:", productData);

  try {
    const product = JSON.parse(productData); // Try parsing the product data
    alert("Товар додано в кошик ");
    console.log(product);
    cart.addItem(product);
  } catch (error) {
    console.error("Invalid product data:", error);
    alert("Error adding product to cart");
  }
}

//LESSON3: Завантаження продуктів і обробка кнопок
getProducts().then(function (products) {
  let productsList = document.querySelector(".products-list");
  if (productsList) {
    products.forEach(function (product) {
      productsList.innerHTML += getCartHTML(product);
    });
  }

  // отримуємо всі кнопки "Купити"
  let buyButtons = document.querySelectorAll(".products-list .cart-buy");
  if (buyButtons) {
    buyButtons.forEach(function (button) {
      button.addEventListener("click", addToCart);
    });
  }
});

// Створення класу кошика
class ShoppingCart {
  constructor() {
    this.items = {};
    this.cartCounter = document.querySelector(".cart-counter");
    console.log("Cart Counter:", this.cartCounter); // Check if it’s found
    this.cartElement = document.querySelector("#cart-items");
    this.loadCartFromCookies();
  }

  // Додавання товару до кошика
  addItem(item) {
    if (this.items[item.name]) {
      this.items[item.name].quantity += 1; // Якщо товар вже є, збільшуємо його кількість на одиницю
    } else {
      this.items[item.name] = item; // Якщо товару немає в кошику, додаємо його
      this.items[item.name].quantity = 1;
    }
    this.updateCounter(); // Оновлюємо лічильник товарів
    this.saveCartToCookies();
  }

  // Оновлення кількості товарів
  updateQuantity(itemName, newQuantity) {
    if (this.items[itemName]) {
      this.items[itemName].quantity = newQuantity;
      if (this.items[itemName].quantity == 0) {
        delete this.items[itemName];
      }
      this.updateCounter();
      this.saveCartToCookies();
    }
  }

  // Оновлення лічильника товарів
  updateCounter() {
    if (!this.cartCounter) {
      console.error("Cart counter element not found!");
      return; // Exit the function if the element is not found
    }

    let count = 0;
    for (let key in this.items) {
      count += this.items[key].quantity;
    }
    this.cartCounter.innerHTML = count;
  }

  // Зберігання кошика в кукі
  saveCartToCookies() {
    let cartJSON = JSON.stringify(this.items);
    document.cookie = `cart=${cartJSON}; max-age=${60 * 60 * 24 * 7}; path=/`;
  }

  // Завантаження кошика з кукі
  loadCartFromCookies() {
    let cartCookie = getCookieValue("cart");
    if (cartCookie && cartCookie !== "") {
      this.items = JSON.parse(cartCookie);
      this.updateCounter();
    }
  }

  // Обчислення загальної вартості товарів у кошику
  calculateTotal() {
    let total = 0;
    for (let key in this.items) {
      total += this.items[key].price * this.items[key].quantity; // рахуємо вартість усіх товарів
    }
    return total;
  }
}

// Створення об'єкта кошика
let cart = new ShoppingCart();

// Перехід до сторінки кошика
let CartBtn = document.getElementById("CartBtn");
CartBtn.addEventListener("click", function () {
  window.location.assign("cart.html");
});
