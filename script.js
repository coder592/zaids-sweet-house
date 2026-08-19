/* ==========================================
   ZAID'S SWEET HOUSE
   COMPLETE SCRIPT.JS - FIXED
========================================== */


/* ==========================================
   CART
========================================== */

let cart = [];


/* ==========================================
   LOAD CART
========================================== */

function loadCart() {

    try {

        const savedCart =
            localStorage.getItem("zaidsSweetHouseCart");

        if (savedCart) {

            cart = JSON.parse(savedCart);

            if (!Array.isArray(cart)) {
                cart = [];
            }

        } else {

            cart = [];

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
   ESCAPE HTML
========================================== */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
/* ==========================================
   CUSTOMER ORDER STATUS DISPLAY
========================================== */

window.updateCustomerOrderStatus = function(status) {

    const statusBox =
        document.getElementById("billOrderStatus");

    if (!statusBox) {
        return;
    }

    const validStatuses = [
        "Pending",
        "Confirmed",
        "Preparing",
        "Delivered",
        "Cancelled"
    ];

    if (!validStatuses.includes(status)) {
        status = "Pending";
    }

    statusBox.innerText = status;

    statusBox.className =
        "order-status status-" +
        status.toLowerCase();

};

/* ==========================================
   ADD WEIGHTED PRODUCT
   PRODUCT-CARD QUANTITY CONTROL
========================================== */

function addWeightedProduct(
    name,
    pricePerKg,
    weightId,
    buttonElement
) {

    const weightSelect =
        document.getElementById(weightId);

    if (!weightSelect) {

        console.error(
            "Weight selector not found:",
            weightId
        );

        return;

    }


    const weight =
        parseFloat(weightSelect.value);


    if (
        !Number.isFinite(weight) ||
        weight <= 0
    ) {

        alert(
            "Please select a valid weight."
        );

        return;

    }


    const weightText =
        weight === 1
            ? "1 kg"
            : `${weight * 1000}g`;


    const finalPrice =
        Math.round(
            Number(pricePerKg) * weight
        );


    let existingItem =
        cart.find(function(item) {

            return (
                item.name === name &&
                item.weight === weightText
            );

        });


    if (existingItem) {

        existingItem.quantity =
            Number(
                existingItem.quantity || 0
            ) + 1;

    } else {

        cart.push({

            name: name,

            price: finalPrice,

            quantity: 1,

            weight: weightText

        });

    }


    /* SAVE + UPDATE CART */

    saveCart();

    displayCart();


    /* ==========================================
       PRODUCT CARD QUANTITY CONTROL
    ========================================== */

    const productKey =
        getProductKey(name);


    const quantityBox =
        document.getElementById(
            `qty-${productKey}`
        );


    const countBox =
        document.getElementById(
            `count-${productKey}`
        );


    if (quantityBox) {

        quantityBox.style.display =
        "flex";
        quantityBox.style.visibility =
        "visible";
        quantityBox.style.opacity =
        "1";
        quantityBox.style.pointerEvents =
        "auto";

    }


    if (countBox) {

        const currentItem =
            cart.find(function(item) {

                return (
                    item.name === name &&
                    item.weight === weightText
                );

            });


        countBox.innerText =
            currentItem
                ? currentItem.quantity
                : 1;

    }


    /* ==========================================
       ADD BUTTON FEEDBACK
    ========================================== */

    if (buttonElement) {

        const oldText =
            buttonElement.innerHTML;


        buttonElement.innerHTML =
            "✓ Added";


        buttonElement.classList.add(
            "added"
        );


        setTimeout(
            function() {

                buttonElement.innerHTML =
                    oldText;

                buttonElement.classList.remove(
                    "added"
                );

            },
            1000
        );

    }


    /* ==========================================
       CART FEEDBACK
    ========================================== */

    showCartAddedMessage(
        `${name} added to cart 🛒`
    );

}


/* ==========================================
   PRODUCT KEY
========================================== */

function getProductKey(name) {

    return String(name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

}


/* ==========================================
   CHANGE PRODUCT QUANTITY
========================================== */

function changeProductQuantity(
    name,
    change,
    weightId
) {

    const weightSelect =
        document.getElementById(weightId);


    if (!weightSelect) {

        return;

    }


    const weight =
        parseFloat(weightSelect.value);


    if (
        !Number.isFinite(weight) ||
        weight <= 0
    ) {

        return;

    }


    const weightText =
        weight === 1
            ? "1 kg"
            : `${weight * 1000}g`;


    const itemIndex =
        cart.findIndex(function(item) {

            return (
                item.name === name &&
                item.weight === weightText
            );

        });


    if (itemIndex === -1) {

        return;

    }


    cart[itemIndex].quantity =
        Number(
            cart[itemIndex].quantity || 0
        ) + Number(change);


    /* ==========================================
       REMOVE WHEN QUANTITY REACHES ZERO
    ========================================== */

    if (
        cart[itemIndex].quantity <= 0
    ) {

        cart.splice(
            itemIndex,
            1
        );


        const productKey =
            getProductKey(name);


        const quantityBox =
            document.getElementById(
                `qty-${productKey}`
            );


        if (quantityBox) {

            quantityBox.style.display =
            "flex";
            quantityBox.style.visibility =
            "hiddem";
            quantityBox.style.opacity =
            "0";
            quantityBox.style.pointerEvents =
            "none";

        }

    }


    saveCart();

    displayCart();


    /* UPDATE CARD COUNT */

    const productKey =
        getProductKey(name);


    const countBox =
        document.getElementById(
            `count-${productKey}`
        );


    const currentItem =
        cart.find(function(item) {

            return (
                item.name === name &&
                item.weight === weightText
            );

        });


    if (countBox) {

        countBox.innerText =
            currentItem
                ? currentItem.quantity
                : "0";

    }

}


/* ==========================================
   CART ADDED MESSAGE
========================================== */

function showCartAddedMessage(message) {

    const oldToast =
        document.getElementById(
            "cartAddedToast"
        );


    if (oldToast) {

        oldToast.remove();

    }


    const toast =
        document.createElement("div");


    toast.id =
        "cartAddedToast";


    toast.className =
        "cart-added-toast";


    toast.innerText =
        message;


    document.body.appendChild(
        toast
    );


    requestAnimationFrame(
        function() {

            toast.classList.add(
                "show"
            );

        }
    );


    setTimeout(
        function() {

            toast.classList.remove(
                "show"
            );


            setTimeout(
                function() {

                    toast.remove();

                },
                300
            );

        },
        1800
    );

}
/* ==========================================
   ADD NORMAL PRODUCT
========================================== */

function addToCart(name, price) {

    const numericPrice =
        Number(price);

    if (!Number.isFinite(numericPrice)) {

        console.error(
            "Invalid product price:",
            price
        );

        return;

    }

    const existingItem =
        cart.find(function(item) {

            return (
                item.name === name &&
                !item.weight
            );

        });

    if (existingItem) {

        existingItem.quantity =
            Number(existingItem.quantity || 0) + 1;

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
   FINAL DISPLAY CART
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


    /* ==========================================
       CART COUNT
    ========================================== */

    const totalQuantity =
        cart.reduce(function(sum, item) {

            return (
                sum +
                Number(item.quantity || 0)
            );

        }, 0);


    if (cartCount) {

        cartCount.innerText =
            `(${totalQuantity})`;

    }


    /* ==========================================
       CLEAR OLD CART
    ========================================== */

    if (cartBox) {

        cartBox.innerHTML = "";

    }


    if (summaryBox) {

        summaryBox.innerHTML = "";

    }


    /* ==========================================
       EMPTY CART
    ========================================== */

    if (!Array.isArray(cart) || cart.length === 0) {

        if (cartBox) {

            cartBox.innerHTML = `
                <div class="empty-cart">
                    <span>🛒</span>
                    <p>Your cart is empty</p>
                    <small>
                        Add some delicious items from our menu.
                    </small>
                </div>
            `;

        }


        if (summaryBox) {

            summaryBox.innerText =
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


    /* ==========================================
       TOTAL
    ========================================== */

    let total = 0;


    /* ==========================================
       DISPLAY CART ITEMS
    ========================================== */

    cart.forEach(function(item, index) {

        const price =
            Number(item.price) || 0;


        const quantity =
            Number(item.quantity) || 0;


        const itemTotal =
            price * quantity;


        total += itemTotal;


        /* --------------------------------------
           CART ITEM
        -------------------------------------- */

        const cartItem =
            document.createElement("div");


        cartItem.className =
            "cart-item";


        /* --------------------------------------
           ITEM INFO
        -------------------------------------- */

        const itemInfo =
            document.createElement("div");


        itemInfo.className =
            "cart-item-info";


        const itemName =
            document.createElement("h3");


        itemName.innerText =
            item.name;


        const itemDetails =
            document.createElement("p");


        itemDetails.innerText =
            `${item.weight ? "Weight: " + item.weight + " | " : ""}` +
            `Qty: ${quantity} | ` +
            `₹${price} each | ` +
            `Total: ₹${itemTotal}`;


        itemInfo.appendChild(
            itemName
        );


        itemInfo.appendChild(
            itemDetails
        );


        /* --------------------------------------
           REMOVE BUTTON
        -------------------------------------- */

        const removeButton =
            document.createElement("button");


        removeButton.type =
            "button";


        removeButton.className =
            "cart-remove-btn";


        removeButton.innerText =
            "Remove";


        removeButton.onclick =
            function() {

                removeCartItem(index);

            };


        /* --------------------------------------
           ADD TO CART ITEM
        -------------------------------------- */

        cartItem.appendChild(
            itemInfo
        );


        cartItem.appendChild(
            removeButton
        );


        if (cartBox) {

            cartBox.appendChild(
                cartItem
            );

        }


        /* ======================================
           ORDER SUMMARY
        ====================================== */

        if (summaryBox) {

            const summaryItem =
                document.createElement("p");


            summaryItem.innerText =
                `${item.name}` +
                `${item.weight ? " (" + item.weight + ")" : ""}` +
                ` × ${quantity}` +
                ` = ₹${itemTotal}`;


            summaryBox.appendChild(
                summaryItem
            );

        }

    });


    /* ==========================================
       TOTAL UPDATE
    ========================================== */

    if (totalBox) {

        totalBox.innerText =
            total;

    }


    if (summaryTotal) {

        summaryTotal.innerText =
            total;

    }

}


/* ==========================================
   REMOVE COMPLETE PRODUCT FROM CART
========================================== */

function removeCartItem(index) {

    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= cart.length
    ) {

        return;

    }


    const removedItem =
        cart[index];


    /* ------------------------------------------
       REMOVE FROM CART ARRAY
    ------------------------------------------ */

    cart.splice(
        index,
        1
    );


    /* ------------------------------------------
       SAVE CART
    ------------------------------------------ */

    saveCart();


    /* ------------------------------------------
       HIDE QUANTITY CONTROL
       FOR ONLY THAT PRODUCT
    ------------------------------------------ */

    if (removedItem) {

        const productKey =
            getProductKey(
                removedItem.name
            );


        const quantityBox =
            document.getElementById(
                `qty-${productKey}`
            );


        const countBox =
            document.getElementById(
                `count-${productKey}`
            );


        if (quantityBox) {

            quantityBox.style.display =
                "flex";

            quantityBox.style.visibility =
                "hidden";

            quantityBox.style.opacity =
                "0";

            quantityBox.style.pointerEvents =
                "none";

        }


        if (countBox) {

            countBox.innerText =
                "0";

        }

    }


    /* ------------------------------------------
       REFRESH CART
    ------------------------------------------ */

    displayCart();

}

/* ==========================================
   CHANGE QUANTITY
========================================== */

function changeQuantity(index, change) {

    if (!cart[index]) {

        return;

    }

    cart[index].quantity =
        Number(cart[index].quantity || 0) +
        Number(change);

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
   BILL TEXT HELPER
========================================== */

function setBillText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.innerText =
            value;

    }

}


/* ==========================================
   CHECKOUT
========================================== */

const checkoutForm =
    document.getElementById("checkoutForm");


if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        async function(e) {

            e.preventDefault();


            /* EMPTY CART */

            if (cart.length === 0) {

                alert("Your cart is empty!");

                return;

            }


            /* CUSTOMER DETAILS */

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


            /* PAYMENT */

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


            /* ORDER ID */

            const now =
                new Date();

            const orderId =
                "ZSH-" +
                Date.now()
                    .toString()
                    .slice(-6);

            localStorage.setItem(
                "zaidCurrentOrderId",
                orderId
            );        
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


            /* ORDER ITEMS */

            let subtotal = 0;

            let order = "";


            cart.forEach(function(item) {

                const itemTotal =
                    Number(item.price || 0) *
                    Number(item.quantity || 0);

                subtotal += itemTotal;


                /* IMPORTANT:
                   THIS WAS THE SYNTAX ERROR
                */

                order +=
                    `🍬 ${item.name}
${item.weight ? `⚖️ Weight: ${item.weight}\n` : ""}🔢 Qty: ${item.quantity}
💰 Total: ₹${itemTotal}

`;

            });


            /* CHARGES */

            const discount = 0;

            const deliveryCharge = 0;

            const grandTotal =
                subtotal -
                discount +
                deliveryCharge;


            /* ==========================================
               SAVE ORDER
            ========================================== */

            const newOrder = {

                orderId: orderId,

                date: `${billDate} | ${billTime}`,

                customerName: name,

                customerPhone: phone,

                customerAddress: address,

                paymentMethod: paymentMethod,

                items: cart.map(function(item) {

                    return {

                        name: item.name,

                        weight: item.weight || "",

                        quantity:
                            Number(item.quantity || 0),

                        price:
                            Number(item.price || 0)

                    };

                }),

                subtotal: subtotal,

                discount: discount,

                deliveryCharge: deliveryCharge,

                grandTotal: grandTotal,


            };


            let orders = [];


            try {

                orders =
                    JSON.parse(
                        localStorage.getItem(
                            "zaidsSweetHouseOrders"
                        )
                    ) || [];

                if (!Array.isArray(orders)) {

                    orders = [];

                }

            } catch (error) {

                console.error(
                    "Order loading error:",
                    error
                );

                orders = [];

            }


            orders.push(newOrder);


            localStorage.setItem(
                "zaidsSweetHouseOrders",
                JSON.stringify(orders)
            );
            try {

    if (window.saveOrderToFirestore) {

        await window.saveOrderToFirestore(newOrder);

        console.log(
            "Order saved to Firestore:",
            orderId
        );

    } else {

        console.error(
            "Firestore save function not available."
        );

    }

} catch (error) {

    console.error(
        "Firestore order save error:",
        error
    );

    alert(
        "Order saved locally, but Firebase order sync failed."
    );

}


            /* ==========================================
               WHATSAPP MESSAGE
            ========================================== */

            const message =
`🧾 *NEW ORDER - ZAID'S SWEET HOUSE*

━━━━━━━━━━━━━━━━━━
📌 *ORDER DETAILS*
━━━━━━━━━━━━━━━━━━

🆔 Order ID: ${orderId}
📅 Date: ${billDate}
⏰ Time: ${billTime}

👤 *CUSTOMER DETAILS*
Name: ${name}
📞 Phone: ${phone}
📍 Address: ${address}

💳 Payment: ${paymentMethod}

━━━━━━━━━━━━━━━━━━
🛒 *ORDER ITEMS*
━━━━━━━━━━━━━━━━━━

${order}

━━━━━━━━━━━━━━━━━━
💰 *PAYMENT SUMMARY*
━━━━━━━━━━━━━━━━━━

Subtotal: ₹${subtotal}
Discount: ₹${discount}
Delivery: ₹${deliveryCharge}

*GRAND TOTAL: ₹${grandTotal}*

━━━━━━━━━━━━━━━━━━
✅ *ORDER CONFIRMED SUCCESSFULLY*

📞 We will contact you shortly
regarding your order.

Thank you for choosing
*Zaid's Sweet House* ❤️

━━━━━━━━━━━━━━━━━━`;


            const whatsappURL =
                `https://wa.me/919424708856?text=${
                    encodeURIComponent(message)
                }`;


            /* ==========================================
               DIGITAL BILL
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

            
            const billItems =
                document.getElementById("billItems");


            if (billItems) {

                billItems.innerHTML = "";


                cart.forEach(function(item) {

                    const itemTotal =
                        Number(item.price || 0) *
                        Number(item.quantity || 0);


                    const row =
                        document.createElement("tr");


                    row.innerHTML = `

                        <td>
                            ${escapeHTML(item.name)}
                        </td>

                        <td>
                            ${
                                item.weight
                                    ? escapeHTML(item.weight)
                                    : "-"
                            }
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
   CUSTOMER ORDER STATUS
========================================== */
           
            /* SHOW BILL */

            const customerBill =
                document.getElementById(
                    "customerBill"
                );


            if (customerBill) {

                customerBill.style.display =
                    "block";

                customerBill.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }


            /* OPEN WHATSAPP */

            window.open(
                whatsappURL,
                "_blank"
            );


            /* CLEAR CART */

            cart = [];

            saveCart();

            displayCart();


            /* RESET FORM */

            checkoutForm.reset();

            setTimeout(
                updatePaymentDisplay,
                0
            );

        }
    );

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
   DOWNLOAD BILL PDF
========================================== */

function downloadBillPDF() {

    if (!window.jspdf) {

        alert(
            "PDF system is not loaded. Please refresh the page."
        );

        return;

    }


    const { jsPDF } =
        window.jspdf;


    const pdf =
        new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });


    const getText =
        function(id, fallback = "---") {

            const element =
                document.getElementById(id);

            return element
                ? element.innerText.trim()
                : fallback;

        };


    const orderId =
        getText("billOrderId");

    const date =
        getText("billDate");

    const customerName =
        getText("billCustomerName");

    const customerPhone =
        getText("billCustomerPhone");

    const customerAddress =
        getText("billCustomerAddress");

    const paymentMethod =
        getText("billPaymentMethod");

    const subtotal =
        getText("billSubtotal", "0");

    const discount =
        getText("billDiscount", "0");

    const delivery =
        getText("billDelivery", "0");

    const grandTotal =
        getText("billGrandTotal", "0");


    const left = 15;


    /* HEADER */

    pdf.setDrawColor(80, 50, 30);

    pdf.setLineWidth(0.5);

    pdf.roundedRect(
        12,
        10,
        186,
        42,
        3,
        3
    );


    const logo =
        document.querySelector(
            "#customerBill img"
        );


    if (logo && logo.complete) {

        try {

            pdf.addImage(
                logo,
                "PNG",
                18,
                16,
                28,
                28
            );

        } catch (error) {

            console.warn(
                "Logo could not be added.",
                error
            );

        }

    }


    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(20);

    pdf.text(
        "ZAID'S SWEET HOUSE",
        105,
        22,
        {
            align: "center"
        }
    );


    pdf.setFont(
        "helvetica",
        "normal"
    );

    pdf.setFontSize(10);

    pdf.text(
        "Fresh Sweets | Cakes | Farsan",
        105,
        29,
        {
            align: "center"
        }
    );

    pdf.text(
        "Nagpur, Maharashtra, India",
        105,
        35,
        {
            align: "center"
        }
    );

    pdf.text(
        "Phone: +91 9424708856",
        105,
        41,
        {
            align: "center"
        }
    );

    pdf.text(
        "Email: zaidssweethouse@gmail.com",
        105,
        47,
        {
            align: "center"
        }
    );


    /* TITLE */

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(16);

    pdf.text(
        "CUSTOMER ORDER BILL",
        105,
        62,
        {
            align: "center"
        }
    );


    /* ORDER INFORMATION */

    pdf.setFont(
        "helvetica",
        "normal"
    );

    pdf.setFontSize(10);

    pdf.text(
        `Order ID: ${orderId}`,
        left,
        72
    );

    pdf.text(
        `Date: ${date}`,
        130,
        72
    );


    /* CUSTOMER */

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(11);

    pdf.text(
        "CUSTOMER DETAILS",
        left,
        84
    );


    pdf.setFont(
        "helvetica",
        "normal"
    );

    pdf.setFontSize(10);

    pdf.text(
        `Name: ${customerName}`,
        left,
        92
    );

    pdf.text(
        `Phone: ${customerPhone}`,
        left,
        99
    );


    const addressLines =
        pdf.splitTextToSize(
            `Address: ${customerAddress}`,
            175
        );


    pdf.text(
        addressLines,
        left,
        106
    );


    let tableY =
        116 +
        Math.max(
            0,
            (addressLines.length - 1) * 5
        );


    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(11);

    pdf.text(
        "ORDER ITEMS",
        left,
        tableY
    );


    tableY += 6;


    /* TABLE HEADER */

    pdf.setFillColor(
        235,
        220,
        200
    );

    pdf.rect(
        left,
        tableY,
        180,
        9,
        "F"
    );

    pdf.rect(
        left,
        tableY,
        180,
        9
    );


    pdf.setFontSize(9);

    pdf.text(
        "Product",
        18,
        tableY + 6
    );

    pdf.text(
        "Weight",
        85,
        tableY + 6
    );

    pdf.text(
        "Qty",
        117,
        tableY + 6
    );

    pdf.text(
        "Price",
        140,
        tableY + 6
    );

    pdf.text(
        "Total",
        170,
        tableY + 6
    );


    tableY += 9;


    /* TABLE ROWS */

    const rows =
        document.querySelectorAll(
            "#billItems tr"
        );


    pdf.setFont(
        "helvetica",
        "normal"
    );

    pdf.setFontSize(9);


    rows.forEach(function(row) {

        const cells =
            row.querySelectorAll("td");


        if (cells.length !== 5) {

            return;

        }


        const product =
            cells[0].innerText.trim();

        const weight =
            cells[1].innerText.trim();

        const qty =
            cells[2].innerText.trim();

        const price =
            cells[3].innerText.trim();

        const total =
            cells[4].innerText.trim();


        pdf.rect(
            left,
            tableY,
            180,
            8
        );


        pdf.text(
            product.substring(0, 30),
            18,
            tableY + 5
        );

        pdf.text(
            weight,
            85,
            tableY + 5
        );

        pdf.text(
            qty,
            117,
            tableY + 5
        );

        pdf.text(
            price,
            140,
            tableY + 5
        );

        pdf.text(
            total,
            170,
            tableY + 5
        );


        tableY += 8;

    });


    /* SUMMARY */

    tableY += 8;

    pdf.setFontSize(10);

    pdf.text(
        `Subtotal: Rs. ${subtotal}`,
        130,
        tableY
    );

    tableY += 7;

    pdf.text(
        `Discount: Rs. ${discount}`,
        130,
        tableY
    );

    tableY += 7;

    pdf.text(
        `Delivery: Rs. ${delivery}`,
        130,
        tableY
    );

    tableY += 9;


    /* GRAND TOTAL */

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(13);

    pdf.rect(
        125,
        tableY - 6,
        70,
        12
    );

    pdf.text(
        `Grand Total: Rs. ${grandTotal}`,
        130,
        tableY + 2
    );


    /* PAYMENT */

    tableY += 22;

    pdf.setFont(
        "helvetica",
        "normal"
    );

    pdf.setFontSize(10);

    pdf.text(
        `Payment Method: ${paymentMethod}`,
        left,
        tableY
    );

    
    /* FOOTER */

    pdf.line(
        left,
        265,
        195,
        265
    );

    pdf.setFontSize(9);

    pdf.text(
        "Thank you for ordering from Zaid's Sweet House",
        105,
        273,
        {
            align: "center"
        }
    );

    pdf.text(
        "Freshness & Quality You Can Trust",
        105,
        280,
        {
            align: "center"
        }
    );

    pdf.text(
        "Zaid Web Solutions",
        105,
        287,
        {
            align: "center"
        }
    );


    pdf.save(
        `${orderId}-Zaid-Sweet-House-Bill.pdf`
    );

}


/* ==========================================
   SEARCH + CATEGORY FILTER
========================================== */

let selectedCategory = "all";


const searchFood =
    document.getElementById("searchFood");


function applyProductFilters() {

    const cards =
        document.querySelectorAll(
            "#menu .menu-container .card"
        );


    const searchValue =
        searchFood
            ? searchFood.value.trim().toLowerCase()
            : "";


    cards.forEach(function(card) {

        const titleElement =
            card.querySelector("h3");


        const productName =
            titleElement
                ? titleElement.textContent
                    .trim()
                    .toLowerCase()
                : "";


        const category =
            String(
                card.dataset.category || ""
            )
            .trim()
            .toLowerCase();


        const categoryMatch =
            selectedCategory === "all" ||
            category === selectedCategory;


        const searchMatch =
            searchValue === "" ||
            productName.includes(searchValue);


        card.style.display =
            categoryMatch && searchMatch
                ? ""
                : "none";

    });

}


if (searchFood) {

    searchFood.addEventListener(
        "input",
        applyProductFilters
    );

}


function filterFood(category) {

    selectedCategory =
        category || "all";


    /* UPDATE ACTIVE FILTER BUTTON */

    const filterButtons =
        document.querySelectorAll(
            ".filter-btn"
        );


    filterButtons.forEach(function(button) {

        button.classList.remove("active");

    });


    const activeButton =
        document.querySelector(
            `.filter-btn[onclick="filterFood('${selectedCategory}')"]`
        );


    if (activeButton) {

        activeButton.classList.add("active");

    }


    /* APPLY PRODUCT FILTER */

    applyProductFilters();

}

function applyCategoryFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const category =
        params.get("category");


    const validCategories = [
        "all",
        "sweets",
        "cakes",
        "farsan"
    ];


    selectedCategory =
    category &&
    validCategories.includes(category)
        ? category
        : "all";

filterFood(selectedCategory);
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
        function() {

            navMenu.classList.toggle(
                "active"
            );

        }
    );


    navMenu
        .querySelectorAll("a")
        .forEach(function(link) {

            link.addEventListener(
                "click",
                function() {

                    navMenu.classList.remove(
                        "active"
                    );

                }
            );

        });

}


/* ==========================================
   PAGE LOADER
========================================== */

window.addEventListener(
    "load",
    function() {

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
        function(e) {

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

            const messageText =
                messageInput
                    ? messageInput.value.trim()
                    : "";


            if (!name || !phone || !messageText) {

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
${messageText}`;


            const whatsappURL =
                `https://wa.me/919424708856?text=${
                    encodeURIComponent(whatsappMessage)
                }`;


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

    history.scrollRestoration =
        "manual";


    window.addEventListener(
        "load",
        function() {

            setTimeout(
                function() {

                    window.scrollTo(0, 0);

                },
                100
            );

        }
    );

}


/* ==========================================
   PAYMENT METHOD TOGGLE
========================================== */

function updatePaymentDisplay() {

    const upiBox =
        document.querySelector(".upi-payment");

    const selectedPayment =
        document.querySelector(
            'input[name="payment"]:checked'
        );

    if (!upiBox) {
        return;
    }

    if (
        selectedPayment &&
        selectedPayment.value === "UPI"
    ) {

        upiBox.hidden = false;
        upiBox.style.display = "block";

    } else {

        upiBox.hidden = true;
        upiBox.style.display = "none";

    }
}


/* PAYMENT RADIO BUTTONS */

const paymentRadios =
    document.querySelectorAll(
        'input[name="payment"]'
    );

paymentRadios.forEach(function (radio) {

    radio.addEventListener(
        "change",
        updatePaymentDisplay
    );

});


/* INITIAL STATE */

updatePaymentDisplay();

/* ==========================================
   INITIALIZE
========================================== */

loadCart();

displayCart();

applyCategoryFromURL();

/* ==========================================
   NAVBAR ACTIVE BUTTON
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const navLinks =
        document.querySelectorAll("nav ul li a");

    const sections =
        document.querySelectorAll("section[id], header[id]");

    function updateActiveNav() {

        let currentSection = "";

        sections.forEach(function (section) {

            const sectionTop =
                section.offsetTop - 120;

            if (window.scrollY >= sectionTop) {

                currentSection =
                    section.getAttribute("id");

            }

        });

        navLinks.forEach(function (link) {

            link.classList.remove("active");

            const href =
                link.getAttribute("href");

            if (
                href === "#" + currentSection
            ) {

                link.classList.add("active");

            }

        });

    }

    window.addEventListener(
        "scroll",
        updateActiveNav
    );

    updateActiveNav();

});