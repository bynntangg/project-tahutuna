// Deklarasikan variabel carousel di global scope
let currentSlide = 0;
let slides = [];
let totalSlides = 0;
let currentProductId = null;
let cart = JSON.parse(localStorage.getItem('tahuTunaCart')) || [];
let currentProduct = null;

// Fungsi carousel di global scope
function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
    currentSlide = index;
}

function moveSlide(direction) {
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

// DOM Elements
const cartToggle = document.getElementById('cartToggle');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cartItems');
const emptyCart = document.getElementById('emptyCart');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const productQuantity = document.getElementById('productQuantity');
const decreaseQty = document.getElementById('decreaseQty');
const increaseQty = document.getElementById('increaseQty');
const addToCartBtn = document.getElementById('addToCartBtn');

// Save cart to localStorage
function saveCartToStorage() {
    try {
        localStorage.setItem('tahuTunaCart', JSON.stringify(cart));
    } catch (e) {
        console.error('Error menyimpan keranjang ke localStorage:', e);
        showNotification('Gagal menyimpan keranjang. Data mungkin tidak tersimpan.');
    }
}

// Load cart from localStorage
function loadCartFromStorage() {
    try {
        const cartData = localStorage.getItem('tahuTunaCart');
        return cartData ? JSON.parse(cartData) : [];
    } catch (e) {
        console.error('Error memuat keranjang dari localStorage:', e);
        showNotification('Gagal memuat keranjang. Menggunakan keranjang baru.');
        return [];
    }
}

// Initialize cart from storage
cart = loadCartFromStorage();

// Clear cart
function clearCart() {
    cart = [];
    updateCartUI();
}

// Toggle Cart
cartToggle.addEventListener('click', () => {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Close Cart
closeCart.addEventListener('click', closeCartSidebar);
overlay.addEventListener('click', closeCartSidebar);

function closeCartSidebar() {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Quantity Controls
decreaseQty.addEventListener('click', () => {
    let value = parseInt(productQuantity.value);
    if (value > 1) {
        productQuantity.value = value - 1;
    }
});

increaseQty.addEventListener('click', () => {
    let value = parseInt(productQuantity.value);
    if (value < 99) {
        productQuantity.value = value + 1;
    }
});

// Add to Cart
addToCartBtn.addEventListener('click', () => {
    if (currentProduct) {
        const quantity = parseInt(productQuantity.value);
        addToCart(currentProduct, quantity);
        
        // Close modal
        document.getElementById('productModal').style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Show cart sidebar
        cartSidebar.classList.add('active');
        overlay.classList.add('active');
    }
});

// Add item to cart
function addToCart(product, quantity) {
    // Check if product already in cart
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
        // Update quantity if product exists
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new product to cart
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            priceValue: extractPriceValue(product.price),
            image: product.image,
            quantity: quantity
        });
    }
    
    // Update cart UI
    updateCartUI();
    
    // Save to localStorage
    saveCartToStorage();
    
    // Show confirmation message
    showNotification(`${product.name} ditambahkan ke keranjang`);
}

// Extract numeric value from price string
function extractPriceValue(priceString) {
    const numericString = priceString.replace(/[^\d]/g, '');
    return parseInt(numericString);
}

// Update cart UI
function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartItems.innerHTML = '';
        cartItems.appendChild(emptyCart);
        checkoutBtn.disabled = true;
    } else {
        emptyCart.style.display = 'none';
        cartItems.innerHTML = '';
        
        cart.forEach((item, index) => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price}</div>
                    <div class="cart-item-quantity">
                        <div class="quantity-update">
                            <button class="quantity-update-btn decrease" data-index="${index}">-</button>
                            <input type="number" class="quantity-update-input" value="${item.quantity}" min="1" data-index="${index}">
                            <button class="quantity-update-btn increase" data-index="${index}">+</button>
                        </div>
                        <button class="remove-item" data-index="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItemElement);
        });
        
        checkoutBtn.disabled = false;
    }
    
    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.priceValue * item.quantity), 0);
    cartTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    
    // Add event listeners to dynamically created elements
    attachCartItemEvents();
    
    // Save to localStorage
    saveCartToStorage();
}

// Attach events to cart items
function attachCartItemEvents() {
    // Decrease quantity buttons
    document.querySelectorAll('.quantity-update-btn.decrease').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
                updateCartUI();
                saveCartToStorage();
            }
        });
    });
    
    // Increase quantity buttons
    document.querySelectorAll('.quantity-update-btn.increase').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            if (cart[index].quantity < 99) {
                cart[index].quantity++;
                updateCartUI();
                saveCartToStorage();
            }
        });
    });
    
    // Quantity input changes
    document.querySelectorAll('.quantity-update-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const index = parseInt(e.target.dataset.index);
            let newQuantity = parseInt(e.target.value);
            
            if (isNaN(newQuantity) || newQuantity < 1) {
                newQuantity = 1;
            } else if (newQuantity > 99) {
                newQuantity = 99;
            }
            
            cart[index].quantity = newQuantity;
            updateCartUI();
            saveCartToStorage();
        });
    });
    
    // Remove item buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.closest('.remove-item').dataset.index);
            const removedItem = cart[index].name;
            cart.splice(index, 1);
            updateCartUI();
            saveCartToStorage();
            showNotification(`${removedItem} dihapus dari keranjang`);
        });
    });
}

// Checkout via WhatsApp
checkoutBtn.addEventListener('click', () => {
    if (cart.length > 0) {
        sendOrderViaWhatsApp();
    }
});

// Send order via WhatsApp
function sendOrderViaWhatsApp() {
    let message = "Halo Tahu Tuna Pak Ran, saya ingin memesan:\n\n";
    
    cart.forEach(item => {
        message += `- ${item.name} (${item.quantity} pack) : ${formatPrice(item.priceValue * item.quantity)}\n`;
    });
    
    message += `\nTotal: ${formatPrice(cart.reduce((sum, item) => sum + (item.priceValue * item.quantity), 0))}`;
    message += "\n\nMohon info untuk pembayaran dan pengiriman. Terima kasih.";
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/6281234567890?text=${encodedMessage}`, '_blank');
    
    // Clear cart after order
    cart = [];
    updateCartUI();
    saveCartToStorage();
    closeCartSidebar();
    
    showNotification("Pesanan dikirim via WhatsApp");
}

// Format price to Indonesian format
function formatPrice(price) {
    return `Rp ${price.toLocaleString('id-ID')}`;
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('.notification-styles')) {
        const styles = document.createElement('style');
        styles.className = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                bottom: 100px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 12px 20px;
                border-radius: 5px;
                z-index: 2000;
                animation: fadeInOut 3s ease;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
            }
            
            .notification-content i {
                margin-right: 10px;
                color: #4CAF50;
            }
            
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, 20px); }
                10% { opacity: 1; transform: translate(-50%, 0); }
                90% { opacity: 1; transform: translate(-50%, 0); }
                100% { opacity: 0; transform: translate(-50%, 20px); }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after animation completes
    setTimeout(() => {
        notification.remove();
    }, 2800);
}

// Update openModal function to set current product
function openModal(productId) {
   const products = [
        {
            id: 1,
            name: "Tahu Tuna Original",
            price: "Rp 9.000 / pack",
            description: "Perpaduan sempurna antara tahu dan daging tuna segar dengan bumbu rahasia keluarga. Setiap pack berisi 10 biji tahu tuna siap masak. Bisa digoreng, dikukus, atau dibakar sesuai selera. Tahan hingga 1 bulan dalam freezer.",
            image: "images/1.jpg"
        },
        {
            id: 2,
            name: "Tahu Tuna Spesial",
            price: "Rp 12.000 / pack",
            description: "Varian premium dengan kandungan tuna lebih banyak (70% tuna). Tekstur lebih lembut dan rasa lebih gurih. Pack 10 biji. Cocok untuk hidangan spesial keluarga atau sajian saat acara penting. Tahan hingga 6 minggu dalam freezer.",
            image: "images/2.jpg"
        },
        {
            id: 3,
            name: "Risoles Jagung",
            price: "Rp 28.000 / pack",
            description: "Risoles dengan isian jagung manis dan bumbu spesial. Pack 10 biji. Crispy di luar, lembut di dalam. Cocok untuk camilan atau bekal sekolah anak. Bisa langsung digoreng dari freezer. Tahan hingga 3 minggu dalam freezer.",
            image: "images/3.jpg"
        },
        {
            id: 4,
            name: "Risoles Tuna",
            price: "Rp 30.000 / pack",
            description: "Risoles dengan isian tuna gurih dan sayuran. Pack 10 biji. Tekstur lembut dengan rasa tuna yang dominan. Praktis untuk camilan sehat keluarga. Tahan hingga 1 bulan dalam freezer.",
            image: "images/4.jpg"
        },
        {
            id: 5,
            name: "Otak-otak Tuna",
            price: "Rp 30.000 / pack",
            description: "Otak-otak dengan isian tuna gurih dibungkus daun pisang. Pack 10 biji. Bisa digoreng atau dibakar. Rasa yang autentik dengan aroma daun pisang yang khas. Tahan hingga 1 bulan dalam freezer.",
            image: "images/5.jpg"
        },
        {
            id: 6,
            name: "Otak-otak Udang",
            price: "Rp 35.000 / pack",
            description: "Otak-otak dengan isian udang segar dan bumbu rempah. Pack 10 biji. Dibungkus daun pisang untuk aroma yang sedap. Cocok untuk lauk atau camilan. Tahan hingga 1 bulan dalam freezer.",
            image: "images/6.jpg"
        },
        {
            id: 7,
            name: "Martabak Tuna",
            price: "Rp 32.000 / pack",
            description: "Martabak mini dengan isian tuna dan telur. Pack 10 biji. Kulit renyah dengan isian yang gurih. Praktis untuk sarapan atau camilan. Tahan hingga 3 minggu dalam freezer.",
            image: "images/7.jpg"
        },
        {
            id: 8,
            name: "Lumpia Tuna",
            price: "Rp 30.000 / pack",
             description: "Lumpia dengan isian tuna dan sayuran. Pack 10 biji. Kulit tipis dan renyah dengan isian yang lembut. Cocok untuk segala acara. Tahan hingga 1 bulan dalam freezer.",
            image: "images/8.jpg"
        },
        {
            id: 9,
            name: "Kaki Naga",
            price: "Rp 40.000 / pack",
            description: "Olahan tuna dengan kulit tahu yang krispi. Pack 10 biji. Tekstur luar renyah dalam lembut. Disukai oleh anak-anak dan dewasa. Tahan hingga 1 bulan dalam freezer.",
            image: "images/9.jpg"
        },
        {
            id: 10,
            name: "Pangsit Tuna",
            price: "Rp 35.000 / pack",
            description: "Pangsit dengan isian tuna dan bumbu spesial. Pack 20 biji. Bisa digoreng atau direbus untuk sup. Praktis dan lezat. Tahan hingga 2 bulan dalam freezer.",
            image: "images/10.jpg"
        },
        {
            id: 11,
            name: "Bakso Tuna",
            price: "Rp 45.000 / pack",
            description: "Bakso ikan tuna dengan tekstur kenyal dan rasa gurih alami. Pack 500gr (isi 20-25 biji). Cocok untuk sup atau bakso kuah. Bisa langsung dimasak dari freezer. Tahan hingga 2 bulan dalam freezer.",
            image: "images/11.jpg"
        },
        {
            id: 12,
            name: "Sosis Tuna",
            price: "Rp 50.000 / pack",
            description: "Sosis dari daging tuna pilihan. Pack isi 10 biji. Tanpa pengawet dan bahan kimia. Praktis untuk sarapan atau bekal. Tahan hingga 2 bulan dalam freezer.",
            image: "images/12.jpg"
        }
    ];

    const product = products.find(p => p.id === productId);
    if (product) {
        document.getElementById('modalImage').src = product.image;
        document.getElementById('modalImage').alt = product.name;
        document.getElementById('modalTitle').textContent = product.name;
        document.getElementById('modalPrice').textContent = product.price;
        document.getElementById('modalDescription').textContent = product.description;
        
        // Reset quantity
        productQuantity.value = 1;
        
        // Set current product
        currentProduct = product;
        
        document.getElementById('productModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Animation on scroll
function initAnimations() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    const elements = document.querySelectorAll('[data-aos]');

    function checkPosition() {
        elements.forEach(element => {
            const positionFromTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (positionFromTop - windowHeight <= -100) {
                element.classList.add('aos-animate');
            }
        });
    }

    // Run once on page load
    checkPosition();

    // Run on scroll
    window.addEventListener('scroll', checkPosition);
    window.addEventListener('resize', checkPosition);
}

document.addEventListener('DOMContentLoaded', function () {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    menuToggle.addEventListener('click', function () {
        nav.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            nav.classList.remove('active');
        });
    });

    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Inisialisasi carousel
    slides = document.querySelectorAll('.carousel-item');
    totalSlides = slides.length;

    // Auto slide change every 5 seconds
    setInterval(() => {
        moveSlide(1);
    }, 5000);

    // Initialize first slide
    showSlide(0);

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animated counter for stats
    const statItems = document.querySelectorAll('.stat-item');
    
    statItems.forEach(item => {
        const statNumber = item.querySelector('.stat-number');
        const finalValue = parseInt(statNumber.textContent);
        let currentValue = 0;
        const duration = 2000; // 2 seconds
        const increment = finalValue / (duration / 16); // 60fps
        
        const updateCounter = () => {
            if (currentValue < finalValue) {
                currentValue += increment;
                if (currentValue > finalValue) currentValue = finalValue;
                
                if (statNumber.textContent.includes('+')) {
                    statNumber.textContent = Math.floor(currentValue) + '+';
                } else {
                    statNumber.textContent = Math.floor(currentValue) + '%';
                }
                
                setTimeout(updateCounter, 16);
            }
        };
        
        // Start counter when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(item);
    });

    // Product data
    const products = [
        {
            id: 1,
            name: "Tahu Tuna Original",
            price: "Rp 9.000 / pack",
            description: "Perpaduan sempurna antara tahu dan daging tuna segar dengan bumbu rahasia keluarga. Setiap pack berisi 10 biji tahu tuna siap masak. Bisa digoreng, dikukus, atau dibakar sesuai selera. Tahan hingga 1 bulan dalam freezer.",
            image: "images/1.jpg"
        },
        {
            id: 2,
            name: "Tahu Tuna Spesial",
            price: "Rp 12.000 / pack",
            description: "Varian premium dengan kandungan tuna lebih banyak (70% tuna). Tekstur lebih lembut dan rasa lebih gurih. Pack 10 biji. Cocok untuk hidangan spesial keluarga atau sajian saat acara penting. Tahan hingga 6 minggu dalam freezer.",
           image: "images/2.jpg"
        },
        {
            id: 3,
            name: "Risoles Jagung",
            price: "Rp 28.000 / pack",
            description: "Risoles dengan isian jagung manis dan bumbu spesial. Pack 10 biji. Crispy di luar, lembut di dalam. Cocok untuk camilan atau bekal sekolah anak. Bisa langsung digoreng dari freezer. Tahan hingga 3 minggu dalam freezer.",
           image: "images/3.jpg"
        },
        {
            id: 4,
            name: "Risoles Tuna",
            price: "Rp 30.000 / pack",
            description: "Risoles dengan isian tuna gurih dan sayuran. Pack 10 biji. Tekstur lembut dengan rasa tuna yang dominan. Praktis untuk camilan sehat keluarga. Tahan hingga 1 bulan dalam freezer.",
            image: "images/4.jpg"
        },
        {
            id: 5,
            name: "Otak-otak Tuna",
            price: "Rp 30.000 / pack",
            description: "Otak-otak dengan isian tuna gurih dibungkus daun pisang. Pack 10 biji. Bisa digoreng atau dibakar. Rasa yang autentik dengan aroma daun pisang yang khas. Tahan hingga 1 bulan dalam freezer.",
            image: "images/5.jpg"
        },
        {
            id: 6,
            name: "Otak-otak Udang",
            price: "Rp 35.000 / pack",
            description: "Otak-otak dengan isian udang segar dan bumbu rempah. Pack 10 biji. Dibungkus daun pisang untuk aroma yang sedap. Cocok untuk lauk atau camilan. Tahan hingga 1 bulan dalam freezer.",
            image: "images/6.jpg"
        },
        {
            id: 7,
            name: "Martabak Tuna",
            price: "Rp 32.000 / pack",
            description: "Martabak mini dengan isian tuna dan telur. Pack 10 biji. Kulit renyah dengan isian yang gurih. Praktis untuk sarapan atau camilan. Tahan hingga 3 minggu dalam freezer.",
            image: "images/7.jpg"
        },
        {
            id: 8,
            name: "Lumpia Tuna",
            price: "Rp 30.000 / pack",
            description: "Lumpia dengan isian tuna dan sayuran. Pack 10 biji. Kulit tipis dan renyah dengan isian yang lembut. Cocok untuk segala acara. Tahan hingga 1 bulan dalam freezer.",
            image: "images/8.jpg"
        },
        {
            id: 9,
            name: "Kaki Naga",
            price: "Rp 40.000 / pack",
            description: "Olahan tuna dengan kulit tahu yang krispi. Pack 10 biji. Tekstur luar renyah dalam lembut. Disukai oleh anak-anak dan dewasa. Tahan hingga 1 bulan dalam freezer.",
           image: "images/9.jpg"
        },
        {
            id: 10,
            name: "Pangsit Tuna",
            price: "Rp 35.000 / pack",
            description: "Pangsit dengan isian tuna dan bumbu spesial. Pack 20 biji. Bisa digoreng atau direbus untuk sup. Praktis dan lezat. Tahan hingga 2 bulan dalam freezer.",
            image: "images/10.jpg"
        },
        {
            id: 11,
            name: "Bakso Tuna",
            price: "Rp 45.000 / pack",
            description: "Bakso ikan tuna dengan tekstur kenyal dan rasa gurih alami. Pack 500gr (isi 20-25 biji). Cocok untuk sup atau bakso kuah. Bisa langsung dimasak dari freezer. Tahan hingga 2 bulan dalam freezer.",
           image: "images/11.jpg"
        },
        {
            id: 12,
            name: "Sosis Tuna",
            price: "Rp 50.000 / pack",
            description: "Sosis dari daging tuna pilihan. Pack isi 10 biji. Tanpa pengawet dan bahan kimia. Praktis untuk sarapan atau bekal. Tahan hingga 2 bulan dalam freezer.",
            image: "images/12.jpg"
        }
    ];

    // Gallery data
    const gallery = [
        {
            image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            caption: "Produk Tahu Tuna"
        },
        {
            image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            caption: "Proses Produksi"
        },
        {
            image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            caption: "Kemasan Produk"
        },
        {
            image: "https://images.unsplash.com/photo-1481931098730-318b6f776db0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            caption: "Distribusi Produk"
        },
        {
            image: "https://images.unsplash.com/photo-1562967914-608f82629710?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            caption: "Penjualan di Pasar"
        },
        {
            image: "https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            caption: "Pelanggan Setia"
        }
    ];

    // Render products
    const productsContainer = document.querySelector('.products-grid-full');
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.setAttribute('data-aos', 'fade-up');
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description.substring(0, 100)}...</p>
                <button class="btn" onclick="openModal(${product.id})">Lihat Detail</button>
            </div>
        `;
        productsContainer.appendChild(productElement);
    });

    // Render gallery
    const galleryContainer = document.querySelector('.gallery-grid');
    gallery.forEach(item => {
        const galleryElement = document.createElement('div');
        galleryElement.className = 'gallery-item';
        galleryElement.setAttribute('data-aos', 'fade-up');
        galleryElement.innerHTML = `
            <img src="${item.image}" alt="${item.caption}" loading="lazy">
            <div class="gallery-caption">${item.caption}</div>
        `;
        galleryContainer.appendChild(galleryElement);
    });

    // Close modal when clicking the close button
    document.querySelector('.close')?.addEventListener('click', function () {
        document.getElementById('productModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', function (event) {
        const modal = document.getElementById('productModal');
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // WhatsApp order button in modal
    document.getElementById('btnOrderModal')?.addEventListener('click', function() {
        if (currentProductId) {
            orderViaWhatsApp(currentProductId);
            document.getElementById('productModal').style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Initialize animations
    initAnimations();
    
    // Update cart UI on page load
    updateCartUI();
});