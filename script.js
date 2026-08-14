/* ==========================================
   ZAID'S SWEET HOUSE
   COMPLETE FIXED SCRIPT.JS
========================================== */


/* ==========================================
   CART
========================================== */

let cart = [];


/* ==========================================
   LOAD CART FROM LOCAL STORAGE
========================================== */

function loadCart() {

    try {

        const savedCart = localStorage.getItem("zaidsSweetHouseCart");

        if (savedCart) {

            cart = JSON.parse(savedCart);

            if (!Array.isArray(cart)) {
                cart = [];
            }

        }

    } catch (error) {

        console.error("Cart loading error:", error);

        cart = [];

    }

}


/* ==========================================
   SAVE CART
========================================== */

function saveCart() {

    try {

        localStorage.setItem(
            "zaidsSweetHouseCart",
            JSON.stringify(cart)
        );

    } catch (error) {

        console.error("Cart saving error:", error);

    }

}


/* ==========================================
   ADD WEIGHTED PRODUCT
========================================== */

function addWeightedProduct(name, pricePerKg, weightId) {

    const weightSelect = document.getElementById(weightId);

    if (!weightSelect) {

        console.error("Weight selector not found:", weightId);

        return;

    }

    const weight = parseFloat(weightSelect.value);

    if (isNaN(weight) || weight <= 0) {

        alert("Please select a valid weight.");

        return;

    }

    const weightText =
        weight === 1
            ? "1 kg"
            : `${weight * 1000}g`;

    const finalPrice =
        Math.round(Number(pricePerKg) * weight);

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

    saveCart();

    displayCart();

}


/* ==========================================
   ADD NORMAL PRODUCT
========================================== */

function addToCart(name, price) {

    const numericPrice = Number(price);

    if (isNaN(numericPrice)) {

        console.error("Invalid product price:", price);

        return;

    }

    const item = cart.find(
        product =>
            product.name === name &&
            !product.weight
    );

    if (item) {

        item.quantity++;

    } else {

        cart.push({

            name: name,

            price: numericPrice,

            quantity: 1

        });

    }

    saveCart();

    displayCart();

}


/* ==========================================
   DISPLAY CART
========================================== */

function displayCart() {

    const cartCount =
        document.getElementById("cartCount");

    const cartBox =
        document.getElementById("cartItems");

    const totalBox =
        document.getElementById("total");

    const summaryBox =
        document.getElementById("summaryItems");

    const summaryTotal =
        document.getElementById("summaryTotal");


    /* ---------- CART COUNT ---------- */

    if (cartCount) {

        const count = cart.reduce(
            (sum, item) =>
                sum + Number(item.quantity || 0),
            0
        );

        cartCount.innerText =
            count > 0 ? `(${count})` : "(0)";

    }


    /* ---------- CLEAR OLD CONTENT ---------- */

    if (cartBox) {
        cartBox.innerHTML = "";
    }

    if (summaryBox) {
        summaryBox.innerHTML = "";
    }


    /* ---------- EMPTY CART ---------- */

    if (cart.length === 0) {

        if (cartBox) {

            cartBox.innerHTML =
                "<h3>Your cart is empty 🛒</h3>";

        }

        if (summaryBox) {

            summaryBox.innerHTML =
                "No items added";

        }

        if (totalBox) {

            totalBox.innerText = "0";

        }

        if (summaryTotal) {

            summaryTotal.innerText = "0";

        }

        return;

    }


    /* ---------- DISPLAY ITEMS ---------- */

    let total = 0;

    cart.forEach((item, index) => {

        const price =
            Number(item.price) || 0;

        const quantity =
            Number(item.quantity) || 0;

        const itemTotal =
            price * quantity;

        total += itemTotal;


        /* ---------- CART ITEM ---------- */

        if (cartBox) {

            const cartItem =
                document.createElement("div");

            cartItem.className = "cart-item";

            cartItem.innerHTML = `

                <h3>${escapeHTML(item.name)}</h3>

                <p>
                    ${item.weight
                        ? escapeHTML(item.weight) + " × "
                        : ""
                    }
                    ₹${price} × ${quantity}
                </p>

                <button
                    type="button"
                    onclick="changeQuantity(${index}, -1)"
                >
                    −
                </button>

                <button
                    type="button"
                    onclick="changeQuantity(${index}, 1)"
                >
                    +
                </button>

                <button
                    type="button"
                    onclick="removeItem(${index})"
                >
                    ❌ Remove
                </button>

            `;

            cartBox.appendChild(cartItem);

        }


        /* ---------- ORDER SUMMARY ---------- */

        if (summaryBox) {

            const summaryItem =
                document.createElement("p");

            summaryItem.innerText =
                `${item.name}` +
                `${item.weight ? ` (${item.weight})` : ""}` +
                ` × ${quantity} = ₹${itemTotal}`;

            summaryBox.appendChild(summaryItem);

        }

    });


    /* ---------- TOTAL ---------- */

    if (totalBox) {

        totalBox.innerText = total;

    }

    if (summaryTotal) {

        summaryTotal.innerText = total;

    }

}


/* ==========================================
   CHANGE QUANTITY
========================================== */

function changeQuantity(index, change) {

    if (!cart[index]) {

        return;

    }

    cart[index].quantity =
        Number(cart[index].quantity) + Number(change);


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }

    saveCart();

    displayCart();

}


/* ==========================================
   REMOVE ITEM
========================================== */

function removeItem(index) {

    if (!cart[index]) {

        return;

    }

    cart.splice(index, 1);

    saveCart();

    displayCart();

}


/* ==========================================
   ESCAPE HTML
========================================== */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* ==========================================
   CHECKOUT
========================================== */

const checkoutForm =
    document.getElementById("checkoutForm");


if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();


            /* ---------- EMPTY CART ---------- */

            if (cart.length === 0) {

                alert("Your cart is empty!");

                return;

            }


            /* ---------- CUSTOMER DETAILS ---------- */

            const nameInput =
                document.getElementById("customerName");

            const addressInput =
                document.getElementById("customerAddress");

            const phoneInput =
                document.getElementById("customerPhone");


            const name =
                nameInput
                    ? nameInput.value.trim()
                    : "";

            const address =
                addressInput
                    ? addressInput.value.trim()
                    : "";

            const phone =
                phoneInput
                    ? phoneInput.value.trim()
                    : "";


            if (!name || !address || !phone) {

                alert(
                    "Please fill all customer details."
                );

                return;

            }


            /* ---------- PAYMENT ---------- */

            const paymentInput =
                document.querySelector(
                    'input[name="payment"]:checked'
                );


            if (!paymentInput) {

                alert(
                    "Please select a payment method."
                );

                return;

            }


            const paymentMethod =
                paymentInput.value;


            /* ==========================================
               ORDER ID + DATE + TIME
            ========================================== */

            const now = new Date();


            const orderId =
                "ZSH-" +
                Date.now()
                    .toString()
                    .slice(-6);


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


            /* ==========================================
               CALCULATE ORDER
            ========================================== */

            let subtotal = 0;

            let order = "";


            cart.forEach(item => {

                const itemTotal =
                    Number(item.price) *
                    Number(item.quantity);


                subtotal += itemTotal;


                order +=
`${item.name}
${item.weight
    ? `Weight : ${item.weight}\n`
    : ""
}Qty : ${item.quantity}
Price : ₹${itemTotal}

`;

            });


            /* ---------- FUTURE READY ---------- */

            const discount = 0;

            const deliveryCharge = 0;


            const grandTotal =
                subtotal -
                discount +
                deliveryCharge;


            /* ==========================================
               WHATSAPP MESSAGE
            ========================================== */

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


            /* ==========================================
               CUSTOMER DIGITAL BILL
            ========================================== */

            setBillText(
                "billOrderId",
                orderId
            );

            setBillText(
                "billDate",
                `${billDate} | ${billTime}`
            );

            setBillText(
                "billCustomerName",
                name
            );

            setBillText(
                "billCustomerPhone",
                phone
            );

            setBillText(
                "billCustomerAddress",
                address
            );

            setBillText(
                "billPaymentMethod",
                paymentMethod
            );


            /* ==========================================
               BILL ITEMS
            ========================================== */

            const billItems =
                document.getElementById("billItems");


            if (billItems) {

                billItems.innerHTML = "";


                cart.forEach(item => {

                    const itemTotal =
                        Number(item.price) *
                        Number(item.quantity);


                    const row =
                        document.createElement("tr");


                    row.innerHTML = `

                        <td>
                            ${escapeHTML(item.name)}
                        </td>

                        <td>
                            ${escapeHTML(
                                item.weight || "-"
                            )}
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

                    `;


                    billItems.appendChild(row);

                });

            }


            /* ==========================================
               BILL TOTALS
            ========================================== */

            setBillText(
                "billSubtotal",
                subtotal
            );

            setBillText(
                "billDiscount",
                discount
            );

            setBillText(
                "billDelivery",
                deliveryCharge
            );

            setBillText(
                "billGrandTotal",
                grandTotal
            );


            /* ==========================================
               SHOW DIGITAL BILL
            ========================================== */

            const customerBill =
                document.getElementById("customerBill");


            if (customerBill) {

                customerBill.style.display =
                    "block";


                customerBill.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }


            /* ==========================================
               OPEN WHATSAPP
            ========================================== */

            window.open(
                whatsappURL,
                "_blank"
            );


            /* ==========================================
               CLEAR CART
            ========================================== */

            cart = [];

            saveCart();

            displayCart();


            /* ==========================================
               RESET CHECKOUT FORM
            ========================================== */

            checkoutForm.reset();

        }
    );

}


/* ==========================================
   BILL TEXT HELPER
========================================== */

function setBillText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.innerText = value;

    }

}


/* ==========================================
   PRINT BILL
========================================== */

function printBill() {

    const customerBill =
        document.getElementById("customerBill");


    if (!customerBill) {

        alert("Bill not found.");

        return;

    }


    window.print();

}


/* ==========================================
   SEARCH PRODUCTS
========================================== */

const searchFood =
    document.getElementById("searchFood");


if (searchFood) {

    searchFood.addEventListener(
        "input",
        function () {

            const value =
                searchFood.value
                    .trim()
                    .toLowerCase();


            const cards =
                document.querySelectorAll(
                    "#menu .card, .menu-container .card"
                );


            cards.forEach(function (card) {

                const titleElement =
                    card.querySelector("h3");


                if (!titleElement) {

                    return;

                }


                const productName =
                    titleElement.innerText
                        .toLowerCase();


                card.style.display =
                    productName.includes(value)
                        ? ""
                        : "none";

            });

        }
    );

}


/* ==========================================
   CATEGORY FILTER
========================================== */

function filterFood(category) {

    const container = document.querySelector("#menu .menu-container");
    const cards = document.querySelectorAll("#menu .menu-container .card");

    if (!container) return;

    if (category === "all") {

        container.classList.remove("filtered");

    } else {

        container.classList.add("filtered");

    }

    cards.forEach(function(card) {

        const itemCategory = card.getAttribute("data-category");

        if (
            category === "all" ||
            itemCategory === category
        ) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

}

/* ==========================================
   INSTAGRAM AD CATEGORY
========================================== */

function applyCategoryFromURL() {

    const params = new URLSearchParams(
        window.location.search
    );

    const category = params.get("category");

    const validCategories = [
        "all",
        "sweets",
        "cakes",
        "farsan"
    ];

    if (validCategories.includes(category)) {

        filterFood(category);

    }

}

/* ==========================================
   MOBILE MENU
========================================== */

const menuBtn =
    document.getElementById("menuBtn");


const navMenu =
    document.querySelector("nav ul");


if (menuBtn && navMenu) {

    menuBtn.addEventListener(
        "click",
        function () {

            navMenu.classList.toggle("active");

        }
    );


    /* ---------- CLOSE MENU AFTER CLICK ---------- */

    navMenu.querySelectorAll("a").forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    navMenu.classList.remove(
                        "active"
                    );

                }
            );

        }
    );

}


/* ==========================================
   PAGE LOADER
========================================== */

window.addEventListener(
    "load",
    function () {

        const loader =
            document.querySelector(".loader");


        if (loader) {

            loader.style.display =
                "none";

        }

    }
);


/* ==========================================
   CONTACT FORM
========================================== */

const contactForm =
    document.getElementById("contactForm");


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();


            const nameInput =
                contactForm.querySelector(
                    'input[type="text"]'
                );


            const emailInput =
                contactForm.querySelector(
                    'input[type="email"]'
                );


            const phoneInput =
                contactForm.querySelector(
                    'input[type="tel"]'
                );


            const messageInput =
                contactForm.querySelector(
                    "textarea"
                );


            const name =
                nameInput
                    ? nameInput.value.trim()
                    : "";


            const email =
                emailInput
                    ? emailInput.value.trim()
                    : "";


            const phone =
                phoneInput
                    ? phoneInput.value.trim()
                    : "";


            const message =
                messageInput
                    ? messageInput.value.trim()
                    : "";


            if (!name || !phone || !message) {

                alert(
                    "Please fill all required fields."
                );

                return;

            }


            const whatsappMessage =
`📩 New Contact Message

Name: ${name}

Email: ${email}

Phone: ${phone}

Message:
${message}`;


            const whatsappURL =
                `https://wa.me/919424708856?text=${encodeURIComponent(
                    whatsappMessage
                )}`;


            window.open(
                whatsappURL,
                "_blank"
            );


            contactForm.reset();

        }
    );

}


/* ==========================================
   START PAGE FROM TOP
========================================== */

if (!window.location.hash) {

    history.scrollRestoration = "manual";


    window.addEventListener(
        "load",
        function () {

            setTimeout(
                function () {

                    window.scrollTo(
                        0,
                        0
                    );

                },
                100
            );

        }
    );

}


/* ==========================================
   INITIALIZE CART
========================================== */

loadCart();

displayCart();

applyCategoryFromURL();