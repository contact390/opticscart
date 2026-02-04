// Update navbar with user info on page load
document.addEventListener('DOMContentLoaded', function() {
    updateNavbarWithUserInfo();
});

function updateNavbarWithUserInfo() {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const firstName = localStorage.getItem('firstName');

    if (username && email) {
        // Find the Sign In/Up link and replace it
        const signInLink = document.querySelector('a[href="signup.html"][class*="user-action-link"]');
        const mobileSignInLink = document.querySelector('a[href="signup.html"][class*="mobile"]');

        if (signInLink) {
            signInLink.innerHTML = `👤 ${firstName || username}`;
            signInLink.href = '#';
            signInLink.onclick = (e) => {
                e.preventDefault();
                window.location.href = 'profile.html';
            };
            signInLink.style.cursor = 'pointer';
            signInLink.style.position = 'relative';

            // Add dropdown on hover
            signInLink.addEventListener('mouseenter', function() {
                showUserDropdown(signInLink, firstName, email);
            });
        }

        // Also update mobile version if it exists
        const mobileUserActions = document.querySelector('.mobile-user-actions');
        if (mobileUserActions) {
            const mobileLink = mobileUserActions.querySelector('a[href="signup.html"]');
            if (mobileLink) {
                mobileLink.innerHTML = `👤 ${firstName || username}`;
                mobileLink.href = 'profile.html';
            }
        }
    }
}

function showUserDropdown(element, firstName, email) {
    // Remove existing dropdown if any
    const existingDropdown = document.querySelector('.user-dropdown-menu');
    if (existingDropdown) {
        existingDropdown.remove();
    }

    const dropdown = document.createElement('div');
    dropdown.className = 'user-dropdown-menu';
    dropdown.innerHTML = `
        <div style="padding: 15px 20px; border-bottom: 1px solid #e2e8f0;">
            <div style="font-weight: 600; color: #2d3748;">${firstName || 'User'}</div>
            <div style="font-size: 12px; color: #718096;">${email}</div>
        </div>
        <a href="profile.html" style="display: block; padding: 12px 20px; text-decoration: none; color: #4a5568; transition: all 0.2s; border-bottom: 1px solid #e2e8f0;">👤 My Profile</a>
        <a href="whishlist.html" style="display: block; padding: 12px 20px; text-decoration: none; color: #4a5568; transition: all 0.2s; border-bottom: 1px solid #e2e8f0;">❤️ Wishlist</a>
        <a href="trackorder.html" style="display: block; padding: 12px 20px; text-decoration: none; color: #4a5568; transition: all 0.2s; border-bottom: 1px solid #e2e8f0;">📦 Track Orders</a>
        <a href="#" onclick="logoutUser(event)" style="display: block; padding: 12px 20px; text-decoration: none; color: #f56565; transition: all 0.2s;">🚪 Logout</a>
    `;

    dropdown.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        min-width: 250px;
        margin-top: 10px;
        z-index: 1001;
    `;

    element.parentElement.style.position = 'relative';
    element.parentElement.appendChild(dropdown);

    // Remove dropdown when mouse leaves
    setTimeout(() => {
        element.parentElement.addEventListener('mouseleave', function() {
            const dd = this.querySelector('.user-dropdown-menu');
            if (dd) dd.remove();
        });
    }, 100);
}

function logoutUser(event) {
    event.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('firstName');
        localStorage.removeItem('email');
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }
}
