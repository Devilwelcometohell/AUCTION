// ========================================
// AUCTIONSPHERE - SHARED UTILITIES
// ========================================

// Initialize localStorage with default data if not exists
function initializeStorage() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify([]));
    }
    if (!localStorage.getItem('bids')) {
        localStorage.setItem('bids', JSON.stringify([]));
    }
}

// Get current logged in user
function getCurrentUser() {
    const userEmail = localStorage.getItem('currentUser');
    if (!userEmail) return null;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(u => u.email === userEmail);
}

// Update navigation based on login status
function updateNavigation() {
    const currentUser = getCurrentUser();
    const authLink = document.getElementById('authLink');
    const dashboardLink = document.getElementById('dashboardLink');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (currentUser) {
        if (authLink) authLink.style.display = 'none';
        if (dashboardLink) {
            dashboardLink.style.display = 'block';
            // Set dashboard link based on role
            if (currentUser.role === 'admin') {
                dashboardLink.href = 'admin.html';
                dashboardLink.textContent = 'Admin Dashboard';
            } else if (currentUser.role === 'seller') {
                dashboardLink.href = 'seller.html';
                dashboardLink.textContent = 'Seller Dashboard';
            } else {
                dashboardLink.href = 'auction.html';
                dashboardLink.textContent = 'Browse Auctions';
            }
        }
        if (logoutBtn) {
            logoutBtn.style.display = 'block';
            logoutBtn.onclick = logout;
        }
    } else {
        if (authLink) authLink.style.display = 'block';
        if (dashboardLink) dashboardLink.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Password validation (8+ characters, letters and numbers)
function isValidPassword(password) {
    if (password.length < 8) return false;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasLetter && hasNumber;
}

// UPI ID validation (basic format check)
function isValidUPI(upi) {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]+$/;
    return upiRegex.test(upi);
}

// Bank account validation (basic check for digits)
function isValidBankAccount(account) {
    return /^\d{9,18}$/.test(account);
}

// IFSC code validation
function isValidIFSC(ifsc) {
    return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);
}

// Format currency
function formatCurrency(amount) {
    return '₹' + parseFloat(amount).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Format date and time
function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Show alert message
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} fade-in`;
    alertDiv.textContent = message;
    
    const container = document.querySelector('.container') || document.body;
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Check if user is authorized to access page
function checkAuth(requiredRole = null) {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return false;
    }
    
    if (requiredRole && currentUser.role !== requiredRole) {
        showAlert('You do not have permission to access this page.', 'danger');
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

// Convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Initialize storage on page load
initializeStorage();

// Add default admin if none exists
function ensureDefaultAdmin() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const adminExists = users.some(u => u.role === 'admin');
    
    if (!adminExists) {
        const defaultAdmin = {
            id: generateId(),
            email: 'admin@auctionsphere.com',
            password: 'Admin123',
            role: 'admin',
            name: 'System Admin',
            createdAt: Date.now()
        };
        users.push(defaultAdmin);
        localStorage.setItem('users', JSON.stringify(users));
    }
}

ensureDefaultAdmin();

// Create demo data for testing (call this function from console if needed)
function createDemoData() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Create demo seller if doesn't exist
    if (!users.find(u => u.email === 'seller@demo.com')) {
        users.push({
            id: generateId(),
            email: 'seller@demo.com',
            password: 'Demo1234',
            role: 'seller',
            name: 'Demo Seller',
            upiId: 'demoseller@upi',
            createdAt: Date.now()
        });
    }
    
    // Create demo buyer if doesn't exist
    if (!users.find(u => u.email === 'buyer@demo.com')) {
        users.push({
            id: generateId(),
            email: 'buyer@demo.com',
            password: 'Demo1234',
            role: 'buyer',
            name: 'Demo Buyer',
            bankAccount: '1234567890',
            ifscCode: 'DEMO0001234',
            bankName: 'Demo Bank',
            createdAt: Date.now()
        });
    }
    
    localStorage.setItem('users', JSON.stringify(users));
    
    // Create demo products
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const demoSeller = users.find(u => u.email === 'seller@demo.com');
    
    if (demoSeller && products.length === 0) {
        const demoProducts = [
            {
                id: generateId(),
                name: 'Premium Windsurf Board',
                description: 'High-performance windsurf board perfect for advanced riders. Excellent condition.',
                startingBid: 5000,
                currentBid: 5000,
                image: null,
                sellerId: demoSeller.id,
                sellerName: demoSeller.name,
                sellerUPI: demoSeller.upiId,
                status: 'approved',
                createdAt: Date.now() - 3600000,
                approvedAt: Date.now() - 1800000,
                auctionDuration: 0.0833,
                auctionEndTime: Date.now() + (5 * 60 * 1000)
            },
            {
                id: generateId(),
                name: 'Carbon Fiber Sail',
                description: 'Lightweight carbon fiber sail, 7.5m, barely used. Great for racing.',
                startingBid: 3000,
                currentBid: 3000,
                image: null,
                sellerId: demoSeller.id,
                sellerName: demoSeller.name,
                sellerUPI: demoSeller.upiId,
                status: 'approved',
                createdAt: Date.now() - 7200000,
                approvedAt: Date.now() - 3600000,
                auctionDuration: 0.25,
                auctionEndTime: Date.now() + (15 * 60 * 1000)
            }
        ];
        
        products.push(...demoProducts);
        localStorage.setItem('products', JSON.stringify(products));
    }
    
    console.log('Demo data created successfully!');
    console.log('Demo Seller: seller@demo.com / Demo1234');
    console.log('Demo Buyer: buyer@demo.com / Demo1234');
    console.log('Admin: admin@auctionsphere.com / Admin123');
    
    return {
        message: 'Demo data created! Check console for login credentials.',
        seller: 'seller@demo.com / Demo1234',
        buyer: 'buyer@demo.com / Demo1234',
        admin: 'admin@auctionsphere.com / Admin123'
    };
}

// Make it available globally for console access
window.createDemoData = createDemoData;
