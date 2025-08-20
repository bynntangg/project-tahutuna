// Deklarasikan variabel carousel di global scope
let currentSlide = 0;
let slides = [];
let totalSlides = 0;

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

// Modal functionality
function openModal(productId) {
    const products = [
        {
            id: 1,
            name: "Tahu Tuna Original",
            price: "Rp 25.000 / pack",
            description: "Perpaduan sempurna antara tahu dan daging tuna segar dengan bumbu rahasia keluarga. Setiap pack berisi 10 biji tahu tuna siap masak. Bisa digoreng, dikukus, atau dibakar sesuai selera. Tahan hingga 1 bulan dalam freezer.",
            image: "images/1.jpg"
        },
        {
            id: 2,
            name: "Tahu Tuna Spesial",
            price: "Rp 35.000 / pack",
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
        document.getElementById('productModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Animation on scroll
function initAnimations() {
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
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

     document.addEventListener('DOMContentLoaded', function() {
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
        });

    // Product data
    const products = [
        {
            id: 1,
            name: "Tahu Tuna Original",
            price: "Rp 25.000 / pack",
            description: "Perpaduan sempurna antara tahu dan daging tuna segar dengan bumbu rahasia keluarga. Setiap pack berisi 10 biji tahu tuna siap masak. Bisa digoreng, dikukus, atau dibakar sesuai selera. Tahan hingga 1 bulan dalam freezer.",
            image: "images/1.jpg"
        },
        {
            id: 2,
            name: "Tahu Tuna Spesial",
            price: "Rp 35.000 / pack",
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

    // Initialize animations
    initAnimations();
});