// --- Data ---
const PRODUCTS = [
    { id: 1, name: "Urban Wireless Headphones", price: 129.99, category: "Electronics", rating: 4.8, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80" },
    { id: 2, name: "Minimalist Smart Watch", price: 199.50, category: "Electronics", rating: 4.6, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80" },
    { id: 3, name: "Premium Leather Jacket", price: 249.00, category: "Fashion", rating: 4.9, image: "https://images.unsplash.com/photo-1551028919-ac6635f0e5c9?w=800&q=80" },
    { id: 4, name: "Pro Running Sneakers", price: 89.95, category: "Sports", rating: 4.7, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80" },
    { id: 5, name: "Designer Sunglasses", price: 159.00, category: "Fashion", rating: 4.5, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80" },
    { id: 6, name: "Modern Coffee Maker", price: 79.99, category: "Home", rating: 4.4, image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80" },
    { id: 7, name: "4K Action Camera", price: 299.99, category: "Electronics", rating: 4.8, image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80" },
    { id: 8, name: "Yoga Mat Essentials", price: 29.99, category: "Sports", rating: 4.3, image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800&q=80" },
    { id: 9, name: "Ceramic Plant Pot", price: 24.50, category: "Home", rating: 4.9, image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80" },
    { id: 10, name: "Classic Denim Jacket", price: 65.00, category: "Fashion", rating: 4.2, image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&q=80" },
    { id: 11, name: "Mechanical Keyboard", price: 110.00, category: "Electronics", rating: 4.7, image: "https://images.unsplash.com/photo-1587829741301-dc798b91a603?w=800&q=80" },
    { id: 12, name: "Travel Backpack", price: 85.00, category: "Fashion", rating: 4.6, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80" },
    { id: 13, name: "Smart Home Assistant", price: 49.99, category: "Electronics", rating: 4.5, image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800&q=80" },
    { id: 14, name: "Dumbbell Set (5kg)", price: 45.00, category: "Sports", rating: 4.8, image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80" },
    { id: 15, name: "Luxury Throw Pillow", price: 35.00, category: "Home", rating: 4.4, image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?w=800&q=80" },
    { id: 16, name: "Perfume Collection", price: 95.00, category: "Fashion", rating: 4.7, image: "https://images.unsplash.com/photo-1594035910387-fea47794261e?w=800&q=80" },
];

const CATEGORIES = ["All", "Electronics", "Fashion", "Home", "Sports"];

// --- State ---
let cart = [];
let activeCategory = "All";
let searchQuery = "";

// --- Core Functions ---

function init() {
    renderCategories();
    renderProducts();
    updateCartUI();

    // Initial Icon Load
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Event Listeners
    document.getElementById('mobile-menu-btn').addEventListener('click', toggleMenu);
    document.getElementById('cart-btn').addEventListener('click', openCart);
    document.getElementById('close-cart-btn').addEventListener('click', closeCart);
    document.getElementById('cart-backdrop').addEventListener('click', closeCart);
    document.getElementById('hero-shop-btn').addEventListener('click', scrollToShop);
    
    const desktopSearch = document.getElementById('search-input-desktop');
    const mobileSearch = document.getElementById('search-input-mobile');

    desktopSearch.addEventListener('input', (e) => handleSearch(e.target.value));
    desktopSearch.addEventListener('focus', () => { if(searchQuery) scrollToShop() });
    
    mobileSearch.addEventListener('input', (e) => handleSearch(e.target.value));
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl flex items-center animate-bounce-in border border-gray-700 mb-2';
    toast.innerHTML = `<i data-lucide="check-circle" class="text-green-400 mr-2 w-5 h-5"></i> <span>${message}</span>`;
    
    container.appendChild(toast);
    if (typeof lucide !== 'undefined') lucide.createIcons({ root: toast });

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function handleSearch(query) {
    searchQuery = query;
    if (query.length === 1) scrollToShop();
    renderProducts();
}

function scrollToShop() {
    const shop = document.getElementById('shop-section');
    shop.scrollIntoView({ behavior: 'smooth' });
}

function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    const btn = document.getElementById('mobile-menu-btn');
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        menu.classList.add('flex');
        btn.innerHTML = '<i data-lucide="x"></i>';
    } else {
        menu.classList.add('hidden');
        menu.classList.remove('flex');
        btn.innerHTML = '<i data-lucide="menu"></i>';
    }
    if (typeof lucide !== 'undefined') lucide.createIcons({ root: btn });
}

// --- Product Logic ---

function filterByCategory(category) {
    activeCategory = category;
    renderCategories();
    renderProducts();
}

function renderCategories() {
    const container = document.getElementById('category-container');
    container.innerHTML = CATEGORIES.map(cat => `
        <button
            onclick="filterByCategory('${cat}')"
            class="px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat 
                ? "bg-blue-600 text-white shadow-md transform scale-105" 
                : "bg-gray-900 text-gray-300 border border-gray-800 hover:bg-gray-800"
            }"
        >
            ${cat}
        </button>
    `).join('');
}

function renderProducts() {
    const container = document.getElementById('product-grid');
    const noResults = document.getElementById('no-results');

    const filtered = PRODUCTS.filter(product => {
        const matchesCategory = activeCategory === "All" || product.category === activeCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        container.innerHTML = '';
        noResults.classList.remove('hidden');
        return;
    }

    noResults.classList.add('hidden');
    container.innerHTML = filtered.map(product => `
        <div class="bg-gray-900 rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-800 overflow-hidden group flex flex-col">
            <div class="relative h-64 overflow-hidden bg-gray-800">
                <img 
                    src="${product.image}" 
                    alt="${product.name}" 
                    onerror="this.src='https://placehold.co/600x400/1f2937/FFF?text=Image+Unavailable'"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div class="absolute top-2 right-2 bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-white flex items-center shadow-sm">
                    <i data-lucide="star" class="text-yellow-400 mr-1 w-3 h-3 fill-current"></i>
                    ${product.rating}
                </div>
                <!-- Quick Add Overlay -->
                <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                        onclick="addToCart(${product.id})"
                        class="bg-white text-gray-900 font-bold py-2 px-6 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-blue-600 hover:text-white"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
            
            <div class="p-5 flex-1 flex flex-col">
                <span class="text-xs font-bold text-blue-400 uppercase tracking-wide mb-1">${product.category}</span>
                <h3 class="font-bold text-lg text-white mb-1 leading-snug">${product.name}</h3>
                <div class="mt-auto flex items-center justify-between">
                    <span class="text-xl font-extrabold text-white">$${product.price.toFixed(2)}</span>
                    <button 
                        onclick="addToCart(${product.id})"
                        class="md:hidden bg-blue-900 text-blue-300 p-2 rounded-full hover:bg-blue-800 transition-colors"
                    >
                        <i data-lucide="plus" class="w-5 h-5"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Re-initialize icons for new DOM elements
    if (typeof lucide !== 'undefined') lucide.createIcons({ root: container });
}

// --- Cart Logic ---

function addToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    updateCartUI();
    openCart();
    showToast(`Added ${product.name} to cart!`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateQty(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        const newQty = item.qty + change;
        if (newQty > 0) {
            item.qty = newQty;
        }
    }
    updateCartUI();
}

function checkout() {
    if (cart.length === 0) return;
    showToast("Processing your order... Thank you!");
    setTimeout(() => {
        cart = [];
        updateCartUI();
        closeCart();
    }, 2000);
}

function openCart() {
    document.getElementById('cart-overlay').classList.remove('hidden');
    document.body.classList.add('overflow-hidden'); // Prevent background scrolling
}

function closeCart() {
    document.getElementById('cart-overlay').classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
}

function updateCartUI() {
    const container = document.getElementById('cart-items-container');
    const emptyMsg = document.getElementById('empty-cart-msg');
    const footer = document.getElementById('cart-footer');
    const badge = document.getElementById('cart-badge');
    const countHeader = document.getElementById('cart-count-header');

    // Update Counts/Totals
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    // Badge
    if (count > 0) {
        badge.textContent = count;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
    countHeader.textContent = `${count} items`;

    // Cart Contents
    if (cart.length === 0) {
        container.innerHTML = '';
        emptyMsg.classList.remove('hidden');
        emptyMsg.classList.add('flex');
        footer.classList.add('hidden');
    } else {
        emptyMsg.classList.add('hidden');
        emptyMsg.classList.remove('flex');
        footer.classList.remove('hidden');

        container.innerHTML = cart.map(item => `
            <div class="flex gap-4 p-4 bg-gray-800 rounded-xl border border-gray-700">
                <img 
                    src="${item.image}" 
                    alt="${item.name}" 
                    class="w-20 h-20 object-cover rounded-lg bg-gray-700"
                    onerror="this.src='https://placehold.co/100x100/374151/FFF?text=IMG'"
                />
                <div class="flex-1 flex flex-col justify-between">
                    <div>
                        <h3 class="font-bold text-white line-clamp-1">${item.name}</h3>
                        <p class="text-sm text-gray-400">${item.category}</p>
                    </div>
                    <div class="flex justify-between items-center mt-2">
                        <div class="flex items-center space-x-2 bg-gray-900 rounded-lg border border-gray-700 px-2 py-1">
                            <button onclick="updateQty(${item.id}, -1)" class="text-gray-500 hover:text-blue-400">
                                <i data-lucide="minus" class="w-3 h-3"></i>
                            </button>
                            <span class="text-sm font-bold w-4 text-center text-white">${item.qty}</span>
                            <button onclick="updateQty(${item.id}, 1)" class="text-gray-500 hover:text-blue-400">
                                <i data-lucide="plus" class="w-3 h-3"></i>
                            </button>
                        </div>
                        <div class="text-right">
                            <p class="font-bold text-white">$${(item.price * item.qty).toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <button onclick="removeFromCart(${item.id})" class="text-gray-500 hover:text-red-500 self-start p-1">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        `).join('');

        // Update Footer Money
        document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('cart-tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
        
        if (typeof lucide !== 'undefined') lucide.createIcons({ root: container });
    }
}

// Initialize after parsing; script is loaded with `defer`
init();
