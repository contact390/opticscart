// Cart Utilities - Update cart count across all pages

function updateCartCountDisplay() {
    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCounts = document.querySelectorAll('.cart-count');
        
        // Calculate total items
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        
        // Update all cart count displays
        cartCounts.forEach(countElement => {
            countElement.textContent = `[${totalItems}]`;
        });
    } catch (e) {
        console.log('Cart count update error:', e);
    }
}

// Update cart count when page loads
document.addEventListener('DOMContentLoaded', updateCartCountDisplay);

// Listen for storage changes (from other tabs/windows)
window.addEventListener('storage', updateCartCountDisplay);
