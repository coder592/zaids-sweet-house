/* ==========================================
   ZAID'S SWEET HOUSE
   ADMIN DASHBOARD JAVASCRIPT
   FINAL FIREBASE VERSION
   PART 1 / 4
========================================== */


/* ==========================================
   GLOBAL FIREBASE ORDERS
========================================== */

let firebaseOrders = [];


/* ==========================================
   VALID ORDER STATUSES
========================================== */

const VALID_STATUSES = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Delivered",
    "Cancelled"
];


/* ==========================================
   ADMIN ACCESS PROTECTION
========================================== */

(function protectAdminDashboard() {

    if (
        sessionStorage.getItem(
            "adminLoggedIn"
        ) !== "true"
    ) {

        window.location.replace(
            "admin.html"
        );

        return;

    }

})();


/* ==========================================
   ESCAPE HTML
========================================== */

function escapeAdminHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* ==========================================
   STATUS CLASS
========================================== */

function getStatusClass(status) {

    if (
        !VALID_STATUSES.includes(status)
    ) {

        return "status-pending";

    }

    return (
        "status-" +
        status.toLowerCase()
    );

}


/* ==========================================
   ADMIN MESSAGE
========================================== */

function showAdminMessage(
    title,
    message,
    type = "success"
) {

    const old =
        document.getElementById(
            "adminMessage"
        );

    if (old) {
        old.remove();
    }


    const box =
        document.createElement("div");


    box.id =
        "adminMessage";


    box.className =
        "admin-message " + type;


    box.innerHTML = `

        <div class="admin-message-box">

            <div class="admin-message-icon">

                ${
                    type === "success"
                    ? "✅"
                    : type === "warning"
                    ? "⚠️"
                    : "❌"

                }

            </div>


            <div>

                <strong>
                    ${escapeAdminHTML(title)}
                </strong>


                <p>
                    ${escapeAdminHTML(message)}
                </p>

            </div>


            <button
                type="button"
                onclick="closeAdminMessage()"
            >
                ×
            </button>

        </div>

    `;


    document.body.appendChild(box);


    setTimeout(function () {

        closeAdminMessage();

    }, 4000);

}


/* ==========================================
   CLOSE ADMIN MESSAGE
========================================== */

function closeAdminMessage() {

    const box =
        document.getElementById(
            "adminMessage"
        );


    if (!box) {
        return;
    }


    box.remove();

}


/* ==========================================
   FIREBASE READY CHECK
========================================== */

function waitForFirebase(
    callback,
    attempts = 0
) {

    const ready =
        window.firebaseDB &&
        typeof window.firebaseGetOrders ===
            "function" &&
        typeof window.firebaseUpdateDoc ===
            "function" &&
        typeof window.firebaseDeleteDoc ===
            "function" &&
        typeof window.firebaseDoc ===
            "function";


    if (ready) {

        callback();

        return;

    }


    if (attempts >= 100) {

        console.error(
            "Firebase initialization timeout."
        );


        showAdminMessage(
            "Firebase Error",
            "Firebase connection could not be initialized.",
            "error"
        );


        return;

    }


    setTimeout(
        function () {

            waitForFirebase(
                callback,
                attempts + 1
            );

        },
        100
    );

}


/* ==========================================
   GET CURRENT FIREBASE ORDERS
========================================== */

function getOrders() {

    return firebaseOrders;

}


/* ==========================================
   FIND ORDER
========================================== */

function findOrder(orderId) {

    return firebaseOrders.find(
        function (order) {

            return String(
                order.orderId || ""
            ) === String(orderId);

        }
    );

}


/* ==========================================
   NORMALIZE FIREBASE ORDER
========================================== */

function normalizeOrder(
    docSnapshot
) {

    const data =
        docSnapshot.data();


    return {

        ...data,

        firestoreId:
            docSnapshot.id,

        status:
            data.status || "Pending"

    };

}


/* ==========================================
   LOAD ORDERS FROM FIREBASE
========================================== */

async function loadAdminOrders() {

    try {

        const ordersList =
            document.getElementById(
                "ordersList"
            );


        if (ordersList) {

            ordersList.innerHTML = `

                <div class="no-orders">

                    <h3>
                        ⏳ All orders loading...
                    </h3>

                    <p>
                        Please wait...
                    </p>

                </div>

            `;

        }


        
        const snapshot =
            await window.firebaseGetOrders();


        firebaseOrders = [];


        snapshot.forEach(
            function (docSnapshot) {

                firebaseOrders.push(
                    normalizeOrder(
                        docSnapshot
                    )
                );

            }
        );


        console.log(
            "Firebase orders loaded:",
            firebaseOrders.length
        );


        updateStatistics(
            firebaseOrders
        );


        displayAdminOrders(
            firebaseOrders
        );


    } catch (error) {

        console.error(
            "Firebase order loading error:",
            error
        );


        const ordersList =
            document.getElementById(
                "ordersList"
            );


        if (ordersList) {

            ordersList.innerHTML = `

                <div class="no-orders">

                    <h3>
                        ❌ Orders could not be loaded
                    </h3>

                    <p>
                        Please refresh the dashboard.
                    </p>

                </div>

            `;

        }


        showAdminMessage(
            "Orders Loading Failed",
            error.message ||
            "Could not load orders from Firebase.",
            "error"
        );

    }

}


/* ==========================================
   STATISTICS
========================================== */

function updateStatistics(
    orders
) {

    let sales = 0;

    let pending = 0;

    let completed = 0;


    orders.forEach(
        function (order) {

            sales += Number(
                order.grandTotal || 0
            );


            const status =
                order.status ||
                "Pending";


            if (
                status === "Pending"
            ) {

                pending++;

            }


            if (
                status === "Delivered"
            ) {

                completed++;

            }

        }
    );


    const totalOrders =
        document.getElementById(
            "totalOrders"
        );


    const totalSales =
        document.getElementById(
            "totalSales"
        );


    const pendingOrders =
        document.getElementById(
            "pendingOrders"
        );


    const completedOrders =
        document.getElementById(
            "completedOrders"
        );


    if (totalOrders) {

        totalOrders.innerText =
            orders.length;

    }


    if (totalSales) {

        totalSales.innerText =
            sales.toLocaleString(
                "en-IN"
            );

    }


    if (pendingOrders) {

        pendingOrders.innerText =
            pending;

    }


    if (completedOrders) {

        completedOrders.innerText =
            completed;

    }

}


/* ==========================================
   DISPLAY ADMIN ORDERS
========================================== */

function displayAdminOrders(
    orders
) {

    const ordersList =
        document.getElementById(
            "ordersList"
        );


    if (!ordersList) {
        return;
    }


    if (
        !Array.isArray(orders) ||
        orders.length === 0
    ) {

        ordersList.innerHTML = `

            <div class="no-orders">

                <h3>
                    📭 No orders available
                </h3>

                <p>
                    Customer orders will appear here.
                </p>

            </div>

        `;

        return;

    }


    ordersList.innerHTML = "";


    orders.forEach(
        function (order) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "admin-order-card";


            const status =
                order.status ||
                "Pending";


            let itemsHTML = "";


            if (
                Array.isArray(order.items) &&
                order.items.length > 0
            ) {

                itemsHTML =
                    order.items.map(
                        function (item) {

                            const quantity =
                                Number(
                                    item.quantity
                                ) || 0;


                            const price =
                                Number(
                                    item.price
                                ) || 0;


                            const total =
                                quantity *
                                price;


                            return `

                                <div
                                    class="admin-item"
                                >

                                    <span>

                                        ${escapeAdminHTML(
                                            item.name ||
                                            "---"
                                        )}

                                        ${
                                            item.weight
                                            ? ` (${escapeAdminHTML(
                                                item.weight
                                            )})`
                                            : ""
                                        }

                                    </span>


                                    <span>
                                        × ${quantity}
                                    </span>


                                    <span>
                                        ₹${total.toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>

                                </div>

                            `;

                        }
                    ).join("");

            } else {

                itemsHTML = `

                    <p>
                        No item details available.
                    </p>

                `;

            }


            const orderId =
                String(
                    order.orderId || ""
                );


            const safeOrderId =
                escapeAdminHTML(
                    orderId || "---"
                );


            card.innerHTML = `

                <div class="order-card-header">

                    <div>

                        <h3>
                            🧾 ${safeOrderId}
                        </h3>


                        <p>
                            ${escapeAdminHTML(
                                order.date || ""
                            )}
                        </p>

                    </div>


                    <strong>

                        ₹${Number(
                            order.grandTotal || 0
                        ).toLocaleString(
                            "en-IN"
                        )}

                    </strong>

                </div>


                <hr>


                <div
                    class="admin-customer-details"
                >

                    <h4>
                        👤 Customer Details
                    </h4>


                    <p>

                        <strong>
                            Name:
                        </strong>

                        ${escapeAdminHTML(
                            order.customerName ||
                            "---"
                        )}

                    </p>


                    <p>

                        <strong>
                            📞 Phone:
                        </strong>

                        ${escapeAdminHTML(
                            order.customerPhone ||
                            "---"
                        )}

                    </p>


                    <p>

                        <strong>
                            📍 Address:
                        </strong>

                        ${escapeAdminHTML(
                            order.customerAddress ||
                            "---"
                        )}

                    </p>


                    <p>

                        <strong>
                            💳 Payment:
                        </strong>

                        ${escapeAdminHTML(
                            order.paymentMethod ||
                            "---"
                        )}

                    </p>

                </div>


                <div
                    class="admin-order-items"
                >

                    <h4>
                        🛒 Order Items
                    </h4>

                    ${itemsHTML}

                </div>


                <p
                    class="order-status-row"
                >

                    <strong>
                        Status:
                    </strong>


                    <span
                        class="order-status ${getStatusClass(
                            status
                        )}"
                    >

                        ${escapeAdminHTML(
                            status
                        )}

                    </span>

                </p>


                <div
                    class="order-actions"
                >

                    <button
                        type="button"
                        onclick="updateOrderStatus(
                            '${escapeAdminHTML(orderId)}',
                            'Confirmed'
                        )"
                    >
                        ✅ Confirm
                    </button>


                    <button
                        type="button"
                        onclick="updateOrderStatus(
                            '${escapeAdminHTML(orderId)}',
                            'Preparing'
                        )"
                    >
                        🍳 Preparing
                    </button>


                    <button
                        type="button"
                        onclick="updateOrderStatus(
                            '${escapeAdminHTML(orderId)}',
                            'Delivered'
                        )"
                    >
                        🚚 Delivered
                    </button>


                    <button
                        type="button"
                        onclick="updateOrderStatus(
                            '${escapeAdminHTML(orderId)}',
                            'Cancelled'
                        )"
                    >
                        ❌ Cancel
                    </button>


                    <button
                        type="button"
                        onclick="deleteOrder(
                            '${escapeAdminHTML(orderId)}'
                        )"
                    >
                        🗑️ Delete
                    </button>


                    <button
                        type="button"
                        onclick="viewAdminBill(
                            '${escapeAdminHTML(orderId)}'
                        )"
                    >
                        🧾 View Bill
                    </button>

                </div>

            `;


            ordersList.appendChild(
                card
            );

        }
    );

}

/* ==========================================
   SEARCH + FILTER ORDERS
========================================== */

function filterAdminOrders() {

    const searchInput =
        document.getElementById(
            "adminOrderSearch"
        );


    const statusFilter =
        document.getElementById(
            "adminStatusFilter"
        );


    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "all";


    const filtered =
        firebaseOrders.filter(
            function (order) {

                const orderId =
                    String(
                        order.orderId || ""
                    ).toLowerCase();


                const customer =
                    String(
                        order.customerName || ""
                    ).toLowerCase();


                const phone =
                    String(
                        order.customerPhone || ""
                    ).toLowerCase();


                const status =
                    String(
                        order.status ||
                        "Pending"
                    );


                const searchMatch =
                    search === "" ||
                    orderId.includes(search) ||
                    customer.includes(search) ||
                    phone.includes(search);


                const statusMatch =
                    selectedStatus === "all" ||
                    status === selectedStatus;


                return (
                    searchMatch &&
                    statusMatch
                );

            }
        );


    displayAdminOrders(
        filtered
    );

}


/* ==========================================
   UPDATE ORDER STATUS - FIREBASE
========================================== */

async function updateOrderStatus(orderId, newStatus) {

    console.log(
        "Updating order:",
        orderId,
        "to:",
        newStatus
    );

    try {

        /* ------------------------------------------
           CHECK FIREBASE CONNECTION
        ------------------------------------------ */

        if (!window.firebaseDB) {

            throw new Error(
                "Firebase database is not connected."
            );

        }


        if (
            typeof window.firebaseUpdateDoc !==
            "function"
        ) {

            throw new Error(
                "Firebase update function is missing."
            );

        }


        if (
            typeof window.firebaseDoc !==
            "function"
        ) {

            throw new Error(
                "Firebase document function is missing."
            );

        }


        /* ------------------------------------------
           VALID STATUS CHECK
        ------------------------------------------ */

        if (
            !VALID_STATUSES.includes(newStatus)
        ) {

            throw new Error(
                "Invalid order status."
            );

        }


        /* ------------------------------------------
           FIND ORDER IN CURRENT FIREBASE DATA
        ------------------------------------------ */

        const order =
            firebaseOrders.find(
                function (item) {

                    return String(
                        item.orderId || ""
                    ) === String(orderId);

                }
            );


        if (!order) {

            throw new Error(
                "Order not found in the dashboard."
            );

        }


        /* ------------------------------------------
           FIRESTORE DOCUMENT ID
        ------------------------------------------ */

        const firestoreId =
            order.firestoreId;


        if (!firestoreId) {

            throw new Error(
                "Firestore document ID is missing."
            );

        }


        console.log(
            "Firestore document:",
            firestoreId
        );


        /* ------------------------------------------
           UPDATE FIRESTORE
        ------------------------------------------ */

        await window.firebaseUpdateDoc(

            window.firebaseDoc(
                window.firebaseDB,
                "orders",
                firestoreId
            ),

            {
                status: newStatus
            }

        );


        /* ------------------------------------------
           UPDATE LOCAL DASHBOARD DATA
        ------------------------------------------ */

        order.status =
            newStatus;


        /* ------------------------------------------
           UPDATE STATISTICS
        ------------------------------------------ */

        updateStatistics(
            firebaseOrders
        );


        /* ------------------------------------------
           REFRESH DISPLAY
        ------------------------------------------ */

        displayAdminOrders(
            firebaseOrders
        );


        /* ------------------------------------------
           SUCCESS MESSAGE
        ------------------------------------------ */

        showAdminMessage(
            "Status Updated",
            "Order " +
                orderId +
                " is now " +
                newStatus +
                ".",
            "success"
        );


        console.log(
            "Order status successfully updated:",
            orderId,
            newStatus
        );


    } catch (error) {

        console.error(
            "Firebase status update error:",
            error
        );


        showAdminMessage(
            "Update Failed",
            error.message ||
                "Could not update order status.",
            "error"
        );

    }

}
/* ==========================================
   DELETE ORDER
========================================== */

async function deleteOrder(
    orderId
) {

    showConfirmModal(
        "Delete Order?",
        "This order will be permanently removed from Firebase.",
        "Delete Order",
        async function () {

            try {

                /* ------------------------------
                   CHECK FIREBASE
                ------------------------------ */

                if (
                    !window.firebaseDB ||
                    typeof window.firebaseDeleteDoc !==
                        "function" ||
                    typeof window.firebaseDoc !==
                        "function"
                ) {

                    throw new Error(
                        "Firebase delete functions are missing."
                    );

                }


                /* ------------------------------
                   FIND ORDER
                ------------------------------ */

                const order =
                    firebaseOrders.find(
                        function (item) {

                            return String(
                                item.orderId || ""
                            ) === String(
                                orderId
                            );

                        }
                    );


                if (!order) {

                    throw new Error(
                        "Order not found."
                    );

                }


                /* ------------------------------
                   FIRESTORE DOCUMENT ID
                ------------------------------ */

                if (
                    !order.firestoreId
                ) {

                    throw new Error(
                        "Firestore document ID is missing."
                    );

                }


                /* ------------------------------
                   DELETE FROM FIRESTORE
                ------------------------------ */

                const orderRef =
                    window.firebaseDoc(
                        window.firebaseDB,
                        "orders",
                        order.firestoreId
                    );


                await window.firebaseDeleteDoc(
                    orderRef
                );


                /* ------------------------------
                   REMOVE FROM DASHBOARD ARRAY
                ------------------------------ */

                firebaseOrders =
                    firebaseOrders.filter(
                        function (item) {

                            return String(
                                item.orderId || ""
                            ) !== String(
                                orderId
                            );

                        }
                    );


                /* ------------------------------
                   REFRESH
                ------------------------------ */

                updateStatistics(
                    firebaseOrders
                );


                filterAdminOrders();


                showAdminMessage(
                    "Order Deleted",
                    `Order ${orderId} has been permanently deleted.`,
                    "success"
                );


                console.log(
                    "Order deleted from Firestore:",
                    orderId
                );


            } catch (error) {

                console.error(
                    "Firestore delete error:",
                    error
                );


                showAdminMessage(
                    "Delete Failed",
                    error.message ||
                    "Could not delete the order.",
                    "error"
                );

            }

        }
    );

}


/* ==========================================
   CLEAR ALL ORDERS
========================================== */

async function clearAllOrders() {

    if (
        !Array.isArray(firebaseOrders) ||
        firebaseOrders.length === 0
    ) {

        showAdminMessage(
            "No Orders",
            "There are no orders to clear.",
            "warning"
        );

        return;

    }


    showConfirmModal(
        "Clear All Orders?",
        "All customer orders will be permanently deleted from Firebase. This action cannot be undone.",
        "Clear All",
        async function () {

            try {

                if (
                    !window.firebaseDB ||
                    typeof window.firebaseDeleteDoc !==
                        "function" ||
                    typeof window.firebaseDoc !==
                        "function"
                ) {

                    throw new Error(
                        "Firebase delete functions are missing."
                    );

                }


                /* DELETE EACH FIRESTORE ORDER */

                for (
                    const order
                    of firebaseOrders
                ) {

                    if (
                        !order.firestoreId
                    ) {

                        console.warn(
                            "Skipping order without Firestore ID:",
                            order.orderId
                        );

                        continue;

                    }


                    const orderRef =
                        window.firebaseDoc(
                            window.firebaseDB,
                            "orders",
                            order.firestoreId
                        );


                    await window.firebaseDeleteDoc(
                        orderRef
                    );

                }


                /* CLEAR DASHBOARD ARRAY */

                firebaseOrders = [];


                /* REFRESH SCREEN */

                updateStatistics(
                    firebaseOrders
                );


                displayAdminOrders(
                    firebaseOrders
                );


                showAdminMessage(
                    "Orders Cleared",
                    "All customer orders have been removed from Firebase.",
                    "success"
                );


                console.log(
                    "All Firebase orders deleted."
                );


            } catch (error) {

                console.error(
                    "Clear orders error:",
                    error
                );


                showAdminMessage(
                    "Clear Failed",
                    error.message ||
                    "Could not clear all orders.",
                    "error"
                );

            }

        }
    );

}


/* ==========================================
   PART 2 END
========================================== */
/* ==========================================
   DELETE ORDER
========================================== */

async function deleteOrder(orderId) {

    try {

        if (!window.firebaseDB) {
            throw new Error("Firebase connection missing.");
        }

        const snapshot =
            await window.firebaseGetOrders();

        let firestoreDocId = null;

        snapshot.forEach(function(docSnapshot) {

            const data = docSnapshot.data();

            if (
                String(data.orderId || "") ===
                String(orderId || "")
            ) {
                firestoreDocId = docSnapshot.id;
            }

        });

        if (!firestoreDocId) {

            showAdminMessage(
                "Order Not Found",
                "This order was not found in Firebase.",
                "warning"
            );

            return;
        }


        await window.firebaseDeleteDoc(
            window.firebaseDoc(
                window.firebaseDB,
                "orders",
                firestoreDocId
            )
        );


        showAdminMessage(
            "Order Deleted",
            `Order ${orderId} has been deleted successfully.`,
            "success"
        );


        await loadAdminOrders();


    } catch (error) {

        console.error(
            "Firestore delete error:",
            error
        );

        showAdminMessage(
            "Delete Failed",
            "Could not delete the order from Firebase.",
            "error"
        );

    }

}


/* ==========================================
   CLEAR ALL ORDERS
========================================== */

async function clearAllOrders() {

    try {

        if (!window.firebaseDB) {
            throw new Error("Firebase connection missing.");
        }

        const snapshot =
            await window.firebaseGetOrders();


        if (snapshot.empty) {

            showAdminMessage(
                "No Orders",
                "There are no orders to clear.",
                "warning"
            );

            return;
        }


        showConfirmModal(
            "Clear All Orders?",
            "All customer orders will be permanently deleted from Firebase.",
            "Clear All",
            async function() {

                try {

                    const deletePromises = [];


                    snapshot.forEach(
                        function(docSnapshot) {

                            deletePromises.push(
                                window.firebaseDeleteDoc(
                                    window.firebaseDoc(
                                        window.firebaseDB,
                                        "orders",
                                        docSnapshot.id
                                    )
                                )
                            );

                        }
                    );


                    await Promise.all(
                        deletePromises
                    );


                    showAdminMessage(
                        "Orders Cleared",
                        "All customer orders have been deleted.",
                        "success"
                    );


                    await loadAdminOrders();


                } catch (error) {

                    console.error(
                        "Clear orders error:",
                        error
                    );

                    showAdminMessage(
                        "Clear Failed",
                        "Could not delete all orders.",
                        "error"
                    );

                }

            }
        );


    } catch (error) {

        console.error(
            "Clear orders Firebase error:",
            error
        );

        showAdminMessage(
            "Error",
            "Could not access Firebase orders.",
            "error"
        );

    }

}


/* ==========================================
   CONFIRM MODAL
========================================== */

function showConfirmModal(
    title,
    message,
    confirmText,
    onConfirm
) {

    const oldModal =
        document.getElementById(
            "adminConfirmModal"
        );

    if (oldModal) {
        oldModal.remove();
    }


    const modal =
        document.createElement("div");

    modal.id =
        "adminConfirmModal";

    modal.className =
        "admin-confirm-overlay";


    modal.innerHTML = `

        <div class="admin-confirm-box">

            <div class="admin-confirm-icon">
                ⚠️
            </div>

            <h3>
                ${escapeAdminHTML(title)}
            </h3>

            <p>
                ${escapeAdminHTML(message)}
            </p>

            <div class="admin-confirm-actions">

                <button
                    type="button"
                    class="admin-confirm-cancel"
                    id="cancelAdminAction"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    class="admin-confirm-delete"
                    id="confirmAdminAction"
                >
                    ${escapeAdminHTML(confirmText)}
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    const cancelButton =
        document.getElementById(
            "cancelAdminAction"
        );

    const confirmButton =
        document.getElementById(
            "confirmAdminAction"
        );


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeConfirmModal
        );

    }


    if (confirmButton) {

        confirmButton.addEventListener(
            "click",
            async function() {

                closeConfirmModal();

                await onConfirm();

            }
        );

    }


    requestAnimationFrame(function() {

        modal.classList.add("show");

    });

}


/* ==========================================
   CLOSE CONFIRM MODAL
========================================== */

function closeConfirmModal() {

    const modal =
        document.getElementById(
            "adminConfirmModal"
        );

    if (!modal) {
        return;
    }


    modal.classList.remove("show");


    setTimeout(function() {

        if (modal) {
            modal.remove();
        }

    }, 200);

}
/* ==========================================
   DELETE ORDER
========================================== */

async function deleteOrder(orderId) {

    try {

        const db = window.firebaseDB;

        if (!db) {
            throw new Error("Firebase is not connected.");
        }

        const snapshot =
            await window.firebaseGetOrders();

        let firestoreDocId = null;

        snapshot.forEach(function (docSnapshot) {

            const data = docSnapshot.data();

            if (
                String(data.orderId) ===
                String(orderId)
            ) {
                firestoreDocId = docSnapshot.id;
            }

        });

        if (!firestoreDocId) {

            showAdminMessage(
                "Order Not Found",
                "This order was not found in Firebase.",
                "warning"
            );

            return;
        }


        showConfirmModal(
            "Delete Order?",
            "This order will be permanently deleted.",
            "Delete Order",
            async function () {

                try {

                    await window.firebaseDeleteDoc(
                        window.firebaseDoc(
                            db,
                            "orders",
                            firestoreDocId
                        )
                    );


                    showAdminMessage(
                        "Order Deleted",
                        `Order ${orderId} has been deleted.`,
                        "success"
                    );


                    await loadAdminOrders();

                } catch (error) {

                    console.error(
                        "Firestore delete error:",
                        error
                    );

                    showAdminMessage(
                        "Delete Failed",
                        "Could not delete the order from Firebase.",
                        "error"
                    );

                }

            }
        );

    } catch (error) {

        console.error(
            "Delete order error:",
            error
        );

        showAdminMessage(
            "Delete Failed",
            "Could not process the delete request.",
            "error"
        );

    }

}


/* ==========================================
   CLEAR ALL ORDERS
========================================== */

async function clearAllOrders() {

    try {

        const db = window.firebaseDB;

        if (!db) {
            throw new Error("Firebase is not connected.");
        }


        const snapshot =
            await window.firebaseGetOrders();


        if (snapshot.empty) {

            showAdminMessage(
                "No Orders",
                "There are no orders to clear.",
                "warning"
            );

            return;
        }


        showConfirmModal(
            "Clear All Orders?",
            "All customer orders will be permanently deleted from Firebase.",
            "Clear All",
            async function () {

                try {

                    const deletePromises = [];

                    snapshot.forEach(
                        function (docSnapshot) {

                            deletePromises.push(
                                window.firebaseDeleteDoc(
                                    window.firebaseDoc(
                                        db,
                                        "orders",
                                        docSnapshot.id
                                    )
                                )
                            );

                        }
                    );


                    await Promise.all(
                        deletePromises
                    );


                    showAdminMessage(
                        "Orders Cleared",
                        "All customer orders have been deleted.",
                        "success"
                    );


                    await loadAdminOrders();

                } catch (error) {

                    console.error(
                        "Clear orders error:",
                        error
                    );

                    showAdminMessage(
                        "Clear Failed",
                        "Could not delete all orders from Firebase.",
                        "error"
                    );

                }

            }
        );

    } catch (error) {

        console.error(
            "Clear all orders error:",
            error
        );

        showAdminMessage(
            "Error",
            "Could not access Firebase orders.",
            "error"
        );

    }

}


/* ==========================================
   CONFIRM MODAL
========================================== */

function showConfirmModal(
    title,
    message,
    confirmText,
    onConfirm
) {

    const oldModal =
        document.getElementById(
            "adminConfirmModal"
        );

    if (oldModal) {
        oldModal.remove();
    }


    const modal =
        document.createElement("div");

    modal.id =
        "adminConfirmModal";

    modal.className =
        "admin-confirm-overlay";


    modal.innerHTML = `

        <div class="admin-confirm-box">

            <div class="admin-confirm-icon">
                ⚠️
            </div>

            <h3>
                ${escapeAdminHTML(title)}
            </h3>

            <p>
                ${escapeAdminHTML(message)}
            </p>

            <div class="admin-confirm-actions">

                <button
                    type="button"
                    class="admin-confirm-cancel"
                    id="cancelAdminAction"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    class="admin-confirm-delete"
                    id="confirmAdminAction"
                >
                    ${escapeAdminHTML(confirmText)}
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    const cancelButton =
        document.getElementById(
            "cancelAdminAction"
        );

    const confirmButton =
        document.getElementById(
            "confirmAdminAction"
        );


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            function () {

                closeConfirmModal();

            }
        );

    }


    if (confirmButton) {

        confirmButton.addEventListener(
            "click",
            async function () {

                closeConfirmModal();

                await onConfirm();

            }
        );

    }


    requestAnimationFrame(
        function () {

            modal.classList.add("show");

        }
    );

}


/* ==========================================
   CLOSE CONFIRM MODAL
========================================== */

function closeConfirmModal() {

    const modal =
        document.getElementById(
            "adminConfirmModal"
        );

    if (!modal) {
        return;
    }


    modal.classList.remove("show");


    setTimeout(
        function () {

            if (modal) {
                modal.remove();
            }

        },
        200
    );

}
/* ==========================================
   VIEW ADMIN BILL
========================================== */

async function viewAdminBill(orderId) {

    try {

        const snapshot =
            await window.firebaseGetOrders();

        let order = null;

        snapshot.forEach(function (docSnapshot) {

            const data =
                docSnapshot.data();

            if (
                String(data.orderId) ===
                String(orderId)
            ) {

                order = data;

            }

        });


        if (!order) {

            showAdminMessage(
                "Order Not Found",
                "The selected order was not found in Firebase.",
                "warning"
            );

            return;

        }


        let itemsHTML = "";


        if (
            Array.isArray(order.items) &&
            order.items.length > 0
        ) {

            itemsHTML =
                order.items.map(
                    function (item) {

                        const quantity =
                            Number(
                                item.quantity
                            ) || 0;

                        const price =
                            Number(
                                item.price
                            ) || 0;

                        const total =
                            quantity * price;


                        return `

                            <tr>

                                <td>
                                    ${escapeAdminHTML(
                                        item.name || "---"
                                    )}

                                    ${
                                        item.weight
                                        ? ` (${escapeAdminHTML(
                                            item.weight
                                        )})`
                                        : ""
                                    }

                                </td>

                                <td>
                                    ${quantity}
                                </td>

                                <td>
                                    ₹${price.toLocaleString(
                                        "en-IN"
                                    )}
                                </td>

                                <td>
                                    ₹${total.toLocaleString(
                                        "en-IN"
                                    )}
                                </td>

                            </tr>

                        `;

                    }
                ).join("");

        } else {

            itemsHTML = `

                <tr>

                    <td colspan="4">
                        No item details available.
                    </td>

                </tr>

            `;

        }


        const billWindow =
            window.open(
                "",
                "_blank",
                "width=850,height=900"
            );


        if (!billWindow) {

            showAdminMessage(
                "Popup Blocked",
                "Please allow pop-ups to view the bill.",
                "warning"
            );

            return;

        }


        billWindow.document.write(`

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>
    Customer Bill -
    ${escapeAdminHTML(
        order.orderId || "---"
    )}
</title>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

<style>

* {
    box-sizing: border-box;
}

body {

    margin: 0;

    padding: 20px;

    background: #f5f3f1;

    font-family:
        Arial,
        Helvetica,
        sans-serif;

    color: #222;

}

.bill {

    width: 100%;

    max-width: 760px;

    margin: auto;

    background: #fff;

    padding: 30px;

    border-radius: 12px;

    box-shadow:
        0 5px 25px
        rgba(0,0,0,0.10);

}

.bill-header {

    text-align: center;

    border-bottom:
        2px solid #7b2d26;

    padding-bottom: 18px;

    margin-bottom: 20px;

}

.bill-header h1 {

    margin: 0;

    color: #7b2d26;

    font-size: 28px;

}

.bill-header p {

    margin: 6px 0 0;

    color: #666;

}

.details {

    display: grid;

    grid-template-columns:
        1fr 1fr;

    gap: 10px 25px;

    margin-bottom: 25px;

    line-height: 1.6;

}

.details div {

    word-break: break-word;

}

table {

    width: 100%;

    border-collapse: collapse;

    margin-top: 10px;

}

th,
td {

    border:
        1px solid #ddd;

    padding: 10px;

    text-align: left;

    font-size: 14px;

}

th {

    background: #7b2d26;

    color: #fff;

}

.bill-total {

    margin-top: 22px;

    margin-left: auto;

    width: 300px;

    max-width: 100%;

    line-height: 1.9;

}

.bill-total-row {

    display: flex;

    justify-content: space-between;

    gap: 15px;

    border-bottom:
        1px solid #eee;

}

.grand-total {

    font-size: 20px;

    font-weight: bold;

    color: #7b2d26;

    border-top:
        2px solid #7b2d26;

    margin-top: 8px;

    padding-top: 8px;

}

.bill-actions {

    display: flex;

    justify-content: center;

    gap: 12px;

    margin-top: 30px;

}

.bill-actions button {

    border: none;

    border-radius: 7px;

    padding: 11px 18px;

    cursor: pointer;

    font-weight: 600;

    color: #fff;

}

.download-btn {

    background: #198754;

}

.close-btn {

    background: #6c757d;

}

@media (max-width: 600px) {

    body {
        padding: 8px;
    }

    .bill {
        padding: 14px;
    }

    .bill-header h1 {
        font-size: 21px;
    }

    .details {
        grid-template-columns: 1fr;
    }

    th,
    td {
        padding: 7px 4px;
        font-size: 11px;
        word-break: break-word;
    }

    .bill-total {
        width: 100%;
    }

    .bill-actions {
        flex-direction: column;
    }

    .bill-actions button {
        width: 100%;
    }

}

@media print {

    body {
        background: #fff;
        padding: 0;
    }

    .bill {
        max-width: none;
        box-shadow: none;
    }

    .bill-actions {
        display: none !important;
    }

}

</style>

</head>

<body>

<div class="bill">

    <div class="bill-header">

        <h1>
            🍬 Zaid's Sweet House
        </h1>

        <p>
            Customer Order Bill
        </p>

    </div>


    <div class="details">

        <div>
            <strong>Order ID:</strong>
            ${escapeAdminHTML(
                order.orderId || "---"
            )}
        </div>

        <div>
            <strong>Date:</strong>
            ${escapeAdminHTML(
                order.date || "---"
            )}
        </div>

        <div>
            <strong>Customer:</strong>
            ${escapeAdminHTML(
                order.customerName || "---"
            )}
        </div>

        <div>
            <strong>Phone:</strong>
            ${escapeAdminHTML(
                order.customerPhone || "---"
            )}
        </div>

        <div>
            <strong>Payment:</strong>
            ${escapeAdminHTML(
                order.paymentMethod || "---"
            )}
        </div>

        <div>
            <strong>Status:</strong>
            ${escapeAdminHTML(
                order.status || "Pending"
            )}
        </div>

        <div>
            <strong>Address:</strong>
            ${escapeAdminHTML(
                order.customerAddress || "---"
            )}
        </div>

    </div>


    <table>

        <thead>

            <tr>

                <th>Product</th>

                <th>Qty</th>

                <th>Price</th>

                <th>Total</th>

            </tr>

        </thead>

        <tbody>

            ${itemsHTML}

        </tbody>

    </table>


    <div class="bill-total">

        <div class="bill-total-row">

            <span>Subtotal</span>

            <strong>
                ₹${Number(
                    order.subtotal || 0
                ).toLocaleString("en-IN")}
            </strong>

        </div>


        <div class="bill-total-row">

            <span>Discount</span>

            <strong>
                ₹${Number(
                    order.discount || 0
                ).toLocaleString("en-IN")}
            </strong>

        </div>


        <div class="bill-total-row">

            <span>Delivery</span>

            <strong>
                ₹${Number(
                    order.deliveryCharge || 0
                ).toLocaleString("en-IN")}
            </strong>

        </div>


        <div class="bill-total-row grand-total">

            <span>Grand Total</span>

            <strong>
                ₹${Number(
                    order.grandTotal || 0
                ).toLocaleString("en-IN")}
            </strong>

        </div>

    </div>


    <div class="bill-actions">

        <button
            type="button"
            class="download-btn"
            onclick="downloadBillPDF()"
        >
            📄 Download PDF
        </button>

        <button
            type="button"
            class="close-btn"
            onclick="window.close()"
        >
            ✖ Close
        </button>

    </div>

</div>


<script>

function downloadBillPDF() {

    if (
        !window.jspdf ||
        !window.jspdf.jsPDF
    ) {

        alert(
            "PDF system load nahi hua. Internet connection check karein."
        );

        return;

    }


    const {
        jsPDF
    } = window.jspdf;


    const pdf =
        new jsPDF({
            unit: "mm",
            format: "a4"
        });


    let y = 20;


    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(20);


    pdf.text(
        "Zaid's Sweet House",
        105,
        y,
        {
            align: "center"
        }
    );


    y += 9;


    pdf.setFontSize(12);

    pdf.setFont(
        "helvetica",
        "normal"
    );


    pdf.text(
        "Customer Order Bill",
        105,
        y,
        {
            align: "center"
        }
    );


    y += 10;


    pdf.line(
        15,
        y,
        195,
        y
    );


    y += 10;


    pdf.setFontSize(10);


    const details = [

        [
            "Order ID",
            ${JSON.stringify(
                order.orderId || "---"
            )}
        ],

        [
            "Date",
            ${JSON.stringify(
                order.date || "---"
            )}
        ],

        [
            "Customer",
            ${JSON.stringify(
                order.customerName || "---"
            )}
        ],

        [
            "Phone",
            ${JSON.stringify(
                order.customerPhone || "---"
            )}
        ],

        [
            "Payment",
            ${JSON.stringify(
                order.paymentMethod || "---"
            )}
        ],

        [
            "Status",
            ${JSON.stringify(
                order.status || "Pending"
            )}
        ],

        [
            "Address",
            ${JSON.stringify(
                order.customerAddress || "---"
            )}
        ]

    ];


    details.forEach(
        function(row) {

            const lines =
                pdf.splitTextToSize(
                    row[0] +
                    ": " +
                    String(row[1]),
                    175
                );


            pdf.text(
                lines,
                15,
                y
            );


            y +=
                6 * lines.length;

        }
    );


    y += 5;


    pdf.setFont(
        "helvetica",
        "bold"
    );


    pdf.text(
        "Product",
        15,
        y
    );

    pdf.text(
        "Qty",
        105,
        y
    );

    pdf.text(
        "Price",
        135,
        y
    );

    pdf.text(
        "Total",
        170,
        y
    );


    y += 4;


    pdf.line(
        15,
        y,
        195,
        y
    );


    y += 8;


    pdf.setFont(
        "helvetica",
        "normal"
    );


    const items =
        ${JSON.stringify(
            order.items || []
        )};


    items.forEach(
        function(item) {

            const quantity =
                Number(
                    item.quantity
                ) || 0;

            const price =
                Number(
                    item.price
                ) || 0;

            const total =
                quantity * price;


            let productName =
                String(
                    item.name || "---"
                );


            if (item.weight) {

                productName +=
                    " (" +
                    String(
                        item.weight
                    ) +
                    ")";

            }


            const productLines =
                pdf.splitTextToSize(
                    productName,
                    80
                );


            pdf.text(
                productLines,
                15,
                y
            );


            pdf.text(
                String(quantity),
                105,
                y
            );


            pdf.text(
                "Rs. " +
                price.toLocaleString(
                    "en-IN"
                ),
                135,
                y
            );


            pdf.text(
                "Rs. " +
                total.toLocaleString(
                    "en-IN"
                ),
                170,
                y
            );


            y += Math.max(
                8,
                6 * productLines.length
            );


            if (y > 270) {

                pdf.addPage();

                y = 20;

            }

        }
    );


    y += 8;


    pdf.line(
        110,
        y,
        195,
        y
    );


    y += 8;


    const subtotal =
        Number(
            ${JSON.stringify(
                order.subtotal || 0
            )}
        );


    const discount =
        Number(
            ${JSON.stringify(
                order.discount || 0
            )}
        );


    const delivery =
        Number(
            ${JSON.stringify(
                order.deliveryCharge || 0
            )}
        );


    const grandTotal =
        Number(
            ${JSON.stringify(
                order.grandTotal || 0
            )}
        );


    pdf.text(
        "Subtotal: Rs. " +
        subtotal.toLocaleString(
            "en-IN"
        ),
        120,
        y
    );


    y += 7;


    pdf.text(
        "Discount: Rs. " +
        discount.toLocaleString(
            "en-IN"
        ),
        120,
        y
    );


    y += 7;


    pdf.text(
        "Delivery: Rs. " +
        delivery.toLocaleString(
            "en-IN"
        ),
        120,
        y
    );


    y += 10;


    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(13);


    pdf.text(
        "Grand Total: Rs. " +
        grandTotal.toLocaleString(
            "en-IN"
        ),
        120,
        y
    );


    pdf.save(
        "Zaid-Sweet-House-" +
        ${JSON.stringify(
            order.orderId || "Bill"
        )} +
        ".pdf"
    );

}

</script>

</body>

</html>

        `);


        billWindow.document.close();

    } catch (error) {

        console.error(
            "View bill error:",
            error
        );

        showAdminMessage(
            "Bill Error",
            "Could not load the customer bill.",
            "error"
        );

    }

}


/* ==========================================
   EVENT LISTENERS
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const searchInput =
            document.getElementById(
                "adminOrderSearch"
            );

        if (searchInput) {

            searchInput.addEventListener(
                "input",
                filterAdminOrders
            );

        }


        const statusFilter =
            document.getElementById(
                "adminStatusFilter"
            );

        if (statusFilter) {

            statusFilter.addEventListener(
                "change",
                filterAdminOrders
            );

        }


        const clearButton =
            document.getElementById(
                "clearOrdersBtn"
            );

        if (clearButton) {

            clearButton.addEventListener(
                "click",
                clearAllOrders
            );

        }


        const logoutButton =
            document.getElementById(
                "logoutAdminBtn"
            );

        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                function () {

                    showConfirmModal(
                        "Logout?",
                        "Are you sure you want to logout from the Admin Dashboard?",
                        "Logout",
                        function () {

                            sessionStorage.removeItem(
                                "adminLoggedIn"
                            );

                            sessionStorage.removeItem(
                                "adminLoginTime"
                            );

                            window.location.replace(
                                "admin.html"
                            );

                        }
                    );

                }
            );

        }


    }
);


/* ==========================================
   BACK CACHE PROTECTION
========================================== */

window.addEventListener(
    "pageshow",
    function (event) {

        if (
            event.persisted &&
            sessionStorage.getItem(
                "adminLoggedIn"
            ) !== "true"
        ) {

            window.location.replace(
                "admin.html"
            );

        }

    }
);