/* ==========================================
   CART
========================================== */

let cart = [];

/* ==========================================
   ADD WEIGHTED PRODUCT
========================================== */

function addWeightedProduct(name, pricePerKg, weightId) {

    const weightSelect = document.getElementById(weightId);

    const weight = parseFloat(weightSelect.value);

    const weightText = weight === 1
        ? "1 kg"
        : `${weight * 1000}g`;

    const finalPrice = Math.round(pricePerKg * weight);

    const item = cart.find(
        product =>
            product.name === name &&
            product.weight === weightText
    );

    if (item) {

        item.quantity++;

    } else {

        cart.push({

            name: name,
            price: finalPrice,
            quantity: 1,
            weight: weightText

        });

    }

    displayCart();

}

/* ==========================================
   ADD TO CART
========================================== */

function addToCart(name, price) {

    const item = cart.find(product => product.name === name);

    if (item) {

        item.quantity++;

    } else {

        cart.push({

            name: name,
            price: price,
            quantity: 1

        });

    }

    displayCart();

}

     
// ==========================
// DISPLAY CART
// ==========================

function displayCart() {

    const cartCount = document.getElementById("cartCount");

if (cartCount) {
    const count = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    cartCount.innerText = `(${count})`;
}

    const cartBox = document.getElementById("cartItems");

    const totalBox = document.getElementById("total");

    const summaryBox = document.getElementById("summaryItems");

    const summaryTotal = document.getElementById("summaryTotal");

    let total = 0;

    if (cartBox) {

        cartBox.innerHTML = "";

    }

    if (summaryBox) {

        summaryBox.innerHTML = "";

    }

    if (cart.length === 0) {

        if (cartBox) {

            cartBox.innerHTML = "<h3>Your cart is empty 🛒</h3>";

        }

        if (summaryBox) {

            summaryBox.innerHTML = "No items added";

        }

        if (totalBox) {

            totalBox.innerHTML = "0";

        }

        if (summaryTotal) {

            summaryTotal.innerHTML = "0";

        }

        return;

    }

    cart.forEach((item, index) => {

        const itemTotal = item.price * item.quantity;

        total += itemTotal;

        if (cartBox) {

            cartBox.innerHTML += `

            <div class="cart-item">

                <h3>${item.name}</h3>

                <p>
    ${item.weight ? item.weight + " × " : ""}
    ₹${item.price} × ${item.quantity}
</p>
                <button onclick="changeQuantity(${index}, -1)">
                    −
                </button>

                <button onclick="changeQuantity(${index}, 1)">
                    +
                </button>

                <button onclick="removeItem(${index})">
                    ❌ Remove
                </button>

            </div>

            `;

        }

        if (summaryBox) {

            summaryBox.innerHTML += `

            <p>
    ${item.name}
    ${item.weight ? "(" + item.weight + ")" : ""}
    × ${item.quantity}
    = ₹${itemTotal}
</p>

            `;

        }

    });

    if (totalBox) {

        totalBox.innerHTML = total;

    }

    if (summaryTotal) {

        summaryTotal.innerHTML = total;

    }

}

// ==========================
// CHANGE QUANTITY
// ==========================

function changeQuantity(index, change) {

    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }

    displayCart();

}

// ==========================
// REMOVE ITEM
// ==========================

function removeItem(index) {

    cart.splice(index, 1);

    displayCart();

}
/* ==========================================
   CHECKOUT
========================================== */

const checkoutForm =
    document.getElementById("checkoutForm");

if (checkoutForm) {

    checkoutForm.addEventListener("submit", function (e) {

        e.preventDefault();

        // Empty Cart Check
        if (cart.length === 0) {

            alert("Your cart is empty!");

            return;

        }

        const name =
            document.getElementById("customerName").value.trim();

        const address =
            document.getElementById("customerAddress").value.trim();

        const phone =
            document.getElementById("customerPhone").value.trim();

        const paymentInput =
            document.querySelector(
                'input[name="payment"]:checked'
            );

        if (!paymentInput) {

            alert("Please select a payment method.");

            return;

        }

        const paymentMethod =
            paymentInput.value;


        // ==========================================
        // ORDER ID + DATE + TIME
        // ==========================================

        const now = new Date();

        const orderId =
            "ZSH-" +
            Date.now().toString().slice(-6);

        const billDate =
            now.toLocaleDateString("en-IN");

        const billTime =
            now.toLocaleTimeString(
                "en-IN",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );


        // ==========================================
        // CALCULATE ORDER
        // ==========================================

        let subtotal = 0;

        let order = "";

        cart.forEach(item => {

            const itemTotal =
                item.price * item.quantity;

            subtotal += itemTotal;

            order +=
`${item.name}
${item.weight ? `Weight : ${item.weight}
` : ""}Qty : ${item.quantity}
Price : ₹${itemTotal}

`;

        });


        // Future-ready
        const discount = 0;

        const deliveryCharge = 0;

        const grandTotal =
            subtotal -
            discount +
            deliveryCharge;


        // ==========================================
        // WHATSAPP MESSAGE
        // ==========================================

        const message =
`New Order - Zaid's Sweet House

Order ID : ${orderId}

Name : ${name}

Address : ${address}

Phone : ${phone}

Payment : ${paymentMethod}

Date : ${billDate}
Time : ${billTime}

-------------------------

${order}

-------------------------

Subtotal : ₹${subtotal}
Discount : ₹${discount}
Delivery : ₹${deliveryCharge}

Grand Total : ₹${grandTotal}`;


        const whatsappURL =
            `https://wa.me/919424708856?text=${encodeURIComponent(message)}`;


        // ==========================================
        // BILL CUSTOMER DETAILS
        // ==========================================

        document.getElementById("billOrderId").innerText =
            orderId;

        document.getElementById("billDate").innerText =
            `${billDate} | ${billTime}`;

        document.getElementById("billCustomerName").innerText =
            name;

        document.getElementById("billCustomerPhone").innerText =
            phone;

        document.getElementById("billCustomerAddress").innerText =
            address;

        document.getElementById("billPaymentMethod").innerText =
            paymentMethod;


        // ==========================================
        // BILL ITEMS
        // ==========================================

        const billItems =
            document.getElementById("billItems");

        if (billItems) {

            billItems.innerHTML = "";

            cart.forEach(item => {

                const itemTotal =
                    item.price * item.quantity;

                billItems.innerHTML += `

                    <tr>

                        <td>${item.name}</td>

                        <td>
                            ${item.weight || "-"}
                        </td>

                        <td>
                            ${item.quantity}
                        </td>

                        <td>
                            ₹${item.price}
                        </td>

                        <td>
                            ₹${itemTotal}
                        </td>

                    </tr>

                `;

            });

        }


        // ==========================================
        // BILL TOTALS
        // ==========================================

        document.getElementById("billSubtotal").innerText =
            subtotal;

        document.getElementById("billDiscount").innerText =
            discount;

        document.getElementById("billDelivery").innerText =
            deliveryCharge;

        document.getElementById("billGrandTotal").innerText =
            grandTotal;


        // ==========================================
        // SHOW BILL
        // ==========================================

        const customerBill =
            document.getElementById("customerBill");

        if (customerBill) {

            customerBill.style.display = "block";

            customerBill.scrollIntoView({
                behavior: "smooth"
            });

        }


        // ==========================================
        // OPEN WHATSAPP
        // ==========================================

        window.open(
            whatsappURL,
            "_blank"
        );


        // Clear Cart
        cart = [];

        displayCart();

        // Reset Form
        checkoutForm.reset();

    });

}
/* ==========================================
   SCROLL TO TOP
========================================== */

const topBtn = document.getElementById("topBtn");

if (topBtn) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 300) {

            topBtn.style.display = "block";

        }

        else {

            topBtn.style.display = "none";

        }

    });

    topBtn.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}
/* ==========================================
   SEARCH PRODUCTS
========================================== */

const searchFood = document.getElementById("searchFood");

if (searchFood) {

    searchFood.addEventListener("keyup", () => {

        const value = searchFood.value.toLowerCase();

        const cards = document.querySelectorAll(".card");

        cards.forEach(card => {

            const productName = card
                .querySelector("h3")
                .innerText
                .toLowerCase();

            if (productName.includes(value)) {

                card.style.display = "block";

            } else {

                card.style.display = "none";

            }

        });

    });

}

/* ==========================================
   CATEGORY FILTER
========================================== */

function filterFood(category){

    const cards = document.querySelectorAll(".card");

    cards.forEach(function(card){

        const itemCategory = card.getAttribute("data-category");

        if(category === "all" || itemCategory === category){

            card.style.display = "block";

        }else{

            card.style.display = "none";

        }

    });

}



/* ==========================================
   MOBILE MENU
========================================== */

const menuBtn = document.getElementById("menuBtn");

const navMenu = document.querySelector("nav ul");

if (menuBtn && navMenu) {

    menuBtn.addEventListener("click", () => {

        navMenu.classList.toggle("active");

    });

}

/* ==========================================
   PAGE LOADER
========================================== */

window.addEventListener("load", function () {
    const loader = document.querySelector(".loader");

    if(loader){
        loader.style.display = "none";
    }
})

/* ==========================================
   LOCAL STORAGE
========================================== */

// Save Cart

function saveCart() {}

/* ==========================================
   CONTACT FORM
========================================== */

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const name = contactForm.querySelector('input[type="text"]').value;

        const email = contactForm.querySelector('input[type="email"]').value;

        const phone = contactForm.querySelector('input[type="tel"]').value;

        const message = contactForm.querySelector("textarea").value;

        const whatsappMessage =
`📩 *New Contact Message*

👤 Name: ${name}

📧 Email: ${email}

📞 Phone: ${phone}

💬 Message:
${message}`;

        const whatsappURL =
`https://wa.me/919424708856?text=${encodeURIComponent(whatsappMessage)}`;

        window.open(whatsappURL, "_blank");

        contactForm.reset();

    });

}
/* ==========================================
   START PAGE FROM TOP
========================================== */

if (!window.location.hash) {

    history.scrollRestoration = "manual";

    window.addEventListener("load", function () {

        setTimeout(function () {

            window.scrollTo(0, 0);

        }, 100);

    });

}
