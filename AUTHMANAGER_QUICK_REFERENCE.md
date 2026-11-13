# AuthManager Module - Quick Reference Guide

## Overview
The AuthManager module provides secure authentication and role-based access control for the marketplace application. It uses the IIFE pattern for encapsulation and stores sessions in `sessionStorage`.

## Demo Credentials

### Admin Account
```
Username: admin
Password: 123456
Role: admin
```

### Staff Account
```
Username: staff
Password: staff123
Role: staff
```

## API Reference

### `AuthManager.login(username, password)`
Authenticate a user with credentials.

**Parameters:**
- `username` (string): Username
- `password` (string): Password

**Returns:**
- Success: Session object
  ```javascript
  {
    username: 'admin',
    role: 'admin',
    displayName: 'Administrator',
    loginTime: '2024-01-15T10:30:45.123Z'
  }
  ```
- Failure: `null`

**Example:**
```javascript
const session = AuthManager.login('admin', '123456');
if (session) {
    console.log('Logged in as:', session.displayName);
} else {
    console.log('Login failed');
}
```

---

### `AuthManager.logout()`
Clear the current user session.

**Parameters:** None

**Returns:** `undefined` (void)

**Example:**
```javascript
AuthManager.logout();
// Session is now cleared
```

---

### `AuthManager.isAuthenticated()`
Check if a user is currently logged in.

**Parameters:** None

**Returns:** 
- `true` if user is logged in
- `false` if user is not logged in

**Example:**
```javascript
if (AuthManager.isAuthenticated()) {
    console.log('User is logged in');
} else {
    console.log('User is not logged in');
}
```

---

### `AuthManager.getCurrentUser()`
Get information about the currently logged-in user.

**Parameters:** None

**Returns:**
- If authenticated:
  ```javascript
  {
    username: 'admin',
    role: 'admin',
    displayName: 'Administrator'
  }
  ```
- If not authenticated: `null`

**Example:**
```javascript
const user = AuthManager.getCurrentUser();
if (user) {
    console.log('Current user:', user.displayName);
    console.log('Role:', user.role);
} else {
    console.log('No user logged in');
}
```

---

### `AuthManager.hasRole(role)`
Check if the current user has a specific role.

**Parameters:**
- `role` (string): Role to check (e.g., 'admin', 'staff')

**Returns:**
- `true` if user is authenticated and has the role
- `false` otherwise

**Example:**
```javascript
if (AuthManager.hasRole('admin')) {
    // Show admin features
    document.getElementById('admin-panel').style.display = 'block';
} else {
    // Hide admin features
    document.getElementById('admin-panel').style.display = 'none';
}
```

---

## Common Usage Patterns

### Pattern 1: Protect Page on Load
```javascript
window.addEventListener('load', function() {
    if (!AuthManager.isAuthenticated()) {
        window.location.href = '/login.html';
    }
});
```

### Pattern 2: Display User Info in Header
```javascript
const user = AuthManager.getCurrentUser();
if (user) {
    document.getElementById('user-name').textContent = user.displayName;
    document.getElementById('user-role').textContent = user.role;
}
```

### Pattern 3: Show/Hide Admin Controls
```javascript
if (AuthManager.hasRole('admin')) {
    // Show admin button
    document.getElementById('admin-btn').style.display = 'block';
} else {
    // Hide admin button
    document.getElementById('admin-btn').style.display = 'none';
}
```

### Pattern 4: Handle Login Form Submission
```javascript
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username-input').value;
    const password = document.getElementById('password-input').value;
    
    const result = AuthManager.login(username, password);
    
    if (result) {
        // Login successful
        console.log('Welcome back, ' + result.displayName);
        window.location.href = '/dashboard.html';
    } else {
        // Login failed
        document.getElementById('error-msg').textContent = 'Username atau password salah';
        document.getElementById('password-input').value = '';
    }
});
```

### Pattern 5: Handle Logout Button
```javascript
document.getElementById('logout-btn').addEventListener('click', () => {
    AuthManager.logout();
    window.location.href = '/login.html';
});
```

---

## Technical Details

### Storage
- **Storage Type**: sessionStorage (not localStorage)
- **Storage Key**: 'marketplace_session'
- **Data Format**: JSON
- **Cleared**: Automatically when browser closes

### Encapsulation
The module uses the IIFE pattern to create private scope:
- Private: `SESSION_KEY`, `USERS`, helper functions
- Public: Only the 5 API methods listed above

### Error Handling
- All sessionStorage operations wrapped in try-catch
- Invalid credentials return `null` (not throw)
- Graceful fallback if storage fails

---

## Integration Checklist

- [ ] Include script tag in HTML: `<script src="js/auth-manager.js"></script>`
- [ ] Load AuthManager module BEFORE other auth-dependent scripts
- [ ] Implement login form with `AuthManager.login()`
- [ ] Protect pages with `AuthManager.isAuthenticated()`
- [ ] Display user info with `AuthManager.getCurrentUser()`
- [ ] Hide admin features with `!AuthManager.hasRole('admin')`
- [ ] Implement logout with `AuthManager.logout()`
- [ ] Test with provided credentials

---

## Troubleshooting

### Issue: AuthManager is undefined
**Solution**: Make sure the script tag loads auth-manager.js before other scripts:
```html
<script src="js/auth-manager.js"></script>
<script src="js/app.js"></script>
```

### Issue: Session clears unexpectedly
**Solution**: sessionStorage is cleared when the browser tab/window closes. This is expected behavior.

### Issue: Login always fails
**Solution**: Double-check credentials match exactly (case-sensitive):
- Admin: `admin` / `123456`
- Staff: `staff` / `staff123`

### Issue: User info not persisting
**Solution**: Make sure to call `AuthManager.login()` before checking `AuthManager.getCurrentUser()`

---

## Performance Notes

- All operations are synchronous (no async/await)
- Minimal overhead (no network calls)
- sessionStorage operations are very fast
- Suitable for real-time use without delays

---

## Security Notes

### Current (Demo)
- Passwords stored in source code
- No encryption
- No token-based authentication

### Recommendations for Production
1. Move credentials to backend
2. Use password hashing (bcrypt)
3. Implement JWT tokens
4. Add HTTPS/TLS
5. Use secure cookies instead of sessionStorage
6. Implement session expiration
7. Add CSRF protection
8. Rate limit login attempts

---

## Version History

**v1.0** - Initial implementation
- 5 public API methods
- sessionStorage persistence
- Admin and Staff roles
- IIFE pattern encapsulation

---

## Support

For issues or questions about the AuthManager module, refer to:
1. This quick reference guide
2. API documentation in code comments
3. Test files in `tests/` directory
4. Task completion report: `TASK_3_1_COMPLETION_REPORT.md`
