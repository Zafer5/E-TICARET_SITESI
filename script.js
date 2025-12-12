// Product Data
const products = [
    {
        id: 1,
        title: "Premium Deri Ceket",
        price: 2499.99,
        category: "Giyim",
        image: "https://cdn.dsmcdn.com/mnresize/400/-/ty1769/prod/QC_ENRICHMENT/20251007/15/9d03730f-60c8-37bf-92c3-c1bd3cb8f9c0/1_org_zoom.jpg",
        rating: 4.8,
        reviews: [
            { user: "Ahmet K.", comment: "Harika bir ceket, çok kaliteli.", rating: 5, date: "10 Ekim 2025" },
            { user: "Mehmet Y.", comment: "Beden tam oldu, tavsiye ederim.", rating: 4.5, date: "12 Ekim 2025" }
        ]
    },
    {
        id: 2,
        title: "Kablosuz Kulaklık",
        price: 1299.90,
        category: "Elektronik",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        rating: 4.5,
        reviews: [
            { user: "Ayşe S.", comment: "Ses kalitesi muazzam.", rating: 5, date: "15 Eylül 2025" }
        ]
    },
    {
        id: 3,
        title: "Akıllı Saat",
        price: 3499.00,
        category: "Elektronik",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        rating: 4.2,
        reviews: []
    },
    {
        id: 4,
        title: "Sneaker Ayakkabı",
        price: 1899.50,
        category: "Ayakkabı",
        image: "https://i.ytimg.com/vi/y5DcP2Qt5Uo/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLB-9c9_DmvVpPQvk4gzcZ6K_Mf26A",
        rating: 4.7,
        reviews: []
    },
    {
        id: 5,
        title: "Güneş Gözlüğü",
        price: 499.99,
        category: "Aksesuar",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        rating: 4.0,
        reviews: []
    },
    {
        id: 6,
        title: "Sırt Çantası",
        price: 899.00,
        category: "Aksesuar",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        rating: 4.6,
        reviews: []
    },
    {
        id: 7,
        title: "Mekanik Klavye",
        price: 1599.00,
        category: "Elektronik",
        image: "https://cdn.shopier.app/pictures_large/AcarTech_584b939b38cc16f4818942078f27178c.jpg",
        rating: 4.9,
        reviews: []
    },
    {
        id: 8,
        title: "Minimalist Saat",
        price: 999.99,
        category: "Aksesuar",
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        rating: 4.4,
        reviews: []
    }
];

// State
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let filteredProducts = [...products];

// DOM Elements
const productsContainer = document.getElementById('products-container');
const featuredProductsContainer = document.getElementById('featured-products-container');
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCountElement = document.getElementById('cart-count');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchModal = document.getElementById('search-modal');
const searchToggleBtn = document.getElementById('search-toggle-btn');
const searchModalClose = document.getElementById('search-modal-close');

// Set animation order for testimonial cards
document.addEventListener('DOMContentLoaded', function () {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach((card, index) => {
        card.style.setProperty('--animation-order', index);
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Determine current page
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);

    if (productsContainer) {
        // If on home or products page
        renderProducts();

        // Add event listeners for filter and sort on products page
        const categoryFilter = document.getElementById('category-filter');
        const sortFilter = document.getElementById('sort-filter');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', filterAndSortProducts);
        }

        if (sortFilter) {
            sortFilter.addEventListener('change', filterAndSortProducts);
        }

        // Update compare buttons
        updateCompareButtons();
    }

    // Render featured products on homepage
    if (featuredProductsContainer) {
        renderFeaturedProducts();
    }

    // Product Detail Page
    const detailContainer = document.getElementById('product-detail-container');
    if (detailContainer) {
        const productId = parseInt(searchParams.get('id'));
        renderProductDetail(productId);
    }

    // Orders Page
    const ordersContainer = document.getElementById('orders-container');
    if (ordersContainer) {
        renderOrders();
    }

    // Comparison Page
    if (window.location.pathname.includes('comparison')) {
        initComparisonPage();
    }

    updateCartUI();
    updateCompareCount(); // Initialize compare count badge

    // Theme Management
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (themeToggleBtn) updateThemeIcon(themeToggleBtn, currentTheme);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'dark') {
                theme = 'light';
            } else {
                theme = 'dark';
            }
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            updateThemeIcon(themeToggleBtn, theme);
        });
    }

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            alert(`Teşekkürler! ${email} adresine bülten gönderilmiştir.`);
            this.reset();
        });
    }

    // Search functionality with debouncing for better performance
    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                searchModal.classList.remove('active');
                debouncedSearch(searchTerm);
            }
        });

        // Also add input event for real-time search (with debouncing)
        searchInput.addEventListener('input', function (e) {
            const searchTerm = e.target.value.trim();
            if (searchTerm.length > 2) { // Only search after 3 characters
                debouncedSearch(searchTerm);
            } else if (searchTerm.length === 0) {
                // Reset to show all products when search is cleared
                filteredProducts = [...products];
                renderProducts();
            }
        });
    }

    // Search modal toggle
    if (searchToggleBtn && searchModal) {
        searchToggleBtn.addEventListener('click', () => {
            searchModal.classList.add('active');
            setTimeout(() => {
                searchInput.focus();
            }, 100);
        });
    }

    // Close search modal
    if (searchModalClose) {
        searchModalClose.addEventListener('click', () => {
            searchModal.classList.remove('active');
        });
    }

    // Close search modal on ESC key
    if (searchModal) {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchModal.classList.contains('active')) {
                searchModal.classList.remove('active');
            }
        });

        // Close search modal when clicking outside
        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) {
                searchModal.classList.remove('active');
            }
        });
    }

    // Search on products page if search term in URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery && productsContainer) {
        searchInput.value = searchQuery;
        searchProducts(searchQuery);
    }
});
function updateThemeIcon(btn, theme) {
    const icon = btn.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Search Products Function
function searchProducts(query) {
    // Redirect to products page with search query
    if (window.location.pathname !== '/products.html' && window.location.pathname !== '/products') {
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
        return;
    }

    // Filter products based on search query
    const searchTerm = query.toLowerCase();
    const filtered = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.description && product.description.toLowerCase().includes(searchTerm)
    );

    // Update filteredProducts array
    filteredProducts = filtered;

    // Render filtered products
    renderProducts();

    // Update page title to show search results
    const titleElement = document.querySelector('.section-title') || document.querySelector('header.page-header h1');

    if (titleElement) {
        if (filtered.length > 0) {
            titleElement.textContent = `"${query}" için arama sonuçları`;
        } else {
            titleElement.textContent = `"${query}" için arama sonucu bulunamadı`;
        }
    }
}

// Compare Functions
let compareList = JSON.parse(localStorage.getItem('compare')) || [];

function toggleCompare(productId) {
    const productIndex = compareList.findIndex(item => item.id === productId);

    if (productIndex > -1) {
        // Remove from compare list
        compareList.splice(productIndex, 1);
        showMessage(`"${products.find(p => p.id === productId)?.title}" karşılaştırmadan kaldırıldı!`, 'error');
    } else {
        // Add to compare list (limit to 4 products)
        if (compareList.length >= 4) {
            showMessage('Karşılaştırmaya en fazla 4 ürün ekleyebilirsiniz!', 'error');
            return;
        }

        const product = products.find(p => p.id === productId);
        if (product) {
            compareList.push({ ...product });
            showMessage(`"${product.title}" karşılaştırmaya eklendi!`, 'success');
        }
    }

    // Save to localStorage
    localStorage.setItem('compare', JSON.stringify(compareList));

    // Update compare button visuals
    updateCompareButtons();
}

function updateCompareButtons() {
    // Update compare icons on product cards
    document.querySelectorAll('.add-to-compare').forEach(button => {
        const productId = parseInt(button.dataset.productId);
        const icon = button.querySelector('i');

        if (compareList.some(item => item.id === productId)) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            button.classList.add('active');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            button.classList.remove('active');
        }
    });

    // Update navbar compare count badge
    updateCompareCount();
}

function updateCompareCount() {
    const compareCountElement = document.getElementById('compare-count');
    if (compareCountElement) {
        compareCountElement.textContent = compareList.length;

        // Hide badge if count is 0
        if (compareList.length === 0) {
            compareCountElement.style.display = 'none';
        } else {
            compareCountElement.style.display = 'flex';
        }
    }
} function showMessage(message, type) {
    // Remove existing notification if any
    const existing = document.querySelector('.compare-notification');
    if (existing) existing.remove();

    const notificationHTML = `
        <div class="compare-notification ${type}" id="compare-notification">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', notificationHTML);

    // Show notification
    const notification = document.getElementById('compare-notification');
    notification.classList.add('show');

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification) notification.remove();
        }, 300);
    }, 3000);
}

function initComparisonPage() {
    const comparisonContainer = document.getElementById('comparison-products');
    const clearButton = document.getElementById('clear-comparison');

    if (!comparisonContainer) return; // Not on comparison page

    // Render comparison table
    renderComparisonTable();

    // Add event listener to clear button
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            if (confirm('Karşılaştırma listesini temizlemek istediğinize emin misiniz?')) {
                compareList = [];
                localStorage.removeItem('compare');
                renderComparisonTable();
                updateCompareButtons();
            }
        });
    }
}

function renderComparisonTable() {
    const comparisonContainer = document.getElementById('comparison-products');

    if (compareList.length === 0) {
        comparisonContainer.innerHTML = `
            <div class="empty-comparison">
                <i class="fas fa-balance-scale" style="font-size: 4rem; color: var(--gray-300); margin-bottom: 20px;"></i>
                <h3>Karşılaştırılacak ürün bulunamadı</h3>
                <p>Karşılaştırmak için önce ürün ekleyin.</p>
                <a href="products.html" class="btn btn-primary">Ürünleri İncele</a>
            </div>
        `;
        return;
    }

    // Create comparison table
    let tableHTML = `
        <div class="comparison-table">
            <div class="comparison-table-header">
                <div class="comparison-table-cell">Özellikler</div>
    `;

    // Add product headers
    compareList.forEach(product => {
        tableHTML += `
            <div class="comparison-product-card">
                <img src="${product.image}" alt="${product.title}" class="comparison-product-image" loading="lazy">
                <div class="comparison-product-title">${product.title}</div>
                <div class="comparison-product-price">${formatCurrency(product.price)}</div>
                <div class="comparison-product-rating">${renderStars(product.rating)} (${product.rating})</div>
                <button class="btn btn-outline" data-product-id="${product.id}">
                    <i class="fas fa-trash"></i> Kaldır
                </button>
            </div>
        `;
    });

    tableHTML += `
            </div>
            <div class="comparison-table-row">
                <div class="comparison-table-cell">Kategori</div>
    `;

    compareList.forEach(product => {
        tableHTML += `<div class="comparison-table-cell">${product.category}</div>`;
    });

    tableHTML += `
            </div>
            <div class="comparison-table-row">
                <div class="comparison-table-cell">Fiyat</div>
    `;

    compareList.forEach(product => {
        tableHTML += `<div class="comparison-table-cell">${formatCurrency(product.price)}</div>`;
    });

    tableHTML += `
            </div>
            <div class="comparison-table-row">
                <div class="comparison-table-cell">Puan</div>
    `;

    compareList.forEach(product => {
        tableHTML += `<div class="comparison-table-cell">${renderStars(product.rating)} (${product.rating})</div>`;
    });

    tableHTML += `
            </div>
        </div>
    `;

    comparisonContainer.innerHTML = tableHTML;

    // Add event listeners to the remove buttons
    comparisonContainer.querySelectorAll('.btn-outline').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(button.dataset.productId);
            toggleCompare(productId);
        });
    });
}

// Wishlist Functions
function toggleWishlist(productId) {
    const productIndex = wishlist.findIndex(item => item.id === productId);

    if (productIndex > -1) {
        // Remove from wishlist
        wishlist.splice(productIndex, 1);
    } else {
        // Add to wishlist
        const product = products.find(p => p.id === productId);
        if (product) {
            wishlist.push({ ...product });
        }
    }

    // Save to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlist));

    // Update wishlist icon visuals
    updateWishlistIcons();

    // Show notification
    const product = products.find(p => p.id === productId);
    if (product) {
        const message = productIndex > -1 ?
            `"${product.title}" favorilerden kaldırıldı!` :
            `"${product.title}" favorilere eklendi!`;
        showWishlistNotification(message);
    }
}

function updateWishlistIcons() {
    // Update heart icons on product cards
    document.querySelectorAll('.add-to-wishlist').forEach(button => {
        const productId = parseInt(button.dataset.productId);
        const icon = button.querySelector('i');

        if (wishlist.some(item => item.id === productId)) {
            icon.classList.remove('far');
            icon.classList.add('fas', 'text-danger');
        } else {
            icon.classList.remove('fas', 'text-danger');
            icon.classList.add('far');
        }
    });
}
function showWishlistNotification(message) {
    // Remove existing notification if any
    const existing = document.getElementById('wishlist-notification');
    if (existing) existing.remove();

    const notificationHTML = `
        <div class="wishlist-notification" id="wishlist-notification">
            <i class="fas fa-heart"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', notificationHTML);

    // Remove notification after 3 seconds
    setTimeout(() => {
        const notification = document.getElementById('wishlist-notification');
        if (notification) {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification) notification.remove();
            }, 300);
        }
    }, 3000);
}

// Filter and Sort Products
function filterAndSortProducts() {
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');

    let filtered = [...products];

    // Apply category filter
    if (categoryFilter && categoryFilter.value !== 'all') {
        filtered = filtered.filter(product => product.category === categoryFilter.value);
    }

    // Apply sorting
    if (sortFilter) {
        switch (sortFilter.value) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            default:
                // Default sorting (by ID)
                filtered.sort((a, b) => a.id - b.id);
        }
    }

    filteredProducts = filtered;
    renderProducts();
}

// Render Featured Products
function renderFeaturedProducts() {
    // Select top rated products as featured
    const featuredProducts = [...products]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);

    // Add loading skeleton
    featuredProductsContainer.innerHTML = `
        <div class="skeleton-product">
            <div class="skeleton-image"></div>
            <div class="skeleton-info">
                <div class="skeleton-text"></div>
                <div class="skeleton-text short"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-button"></div>
            </div>
        </div>
        <div class="skeleton-product">
            <div class="skeleton-image"></div>
            <div class="skeleton-info">
                <div class="skeleton-text"></div>
                <div class="skeleton-text short"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-button"></div>
            </div>
        </div>
    `;

    // Render actual products after a short delay
    setTimeout(() => {
        featuredProductsContainer.innerHTML = featuredProducts.map((product, index) => `
            <div class="product-card" style="--animation-order: ${index}">
                <a href="product-detail.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy">
                </a>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-title"><a href="product-detail.html?id=${product.id}">${product.title}</a></h3>
                    <div class="product-rating-card">
                       ${renderStars(product.rating)} <span style="font-size: 0.8rem; color: var(--text-light);">(${product.rating})</span>
                    </div>
                    <div class="product-price">${formatCurrency(product.price)}</div>
                    <button class="add-to-cart" data-product-id="${product.id}">
                        Sepete Ekle
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners to the featured product buttons
        featuredProductsContainer.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(button.dataset.productId);
                addToCart(productId);
            });
        });
    }, 600);
}// Render Product Detail
function renderProductDetail(id) {
    const product = products.find(p => p.id === id);
    const container = document.getElementById('product-detail-container');

    if (!product) {
        container.innerHTML = '<div class="container"><p>Ürün bulunamadı.</p></div>';
        return;
    }

    // Use only the product's own image for the gallery
    // Repeating it to simulate a gallery layout without showing unrelated products
    const mockImages = [
        product.image,
        product.image,
        product.image
    ];

    // Merge with local storage reviews
    const storedReviews = JSON.parse(localStorage.getItem(`reviews_${id}`)) || [];
    const allReviews = [...(product.reviews || []), ...storedReviews];

    // Calculate average rating
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = allReviews.length > 0 ? (totalRating / allReviews.length).toFixed(1) : product.rating;

    container.innerHTML = `
        <div class="product-detail-wrapper">
            <!-- Left Column: Gallery -->
            <div class="product-gallery">
                <div class="main-image-container">
                    <button class="gallery-nav prev"><i class="fas fa-chevron-left"></i></button>
                    <img src="${product.image}" id="main-product-image" alt="${product.title}" loading="lazy">
                    <button class="gallery-nav next"><i class="fas fa-chevron-right"></i></button>
                </div>
                <div class="thumbnail-container">
                    ${mockImages.map((img, index) => `
                        <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage('${img}', this)">
                            <img src="${img}" alt="Thumbnail ${index + 1}" loading="lazy">
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Right Column: Info -->
            <div class="product-info-detail">
                <h1 class="detail-title">${product.title}</h1>
                
                <div class="product-rating-summary">
                    <div class="stars">${renderStars(avgRating)}</div>
                    <span class="rating-text">${avgRating} (${allReviews.length} Değerlendirme)</span>
                </div>

                <div class="product-meta-grid">
                    <div class="meta-row">
                        <span class="meta-label">Markası:</span>
                        <span class="meta-value brand">Diğer</span>
                    </div>
                    <div class="meta-row">
                        <span class="meta-label">Stok Kodu:</span>
                        <span class="meta-value">PRD${product.id}00${product.id}STD</span>
                    </div>
                    <div class="meta-row">
                        <span class="meta-label">Barkodu:</span>
                        <span class="meta-value">8690000000${product.id}</span>
                    </div>
                    <div class="meta-row">
                        <span class="meta-label">Miktarı:</span>
                        <span class="meta-value">Son 5 ADET</span>
                    </div>
                </div>

                <div class="color-selection">
                    <span class="selection-label">RENKLER</span>
                    <div class="color-options">
                        <div class="color-option active">
                            <img src="${product.image}" alt="Color 1" loading="lazy">
                        </div>
                    </div>
                </div>

                <div class="price-section">
                    <span class="current-price">${formatCurrency(product.price)}</span>
                    <span class="old-price">${formatCurrency(product.price * 1.2)}</span>
                    <div class="vat-info">KDV : %20</div>
                </div>

                <div class="action-area">
                    <div class="quantity-selector">
                        <button onclick="updateDetailQuantity(-1)">-</button>
                        <input type="text" value="1" id="detail-quantity" readonly>
                        <button onclick="updateDetailQuantity(1)">+</button>
                    </div>
                    <span class="unit-label">ADET</span>
                    
                    <button class="btn-add-cart-large" data-product-id="${product.id}">
                        <i class="fas fa-shopping-basket"></i> SEPETE EKLE
                    </button>
                    
                </div>

                <div class="extra-actions">
                    <a href="#"><i class="fas fa-bell"></i> Fiyat Alarmı</a>
                    <span class="divider">|</span>
                    <a href="#"><i class="fas fa-share-alt"></i> Arkadaşıma Öner</a>
                </div>

                <div class="shipping-badge">
                    <i class="fas fa-truck"></i>
                    <span>Ücretsiz Kargo</span>
                </div>
            </div>
        </div>

        <!-- Reviews Section -->
        <div class="reviews-section">
            <h2 class="section-title" style="text-align: left; margin-bottom: 30px;">Değerlendirmeler</h2>
            
            <div class="reviews-container">
                <!-- Review Form -->
                <div class="review-form-card">
                    <h3>Yorum Yap</h3>
                    <form id="review-form" onsubmit="submitReview(event, ${product.id})">
                        <div class="form-group">
                            <label>Puanınız</label>
                            <div class="star-rating-input">
                                <i class="far fa-star" data-value="1" onclick="setRating(1)"></i>
                                <i class="far fa-star" data-value="2" onclick="setRating(2)"></i>
                                <i class="far fa-star" data-value="3" onclick="setRating(3)"></i>
                                <i class="far fa-star" data-value="4" onclick="setRating(4)"></i>
                                <i class="far fa-star" data-value="5" onclick="setRating(5)"></i>
                                <input type="hidden" id="rating-input" value="0" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Adınız Soyadınız</label>
                            <input type="text" id="review-name" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>Yorumunuz</label>
                            <textarea id="review-comment" class="form-control" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Gönder</button>
                    </form>
                </div>

                <!-- Reviews List -->
                <div class="reviews-list">
                    ${allReviews.length > 0 ? allReviews.map(review => `
                        <div class="review-card">
                            <div class="review-header">
                                <div class="review-user">
                                    <div class="user-avatar">${review.user.charAt(0)}</div>
                                    <div class="user-info">
                                        <span class="user-name">${review.user}</span>
                                        <span class="review-date">${review.date}</span>
                                    </div>
                                </div>
                                <div class="review-rating">${renderStars(review.rating)}</div>
                            </div>
                            <div class="review-content">
                                <p>${review.comment}</p>
                            </div>
                        </div>
                    `).join('') : '<p>Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>'}
                </div>
            </div>
        </div>
    `;

    // Add event listener to the add to cart button
    const addToCartButton = container.querySelector('.btn-add-cart-large');
    addToCartButton.addEventListener('click', (e) => {
        const productId = parseInt(addToCartButton.dataset.productId);
        addToCart(productId);
    });
}

// Helper: Render Stars
function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Review Logic
let currentRating = 0;

window.setRating = (value) => {
    currentRating = value;
    document.getElementById('rating-input').value = value;
    const stars = document.querySelectorAll('.star-rating-input i');
    stars.forEach((star, index) => {
        if (index < value) {
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
        }
    });
};

window.submitReview = (e, productId) => {
    e.preventDefault();
    const name = document.getElementById('review-name').value;
    const comment = document.getElementById('review-comment').value;
    const rating = parseInt(document.getElementById('rating-input').value);

    if (rating === 0) {
        alert('Lütfen puan veriniz.');
        return;
    }

    const newReview = {
        user: name,
        comment: comment,
        rating: rating,
        date: new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    // Save to local storage
    const storedReviews = JSON.parse(localStorage.getItem(`reviews_${productId}`)) || [];
    storedReviews.unshift(newReview);
    localStorage.setItem(`reviews_${productId}`, JSON.stringify(storedReviews));

    // Reload to show new review
    renderProductDetail(productId);
};

// Gallery Interaction
window.changeMainImage = (src, thumbnail) => {
    document.getElementById('main-product-image').src = src;
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    thumbnail.classList.add('active');
};

window.updateDetailQuantity = (change) => {
    const input = document.getElementById('detail-quantity');
    let val = parseInt(input.value);
    val += change;
    if (val < 1) val = 1;
    input.value = val;
};

// Cache for product templates to avoid recreating the same elements
const productTemplateCache = new Map();

// Render Products (Updated to link to detail page) with performance optimizations
function renderProducts() {
    // Use filteredProducts if on products page, otherwise use all products
    const productsToRender = productsContainer ? filteredProducts : products;

    // Only re-render if products have actually changed
    const productsHash = JSON.stringify(productsToRender.map(p => p.id).sort());
    if (productsContainer && productsContainer.dataset.productsHash === productsHash) {
        // Products haven't changed, just update button states
        updateWishlistIcons();
        updateCompareButtons();
        return;
    }

    // Update the hash
    if (productsContainer) {
        productsContainer.dataset.productsHash = productsHash;
    }

    // Show skeleton loading effect
    if (productsContainer) {
        productsContainer.innerHTML = `
            <div class="skeleton-product">
                <div class="skeleton-image"></div>
                <div class="skeleton-info">
                    <div class="skeleton-text"></div>
                    <div class="skeleton-text short"></div>
                    <div class="skeleton-text"></div>
                    <div class="skeleton-button"></div>
                </div>
            </div>
            <div class="skeleton-product">
                <div class="skeleton-image"></div>
                <div class="skeleton-info">
                    <div class="skeleton-text"></div>
                    <div class="skeleton-text short"></div>
                    <div class="skeleton-text"></div>
                    <div class="skeleton-button"></div>
                </div>
            </div>
            <div class="skeleton-product">
                <div class="skeleton-image"></div>
                <div class="skeleton-info">
                    <div class="skeleton-text"></div>
                    <div class="skeleton-text short"></div>
                    <div class="skeleton-text"></div>
                    <div class="skeleton-button"></div>
                </div>
            </div>
        `;

        // Simulate loading delay
        setTimeout(() => {
            renderProductsActual(productsToRender);
        }, 800);
    } else {
        renderProductsActual(productsToRender);
    }
}

// Actual rendering function
function renderProductsActual(productsToRender) {
    // Use DocumentFragment for better performance when adding multiple elements
    const fragment = document.createDocumentFragment();

    // Clear container
    if (productsContainer) {
        productsContainer.innerHTML = '';
    }

    // Render products
    productsToRender.forEach((product, index) => {
        // Create new product card
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <a href="product-detail.html?id=${product.id}">
                <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy">
            </a>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title"><a href="product-detail.html?id=${product.id}">${product.title}</a></h3>
                <div class="product-rating-card">
                   ${renderStars(product.rating || 4.5)} <span style="font-size: 0.8rem; color: var(--text-light);">(${product.rating || 4.5})</span>
                </div>
                <div class="product-price">${formatCurrency(product.price)}</div>
                <div class="product-actions">
                    <button class="add-to-cart" data-product-id="${product.id}">
                        Sepete Ekle
                    </button>
                    <button class="add-to-wishlist" data-product-id="${product.id}">
                        <i class="far fa-heart"></i>
                    </button>
                    <button class="add-to-compare" data-product-id="${product.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 6h6"/>
                            <path d="M12 3v3"/>
                            <path d="M8 9h8"/>
                            <path d="M8 12h8"/>
                            <path d="M8 15h8"/>
                            <path d="M6 18h12"/>
                            <path d="M6 21h12"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        fragment.appendChild(productCard);
    });

    if (productsContainer) {
        if (productsToRender.length === 0) {
            productsContainer.innerHTML = `
                <div class="empty-search-state" style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--gray-300); margin-bottom: 20px;"></i>
                    <h3 style="font-size: 1.5rem; margin-bottom: 10px; color: var(--text-color);">Maalesef aradığınız ürün stoklarımızda bulunmamaktadır.</h3>
                    <p style="color: var(--text-light); margin-bottom: 20px;">Farklı anahtar kelimelerle aramayı deneyebilir veya kategorilerimize göz atabilirsiniz.</p>
                    <a href="products.html" class="btn btn-primary" onclick="window.location.href='products.html'">Tüm Ürünleri Gör</a>
                </div>
            `;
        } else {
            productsContainer.appendChild(fragment);
        }

        // Update button states
        updateWishlistIcons();
        updateCompareButtons();
    }
}

// Order Management
function createOrder(customerInfo) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const newOrder = {
        id: 'SIP-' + Date.now().toString().slice(-6),
        date: new Date().toLocaleDateString('tr-TR'),
        timestamp: Date.now(), // Store timestamp for delivery simulation
        status: 'Hazırlanıyor',
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        customer: customerInfo
    };

    orders.unshift(newOrder); // Add to beginning
    localStorage.setItem('orders', JSON.stringify(orders));

    // Start delivery timer for this session
    setTimeout(() => checkDeliveryStatus(), 60000); // Check in 1 minute

    return newOrder;
}

function deleteOrder(orderId) {
    if (confirm('Bu siparişi silmek istediğinize emin misiniz?')) {
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders = orders.filter(order => order.id !== orderId);
        localStorage.setItem('orders', JSON.stringify(orders));
        renderOrders();
    }
}

function renderOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const container = document.getElementById('orders-container');

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 50px;">
                <i class="fas fa-box-open" style="font-size: 4rem; color: var(--gray-200); margin-bottom: 20px;"></i>
                <h3 style="color: var(--secondary-color); margin-bottom: 10px;">Henüz siparişiniz yok</h3>
                <p style="color: var(--text-color); margin-bottom: 20px;">Hemen alışverişe başlayın ve tarzınızı yansıtın.</p>
                <a href="products.html" class="btn btn-primary">Alışverişe Başla</a>
            </div>
        `;
        return;
    }

    // Timeline Steps with descriptions and icons
    const steps = [
        {
            label: 'Siparişiniz Alındı',
            status: 'Hazırlanıyor',
            description: 'Siparişiniz tarafımıza ulaştı ve işleme alındı.',
            icon: 'fa-receipt'
        },
        {
            label: 'Hazırlanıyor',
            status: 'Hazırlanıyor',
            description: 'Siparişiniz hazırlanıyor ve kontrol ediliyor.',
            icon: 'fa-box-open'
        },
        {
            label: 'Kargoya Verildi',
            status: 'Kargoda',
            description: 'Siparişiniz kargoya verildi ve yola çıktı.',
            icon: 'fa-truck'
        },
        {
            label: 'Teslim Edildi',
            status: 'Teslim Edildi',
            description: 'Siparişiniz başarıyla teslim edildi.',
            icon: 'fa-home'
        }
    ];

    container.innerHTML = orders.map(order => {
        // Determine active step index based on status
        let activeIndex = 0;
        if (order.status === 'Hazırlanıyor') activeIndex = 1;
        if (order.status === 'Kargoda') activeIndex = 2;
        if (order.status === 'Teslim Edildi') activeIndex = 3;

        return `
        <div class="order-card">
            <!-- Order Header -->
            <div class="order-header">
                <div class="order-id">Sipariş No: ${order.id}</div>
                <div class="order-date">${order.date}</div>
                <div class="order-status ${getStatusClass(order.status)}">${order.status}</div>
            </div>

            <!-- Timeline -->
            <div class="order-timeline">
                <div class="timeline-track">
                    ${steps.map((step, index) => `
                        <div class="timeline-step ${index <= activeIndex ? 'active' : ''} ${index === activeIndex ? 'current' : ''}">
                            <div class="step-icon">
                                <i class="fas ${step.icon}"></i>
                            </div>
                            <div class="step-label">${step.label}</div>
                            <div class="step-description">${step.description}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Order Summary -->
            <div class="order-summary-section">
                <div class="order-summary-grid">
                    <div class="summary-item">
                        <div class="summary-label">Sipariş Tarihi</div>
                        <div class="summary-value">${order.date}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Kargo Firması</div>
                        <div class="summary-value">Sürat Kargo</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Tahmini Teslim</div>
                        <div class="summary-value">${order.status === 'Teslim Edildi' ? 'Teslim Edildi' : '3 İş Günü İçinde'}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Toplam Tutar</div>
                        <div class="summary-value">${formatCurrency(order.total)}</div>
                    </div>
                </div>
            </div>

            <!-- Header Info -->
            <div class="order-details-header">
                <div class="order-info-text">
                    <strong>Kargo Takip No:</strong> TRK${Math.floor(Math.random() * 1000000000)}
                </div>
                <div class="delivery-date">
                    <i class="fas fa-check-circle"></i>
                    ${order.status === 'Teslim Edildi' ? 'Teslim Edildi' : 'Tahmini Teslim: 3 Gün'}
                </div>
            </div>

            <!-- Products -->
            <div class="order-body">
                ${order.items.map(item => `
                    <div class="order-product-row">
                        <img src="${item.image}" alt="${item.title}" class="order-product-image" loading="lazy">
                        <div class="order-product-info">
                            <div class="order-product-brand">GZC COLLECTION</div>
                            <div class="order-product-title">${item.title}</div>
                            <div class="order-product-meta">Adet: ${item.quantity}</div>
                            <div class="order-product-price">
                                <span class="original">${formatCurrency(item.price * 1.2)}</span>
                                ${formatCurrency(item.price)}
                            </div>
                        </div>
                        <div>
                             <button class="btn-evaluate" href="orders.html">Ürünü Değerlendir</button>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- Footer Actions -->
            <div class="order-actions-footer">
                <a href="#" class="action-link"><i class="fas fa-box"></i> İade Kargo Kodu Oluştur</a>
                <a href="#" class="action-link"><i class="fas fa-file-invoice"></i> Fatura Görüntüle</a>
                <button class="btn-delete" onclick="deleteOrder('${order.id}')" style="margin-left: auto;">
                    <i class="fas fa-trash"></i> Sil
                </button>
            </div>
        </div>
    `}).join('');
}

function getStatusClass(status) {
    if (status === 'Hazırlanıyor') return 'status-preparing';
    if (status === 'Kargoda') return 'status-shipped';
    if (status === 'Teslim Edildi') return 'status-delivered';
    return '';
}

// Delivery Simulation Logic
function checkDeliveryStatus() {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    let updated = false;
    const now = Date.now();

    orders = orders.map(order => {
        // If order is older than 1 minute (60000ms) and status is 'Hazırlanıyor'
        if (order.status === 'Hazırlanıyor' && order.timestamp && (now - order.timestamp > 60000)) {
            order.status = 'Teslim Edildi';
            updated = true;
            showDeliveryPopup(order.id);
        }
        return order;
    });

    if (updated) {
        localStorage.setItem('orders', JSON.stringify(orders));
        const ordersContainer = document.getElementById('orders-container');
        if (ordersContainer) renderOrders();
    }
}

// Check delivery status periodically
setInterval(checkDeliveryStatus, 10000); // Check every 10 seconds

// Popup Logic
function showSuccessPopup() {
    const popupHTML = `
        <div class="popup-overlay active" id="success-popup">
            <div class="popup-content">
                <div class="popup-icon">
                    <i class="fas fa-check"></i>
                </div>
                <h2 class="popup-title">Siparişiniz Alındı!</h2>
                <p class="popup-message">Ödemeniz başarıyla gerçekleşti. Siparişinizi "Siparişlerim" sayfasından takip edebilirsiniz.</p>
                <button class="btn btn-primary" onclick="closePopupAndRedirect()">Tamam</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHTML);
}

function showDeliveryPopup(orderId) {
    // Remove existing popup if any
    const existing = document.getElementById('delivery-popup');
    if (existing) existing.remove();

    const popupHTML = `
        <div class="popup-overlay active" id="delivery-popup">
            <div class="popup-content">
                <div class="popup-icon" style="background-color: #dbeafe; color: #2563eb;">
                    <i class="fas fa-box-open"></i>
                </div>
                <h2 class="popup-title">Sipariş Teslim Edildi!</h2>
                <p class="popup-message">#${orderId} numaralı siparişiniz başarıyla teslim edilmiştir.</p>
                <button class="btn btn-primary" onclick="document.getElementById('delivery-popup').remove()">Tamam</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHTML);
}

window.closePopupAndRedirect = () => {
    const popup = document.getElementById('success-popup');
    if (popup) popup.remove();
    window.location.href = 'index.html';
};

// Utility function to debounce function calls
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Performance optimized search function
const debouncedSearch = debounce((query) => {
    searchProducts(query);
}, 300);

// Add to Cart
window.addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();

    // Show notification
    showAddToCartNotification(product.title);

    // Open cart after a short delay to allow notification to be seen
    setTimeout(() => {
        openCart();
    }, 1000);
};

// Show notification when item is added to cart
function showAddToCartNotification(productName) {
    // Remove existing notification if any
    const existing = document.getElementById('cart-notification');
    if (existing) existing.remove();

    const notificationHTML = `
        <div class="cart-notification" id="cart-notification">
            <i class="fas fa-check-circle"></i>
            <span>"${productName}" sepete eklendi!</span>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', notificationHTML);

    // Remove notification after 3 seconds
    setTimeout(() => {
        const notification = document.getElementById('cart-notification');
        if (notification) {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification) notification.remove();
            }, 300);
        }
    }, 3000);
}

// Remove from Cart
window.removeFromCart = (productId) => {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
};

// Update Quantity
window.updateQuantity = (productId, change) => {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
};

// Save Cart
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update Cart UI
function updateCartUI() {
    // Update Count
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountElement) cartCountElement.textContent = totalCount;

    // Update Total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotalElement) cartTotalElement.textContent = formatCurrency(total);

    // Update Items
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Sepetiniz boş.</div>';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">${formatCurrency(item.price)}</div>
                        <div class="cart-item-controls">
                            <div class="quantity-controls">
                                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                                <span>${item.quantity}</span>
                                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                            </div>
                            <i class="fas fa-trash remove-item" onclick="removeFromCart(${item.id})"></i>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Format Currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
    }).format(amount);
}

// Event Listeners
if (cartBtn) {
    cartBtn.addEventListener('click', openCart);
}

if (closeCartBtn) {
    closeCartBtn.addEventListener('click', closeCart);
}

if (overlay) {
    overlay.addEventListener('click', closeCart);
}

function openCart() {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
}

function closeCart() {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
}

// Clear Cart
window.clearCart = () => {
    cart = [];
    saveCart();
    updateCartUI();
};

// Checkout Page Logic
window.initCheckout = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const checkoutTotalElement = document.getElementById('checkout-total');
    const checkoutForm = document.getElementById('checkout-form');

    if (!checkoutItemsContainer) return; // Not on checkout page

    if (cart.length === 0) {
        window.location.href = 'index.html';
        return;
    }

    // Render Items with product images
    checkoutItemsContainer.innerHTML = cart.map(item => `
        <div class="summary-item">
            <div class="summary-product">
                <img src="${item.image}" alt="${item.title}">
                <div>
                    <div>${item.title}</div>
                    <div style="font-size: 0.9rem; color: var(--text-light);">${item.quantity} adet × ${formatCurrency(item.price)}</div>
                </div>
            </div>
            <span>${formatCurrency(item.price * item.quantity)}</span>
        </div>
    `).join('');

    // Calculate Total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    checkoutTotalElement.textContent = formatCurrency(total);

    // Input Validation for Card Fields
    const cardNumberInput = document.getElementById('card-number');
    const cardExpiryInput = document.getElementById('card-expiry');
    const cardCvcInput = document.getElementById('card-cvc');
    const phoneInput = document.getElementById('customer-phone');

    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(.{4})/g, '$1 ').trim();
            e.target.value = value.substring(0, 19);
        });
    }

    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value.substring(0, 5);
        });
    }

    if (cardCvcInput) {
        cardCvcInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = '0 (' + value.substring(0, 3) + ') ' + value.substring(3, 6) + ' ' + value.substring(6, 8) + ' ' + value.substring(8, 10);
            }
            e.target.value = value.substring(0, 19);
        });
    }

    // Handle Submit
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const customerName = document.getElementById('customer-name').value;
        const customerEmail = document.getElementById('customer-email').value;
        const customerPhone = document.getElementById('customer-phone').value;
        const customerAddress = document.getElementById('customer-address').value;
        const cardHolder = document.getElementById('card-holder').value;
        const cardNumber = document.getElementById('card-number').value;
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCvc = document.getElementById('card-cvc').value;

        // Simple validation
        if (!customerName || !customerEmail || !customerPhone || !customerAddress ||
            !cardHolder || !cardNumber || !cardExpiry || !cardCvc) {
            alert('Lütfen tüm alanları doldurun.');
            return;
        }

        // Validate card number (simple check)
        if (cardNumber.replace(/\s/g, '').length !== 16) {
            alert('Geçersiz kart numarası. 16 haneli olmalıdır.');
            return;
        }

        // Validate expiry date
        const expiryParts = cardExpiry.split('/');
        if (expiryParts.length !== 2 || expiryParts[0].length !== 2 || expiryParts[1].length !== 2) {
            alert('Geçersiz son kullanma tarihi formatı. AA/YY şeklinde olmalıdır.');
            return;
        }

        // Validate CVC
        if (cardCvc.length !== 3) {
            alert('Geçersiz CVC kodu. 3 haneli olmalıdır.');
            return;
        }

        // Create Order
        const customerInfo = {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            address: customerAddress,
            cardHolder: cardHolder
        };

        createOrder(customerInfo);

        // Clear Cart
        clearCart();

        // Redirect to Success Page
        window.location.href = 'success.html';
    });
};

// Add event delegation for better performance
document.addEventListener('click', function (e) {
    // Handle add to cart buttons
    if (e.target.closest('.add-to-cart')) {
        const button = e.target.closest('.add-to-cart');
        const productId = parseInt(button.dataset.productId);
        if (productId) {
            // Add visual feedback
            button.classList.add('pop-in');
            setTimeout(() => {
                button.classList.remove('pop-in');
            }, 300);
            addToCart(productId);
        }
    }

    // Handle wishlist buttons
    if (e.target.closest('.add-to-wishlist')) {
        const button = e.target.closest('.add-to-wishlist');
        const productId = parseInt(button.dataset.productId);
        if (productId) {
            // Add visual feedback
            button.classList.add('pop-in');
            setTimeout(() => {
                button.classList.remove('pop-in');
            }, 300);
            toggleWishlist(productId);
        }
    }

    // Handle compare buttons
    if (e.target.closest('.add-to-compare')) {
        const button = e.target.closest('.add-to-compare');
        const productId = parseInt(button.dataset.productId);
        if (productId) {
            // Add visual feedback
            button.classList.add('pop-in');
            setTimeout(() => {
                button.classList.remove('pop-in');
            }, 300);
            toggleCompare(productId);
        }
    }
});

// Lazy load images for better performance
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Call lazy load when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    lazyLoadImages();
});
