// Selecting HTML elements
const productGrid = document.getElementById("productGrid");
const cartButton = document.getElementById("cartButton");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const checkoutBtn = document.getElementById("checkoutBtn");

// Store products and cart items
let products = [];
let cart = [];

// Fetch products from JSON file
async function loadProducts() {
    try {
        const response = await fetch("products.json");

        if (!response.ok) {
            throw new Error("Unable to load products.");
        }

        products = await response.json();

        displayProducts(products);

    } catch (error) {
        productGrid.innerHTML =
            `<p class="no-products">
                Failed to load products. Please run this project
                using a local server.
            </p>`;

        console.error(error);
    }
}

// Display products dynamically
function displayProducts(productList) {

    productGrid.innerHTML = "";

    if (productList.length === 0) {
        productGrid.innerHTML =
            `<p class="no-products">No products found!</p>`;
        return;
    }

    productList.forEach(product => {

        const card = document.createElement("div");
        card.className = "product-card";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";

        const info = document.createElement("div");
        info.className = "product-info";

        const category = document.createElement("span");
        category.className = "product-category";
        category.textContent = product.category;

        const name = document.createElement("h3");
        name.textContent = product.name;

        const rating = document.createElement("div");
        rating.className = "rating";
        rating.textContent =
            "⭐".repeat(Math.round(product.rating)) +
            ` (${product.rating})`;

        const bottom = document.createElement("div");
        bottom.className = "product-bottom";

        const price = document.createElement("span");
        price.className = "price";
        price.textContent =
            "₹" + product.price.toLocaleString("en-IN");

        const button = document.createElement("button");
        button.className = "add-cart";
        button.textContent = "Add to Cart";

        button.addEventListener("click", () => {
            addToCart(product.id);
        });

        bottom.append(price, button);
        info.append(category, name, rating, bottom);
        card.append(image, info);

        productGrid.appendChild(card);
    });
}

// Add product to cart
function addToCart(productId) {

    const existingItem = cart.find(
        item => item.id === productId
    );

    if (existingItem) {
        existingItem.quantity++;
    } else {
        const product = products.find(
            item => item.id === productId
        );

        if (product) {
            cart.push({
                ...product,
                quantity: 1
            });
        }
    }

    updateCart();

}

// Update cart information
function updateCart() {

    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
    }

    cart.forEach(item => {

        total += item.price * item.quantity;
        count += item.quantity;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        const details = document.createElement("div");

        const name = document.createElement("h4");
        name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent =
            `₹${item.price.toLocaleString("en-IN")} × ${item.quantity}`;

        details.append(name, price);

        const removeButton = document.createElement("button");
        removeButton.className = "remove-btn";
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", () => {
            removeFromCart(item.id);
        });

        cartItem.append(details, removeButton);
        cartItems.appendChild(cartItem);
    });

    cartCount.textContent = count;
    cartTotal.textContent = total.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

}

// Remove item from cart
function removeFromCart(productId) {

    const existingItem = cart.find(
        item => item.id === productId
    );

    if (existingItem) {
        existingItem.quantity--;

        if (existingItem.quantity <= 0) {
            cart = cart.filter(
                item => item.id !== productId
            );
        }
    }

    updateCart();
}

// Open shopping cart
cartButton.addEventListener("click", () => {
    cartOverlay.classList.add("active");
});

// Close shopping cart
closeCart.addEventListener("click", () => {
    cartOverlay.classList.remove("active");
});

// Close cart when clicking outside
cartOverlay.addEventListener("click", (event) => {
    if (event.target === cartOverlay) {
        cartOverlay.classList.remove("active");
    }
});

// Search products
function searchProducts() {

    const searchText = searchInput.value
        .trim()
        .toLowerCase();

    const filteredProducts = products.filter(product => {

        return (
            product.name.toLowerCase().includes(searchText) ||
            product.category.toLowerCase().includes(searchText)
        );

    });

    displayProducts(filteredProducts);
}

// Search button
searchBtn.addEventListener("click", searchProducts);

// Search while typing
searchInput.addEventListener("input", searchProducts);

// Checkout button
checkoutBtn.addEventListener("click", () => {

    if (cart.length === 0) {
        alert("Your shopping cart is empty!");
        return;
    }

    alert(
        "Thank you for shopping at ShopZone!\n" +
        "Your total amount is ₹" +
        cartTotal.textContent
    );

    cart = [];
    updateCart();
    cartOverlay.classList.remove("active");

});

// Load products when page opens
loadProducts();

