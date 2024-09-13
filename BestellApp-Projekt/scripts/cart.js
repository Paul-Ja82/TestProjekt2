function removeFoodAmount(i) {
    if (myDishes[i].amount > 0) {
        myDishes[i].amount -= 1;
        updateStorage();
    }
}

function deleteFromCart(i) {
    myDishes[i].amount = 0;
    deliveryFee=0
    updateStorage();
}

function saveCart() {
    let cartItems = [];
    for (let i = 0; i < myDishes.length; i++) {
        if (myDishes[i].amount > 0) {
            cartItems.push(myDishes[i]);
        }
    }
    localStorage.setItem('cart', JSON.stringify(cartItems));
}

function loadCart() {
    let storedCart = localStorage.getItem('cart');
    if (storedCart) {
        let savedDishes = JSON.parse(storedCart);
        for (let i = 0; i < savedDishes.length; i++) {
            for (let j = 0; j < myDishes.length; j++) {
                if (myDishes[j].name === savedDishes[i].name) {
                    myDishes[j].amount = savedDishes[i].amount;
                }
            }
        }
    }
}

function selectOption(option) {
    let deliveryButton = document.getElementById('deliveryButton');
    let pickupButton = document.getElementById('pickupButton');

    if (option === 'delivery') {
        deliveryFee = 5.00;
        deliveryButton.style.backgroundColor = "greenyellow";
        pickupButton.style.backgroundColor = "";
        localStorage.setItem('selectedOption', 'delivery');
    } else {
        deliveryFee = 0;
        pickupButton.style.backgroundColor = "greenyellow";
        deliveryButton.style.backgroundColor = "";
        localStorage.setItem('selectedOption', 'pickup');
    }
    updateCart();
}

function loadSelectedOption() {
    let selectedOption = localStorage.getItem('selectedOption');
    let deliveryButton = document.getElementById('deliveryButton');
    let pickupButton = document.getElementById('pickupButton');

    if (selectedOption === 'delivery') {
        deliveryFee = 5.00;
        deliveryButton.style.backgroundColor = "greenyellow";
        pickupButton.style.backgroundColor = "";
    } else {
        deliveryFee = 0;
        pickupButton.style.backgroundColor = "greenyellow";
        deliveryButton.style.backgroundColor = "";
    }
}

function updateCartItems() {
    let cartItems = document.getElementById('cartItems');
    let totalCount = 0;
    let subtotal = 0;
    let withDish = false;
    cartItems.innerHTML = '';
  
    for (let i = 0; i < myDishes.length; i++) {
      let dish = myDishes[i];
      if (dish.amount > 0) {
        totalCount += dish.amount;
        withDish = true;
        cartItems.innerHTML += getCartDishTemplate(dish, i);
        subtotal += dish.price * dish.amount;
      }
    }
    if (!withDish) {
        cartItems.innerHTML += '<p class="keinGericht">Warenkorb leer bitte Gericht hinzufügen...</p>';
    }
    cartItems.innerHTML += getSubtotalTemplate(subtotal);
    return { totalCount, subtotal, withDish };
}

function updateCartTotalsUser(totalCount, subtotal, total) {
    let smallCartCount = document.getElementById('smallCartCount');
    let smallCartTotal = document.getElementById('smallCartTotal');
    let cartTotal = document.getElementById('cartTotal');
  
    smallCartCount.textContent = totalCount;
    smallCartTotal.textContent = total.toFixed(2) + ' €';
    cartTotal.innerHTML = `Gesamtbetrag: ${total.toFixed(2)} €`;
}

  function updateDeliveryOptions(withDish) {
    let deliveryOptions = document.getElementById('deliveryOptions');
    let orderButton = document.getElementById('orderButton');
    let deliveryButton = document.getElementById('deliveryButton');
    let pickupButton = document.getElementById('pickupButton');
  
    if (withDish) {
      deliveryOptions.style.display = 'block';
      orderButton.style.display = 'block';
    } else {
      deliveryOptions.style.display = 'none';
      orderButton.style.display = 'none';
      deliveryButton.style.backgroundColor = '';
      pickupButton.style.backgroundColor = '';
      localStorage.removeItem('selectedOption');
      deliveryFee = 0;
    }
}

  function updateCartTotals(totalCount, subtotal, withDish) {
    let total = subtotal + deliveryFee;
    updateCartTotalsUser(totalCount, subtotal, total);
    updateDeliveryOptions(withDish);
}

  function updateCart() {
    let { totalCount, subtotal, withDish } = updateCartItems();
    updateCartTotals(totalCount, subtotal, withDish);
}

function Order() {
    let selectedOption = localStorage.getItem('selectedOption');
    if (!selectedOption) {
        showAlert('Bitte wählen Sie eine Lieferoption aus, bevor Sie die Bestellung aufgeben. ツ');
    } else {
        showAlert('Ihre Bestellung wurde erfolgreich aufgegeben. ヅ');
        for (let i = 0; i < myDishes.length; i++) {
            myDishes[i].amount = 0;
            cartTotal = 0;
            deliveryFee = 0;
        }
        localStorage.setItem('myDishes', JSON.stringify(myDishes));
        localStorage.removeItem('cart');
        updateCart();
        show();
    }
}