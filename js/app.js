/**
 * app.js - Main application file
 * 
 * This is the entry point that coordinates all modules.
 * Responsibilities:
 * - Initialize authentication
 * - Set up routing/navigation
 * - Coordinate module interactions
 * - Handle application lifecycle
 * - Manage accessibility features (Task 13.3)
 * 
 * Implemented in Task 3.2: Login UI Component
 * Enhanced in Task 13.3: Accessibility Features
 */

// ============================================
// Accessibility Features (Task 13.3)
// ============================================

/**
 * Initialize accessibility features
 */
function initializeAccessibility() {
    // Handle skip links
    const skipLinks = document.querySelectorAll('.skip-to-main, .skip-to-search');
    skipLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.focus();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Set proper tab index for elements that need keyboard navigation
    const kpiCards = document.querySelectorAll('.kpi-card');
    kpiCards.forEach((card, index) => {
        card.addEventListener('keydown', function(e) {
            // Allow Enter or Space to "activate" a KPI card (for future interactions)
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // Card can be focused but no action needed yet
                card.classList.add('focused');
            }
        });
    });
    
    // Ensure all buttons have proper focus indicators
    const buttons = document.querySelectorAll('button, [role="button"]');
    buttons.forEach(button => {
        button.addEventListener('focus', function() {
            this.classList.add('focused');
        });
        button.addEventListener('blur', function() {
            this.classList.remove('focused');
        });
    });
    
    // Handle form error announcements for screen readers
    setupFormAccessibility();
}

/**
 * Set up form accessibility features
 */
function setupFormAccessibility() {
    const form = document.getElementById('transaction-form');
    if (form) {
        // Add proper aria-invalid attributes to form inputs
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            // Set initial aria-invalid to false
            input.setAttribute('aria-invalid', 'false');
            
            // Update aria-invalid on change
            input.addEventListener('change', function() {
                // This will be handled by validation in actual form handler
                this.setAttribute('aria-invalid', 'false');
            });
            
            // Ensure all inputs have proper descriptions
            if (!input.getAttribute('aria-describedby')) {
                const errorId = input.id + '-error';
                const existingError = document.getElementById(errorId);
                if (existingError) {
                    input.setAttribute('aria-describedby', errorId);
                }
            }
        });
    }
}

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
function announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement is made (usually 1 second)
    setTimeout(() => {
        announcement.remove();
    }, 1000);
}

// ============================================
// UI State Management
// ============================================

/**
 * Update UI based on authentication state
 */
function updateUIBasedOnAuthState() {
    const isAuthenticated = AuthManager.isAuthenticated();
    const loginSection = document.getElementById('login-section');
    const dashboard = document.getElementById('dashboard');
    
    if (isAuthenticated) {
        // Hide login form, show dashboard
        loginSection.style.display = 'none';
        dashboard.style.display = 'block';
        
        // Show navigation menu
        NavigationManager.showNavigation();
        
        // Announce to screen readers
        announceToScreenReader('Login berhasil. Dashboard dimuat.', 'polite');
    } else {
        // Show login form, hide dashboard
        loginSection.style.display = 'block';
        dashboard.style.display = 'none';
        
        // Hide navigation menu
        NavigationManager.hideNavigation();
        
        // Focus on username input for better UX
        const usernameInput = document.getElementById('username-input');
        if (usernameInput) {
            setTimeout(() => usernameInput.focus(), 100);
        }
    }
}

// ============================================
// Login Form Handlers
// ============================================

/**
 * Handle login form submission
 * @param {Event} event - Form submission event
 */
function handleLoginSubmit(event) {
    event.preventDefault();
    
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');
    const errorMsg = document.getElementById('login-error-msg');
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    // Clear previous error messages
    errorMsg.textContent = '';
    errorMsg.style.display = 'none';
    errorMsg.setAttribute('aria-live', 'assertive');
    
    // Attempt login
    const session = AuthManager.login(username, password);
    
    if (session) {
        // Login successful
        // Clear form fields
        usernameInput.value = '';
        passwordInput.value = '';
        
        // Update UI
        updateUIBasedOnAuthState();
    } else {
        // Login failed
        const errorText = 'Username atau password salah. Coba lagi!';
        errorMsg.textContent = errorText;
        errorMsg.style.display = 'block';
        errorMsg.setAttribute('role', 'alert');
        
        // Announce error to screen readers
        announceToScreenReader(errorText, 'assertive');
        
        // Clear password field for security
        passwordInput.value = '';
        
        // Return focus to username field
        usernameInput.focus();
        usernameInput.setAttribute('aria-invalid', 'true');
    }
}

/**
 * Handle logout button click
 */
function handleLogout() {
    // Call logout on AuthManager
    AuthManager.logout();
    
    // Clear form fields for security
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');
    const errorMsg = document.getElementById('login-error-msg');
    
    if (usernameInput) {
        usernameInput.value = '';
        usernameInput.setAttribute('aria-invalid', 'false');
    }
    if (passwordInput) passwordInput.value = '';
    if (errorMsg) {
        errorMsg.textContent = '';
        errorMsg.style.display = 'none';
    }
    
    // Update UI to show login form
    updateUIBasedOnAuthState();
    
    // Announce logout
    announceToScreenReader('Anda telah keluar dari aplikasi.', 'polite');
}

// ============================================
// Real-Time Field Validation (Task 8.2)
// ============================================

/**
 * Display error message for a field
 * @param {string} fieldName - Name of the field
 * @param {string[]} errors - Array of error messages
 */
function displayFieldError(fieldName, errors) {
    const field = document.getElementById(fieldName);
    const errorContainer = document.getElementById(`${fieldName}-error`);
    
    if (!field || !errorContainer) return;
    
    if (errors.length > 0) {
        // Field has errors
        field.classList.add('error-field');
        field.setAttribute('aria-invalid', 'true');
        errorContainer.textContent = errors[0]; // Display first error
        errorContainer.style.display = 'block';
        errorContainer.setAttribute('role', 'alert');
    } else {
        // Field is valid
        field.classList.remove('error-field');
        field.setAttribute('aria-invalid', 'false');
        errorContainer.textContent = '';
        errorContainer.style.display = 'none';
    }
}

/**
 * Validate a single field on blur or input
 * @param {string} fieldName - Name of the field
 * @param {*} value - Value to validate
 */
function validateField(fieldName, value) {
    const result = ValidationEngine.validate(fieldName, value);
    displayFieldError(fieldName, result.errors);
    return result.valid;
}

/**
 * Set up real-time field validation for all form fields
 * Attaches blur event listeners to validate on blur
 * Attaches input event listeners for real-time feedback
 */
function setupFieldValidation() {
    const form = document.getElementById('transaction-form');
    if (!form) return;
    
    // List of all form fields that exist in the HTML
    const fieldNames = [
        'namaBarang',
        'kategoriBarang',
        'hargaBarang',
        'kuantitas',
        'varianBarang',
        'ongkir',
        'sisaBayar',
        'totalBelanja',
        'namaPembeli',
        'noTelp',
        'idPelanggan',
        'alamat'
    ];
    
    fieldNames.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (!field) return;
        
        // Skip readonly fields (totalBelanja, idPelanggan)
        if (field.hasAttribute('readonly')) return;
        
        // Validate on blur (user leaves the field)
        field.addEventListener('blur', function() {
            const value = this.type === 'number' && this.value === '' ? '' : this.value;
            validateField(fieldName, value);
        });
        
        // Validate on input for immediate feedback (optional fields update as they type)
        field.addEventListener('input', function() {
            const rules = ValidationEngine.getFieldRules(fieldName);
            if (!rules || rules.required === false) {
                // For optional fields, only validate if they have content
                if (this.value.trim()) {
                    const value = this.type === 'number' && this.value === '' ? '' : this.value;
                    validateField(fieldName, value);
                } else {
                    // Clear error for empty optional field
                    const errorContainer = document.getElementById(`${fieldName}-error`);
                    if (errorContainer) {
                        this.classList.remove('error-field');
                        this.setAttribute('aria-invalid', 'false');
                        errorContainer.textContent = '';
                        errorContainer.style.display = 'none';
                    }
                }
            }
        });
    });
}

/**
 * Validate entire transaction form
 * @returns {boolean} true if all fields are valid
 */
function validateTransactionForm() {
    const form = document.getElementById('transaction-form');
    if (!form) return false;
    
    // Get all form field values
    const formData = {
        namaBarang: document.getElementById('namaBarang')?.value || '',
        kategoriBarang: document.getElementById('kategoriBarang')?.value || '',
        hargaBarang: document.getElementById('hargaBarang')?.value || '',
        kuantitas: document.getElementById('kuantitas')?.value || '',
        varianBarang: document.getElementById('varianBarang')?.value || '',
        ongkir: document.getElementById('ongkir')?.value || '',
        sisaBayar: document.getElementById('sisaBayar')?.value || '',
        totalBelanja: document.getElementById('totalBelanja')?.value || '',
        namaPembeli: document.getElementById('namaPembeli')?.value || '',
        noTelp: document.getElementById('noTelp')?.value || '',
        idPelanggan: document.getElementById('idPelanggan')?.value || '',
        alamat: document.getElementById('alamat')?.value || '',
        status: document.getElementById('status')?.value || ''
    };
    
    // Validate entire form
    const result = ValidationEngine.validateForm(formData);
    
    // Display errors for all invalid fields
    for (const fieldName in result.errors) {
        displayFieldError(fieldName, result.errors[fieldName]);
    }
    
    // Clear errors for valid fields
    const allFields = ['namaBarang', 'kategoriBarang', 'hargaBarang', 'kuantitas', 
                       'varianBarang', 'ongkir', 'sisaBayar', 'namaPembeli', 
                       'noTelp', 'alamat', 'status'];
    allFields.forEach(fieldName => {
        if (!result.errors[fieldName]) {
            const errorContainer = document.getElementById(`${fieldName}-error`);
            const field = document.getElementById(fieldName);
            if (errorContainer && field) {
                field.classList.remove('error-field');
                field.setAttribute('aria-invalid', 'false');
                errorContainer.textContent = '';
                errorContainer.style.display = 'none';
            }
        }
    });
    
    return result.valid;
}

/**
 * Highlight all invalid fields before form submission
 * @returns {string[]} Array of invalid field names
 */
function highlightInvalidFields() {
    const invalidFields = [];
    const form = document.getElementById('transaction-form');
    if (!form) return invalidFields;
    
    const fieldNames = [
        'namaBarang',
        'kategoriBarang',
        'hargaBarang',
        'kuantitas',
        'varianBarang',
        'ongkir',
        'sisaBayar',
        'namaPembeli',
        'noTelp',
        'alamat'
    ];
    
    fieldNames.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (!field) return;
        
        // Get current value
        const value = field.type === 'number' && field.value === '' ? '' : field.value;
        
        // Validate field
        const result = ValidationEngine.validate(fieldName, value);
        
        if (!result.valid) {
            invalidFields.push(fieldName);
            displayFieldError(fieldName, result.errors);
        } else {
            displayFieldError(fieldName, []);
        }
    });
    
    // If there are invalid fields, scroll to the first one
    if (invalidFields.length > 0) {
        const firstInvalidField = document.getElementById(invalidFields[0]);
        if (firstInvalidField) {
            firstInvalidField.focus();
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    return invalidFields;
}

/**
 * Clear all form field errors
 */
function clearFormErrors() {
    const form = document.getElementById('transaction-form');
    if (!form) return;
    
    const errorContainers = form.querySelectorAll('.error-message');
    errorContainers.forEach(container => {
        container.textContent = '';
        container.style.display = 'none';
    });
    
    const errorFields = form.querySelectorAll('.error-field');
    errorFields.forEach(field => {
        field.classList.remove('error-field');
        field.setAttribute('aria-invalid', 'false');
    });
}

/**
 * Set form mode (new or edit)
 * Updates UI to indicate which mode the form is in
 * @param {string} mode - 'new' or 'edit'
 * @param {string} customerId - Customer ID if in edit mode
 */
function setFormMode(mode, customerId = null) {
    const form = document.getElementById('transaction-form');
    const submitBtn = document.querySelector('#transaction-form button[type="submit"]');
    const resetBtn = document.querySelector('#transaction-form button[type="reset"]');
    
    if (!form || !submitBtn) return;
    
    if (mode === 'edit' && customerId) {
        // Edit mode
        form.dataset.mode = 'edit';
        form.dataset.customerId = customerId;
        
        // Update submit button text and styling
        submitBtn.textContent = 'Perbarui Transaksi';
        submitBtn.setAttribute('aria-label', 'Tombol untuk memperbarui data transaksi pelanggan yang sudah ada');
        submitBtn.classList.add('btn-update');
        submitBtn.classList.remove('btn-submit');
        
        // Disable reset button in edit mode (optional)
        if (resetBtn) {
            resetBtn.disabled = true;
            resetBtn.style.opacity = '0.5';
        }
        
        // Add visual indicator that form is in edit mode
        form.classList.add('form-edit-mode');
        form.classList.remove('form-new-mode');
        
    } else {
        // New mode (default)
        form.dataset.mode = 'new';
        form.dataset.customerId = null;
        
        // Reset submit button
        submitBtn.textContent = 'Simpan Transaksi';
        submitBtn.setAttribute('aria-label', 'Tombol untuk menyimpan transaksi pelanggan baru');
        submitBtn.classList.remove('btn-update');
        submitBtn.classList.add('btn-submit');
        
        // Enable reset button
        if (resetBtn) {
            resetBtn.disabled = false;
            resetBtn.style.opacity = '1';
        }
        
        // Remove edit mode styling
        form.classList.remove('form-edit-mode');
        form.classList.add('form-new-mode');
    }
}

/**
 * Reset form to new mode
 */
function resetFormToNewMode() {
    const form = document.getElementById('transaction-form');
    if (form) {
        form.reset();
        setFormMode('new');
        clearFormErrors();
    }
}

// ============================================
// Search Form Handlers (Task 9.2)
// ============================================

/**
 * Handle search form submission
 * @param {Event} event - Form submission event
 */
async function handleSearchSubmit(event) {
    event.preventDefault();
    
    const searchInput = document.getElementById('search-input');
    
    if (!searchInput) {
        console.warn('Search input not found');
        return;
    }
    
    const searchQuery = searchInput.value.trim();
    
    // Clear previous results
    SearchManager.clearResults();
    
    if (!searchQuery) {
        // Show empty message if no search query provided
        const emptyState = document.getElementById('search-empty-state');
        if (emptyState) {
            emptyState.style.display = 'block';
            emptyState.textContent = 'Masukkan kriteria pencarian terlebih dahulu';
        }
        return;
    }
    
    try {
        // Show loading indicator on search results container (Task 14.3)
        const resultsContainer = document.getElementById('search-results');
        const loadingOperationId = LoadingManager.showElementLoading(
            '#search-results',
            'Mencari pelanggan...',
            30000
        );
        
        // Perform search using CustomerManager.search()
        // Search across ID, customer name, phone, and item name fields
        const results = await CustomerManager.search({
            value: searchQuery,
            exact: false  // Allow partial matching
        });
        
        // Hide loading indicator (Task 14.3)
        if (loadingOperationId) {
            LoadingManager.hideElementLoading(loadingOperationId);
        }
        
        // Display results with edit/delete callbacks
        SearchManager.displayResults(results, {
            onEdit: handleSearchEditClick,
            onDelete: handleSearchDeleteClick
        });
        
    } catch (error) {
        console.error('Error during search:', error);
        
        // Hide loading indicator on error
        const loadingElement = document.querySelector('#search-results.loading');
        if (loadingElement) {
            LoadingManager.hideElementLoading();
        }
        
        // Show error message
        const resultsContainer = document.getElementById('search-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = '<p class="error-message">Terjadi kesalahan saat mencari. Silakan coba lagi.</p>';
        }
        
        // Announce error to screen readers
        if (window.announceToScreenReader) {
            window.announceToScreenReader('Terjadi kesalahan saat mencari pelanggan', 'assertive');
        }
    }
}

/**
 * Handle edit button click from search results
 * Loads customer record into transaction form for editing
 * @param {string} customerId - ID of customer to edit
 */
async function handleSearchEditClick(customerId) {
    try {
        // Load customer data from storage
        const customer = await CustomerManager.read(customerId);
        
        if (!customer) {
            NotificationManager.error('Pelanggan tidak ditemukan');
            return;
        }
        
        // Clear any previous form errors
        clearFormErrors();
        
        // Populate form with customer data
        document.getElementById('namaBarang').value = customer.namaBarang || '';
        document.getElementById('kategoriBarang').value = customer.kategoriBarang || '';
        document.getElementById('hargaBarang').value = customer.hargaBarang || '';
        document.getElementById('kuantitas').value = customer.kuantitas || '';
        document.getElementById('varianBarang').value = customer.varianBarang || '';
        document.getElementById('ongkir').value = customer.ongkir || '';
        document.getElementById('sisaBayar').value = customer.sisaBayar || '';
        document.getElementById('totalBelanja').value = customer.totalBelanja || '';
        document.getElementById('namaPembeli').value = customer.namaPembeli || '';
        document.getElementById('noTelp').value = customer.noTelp || '';
        document.getElementById('idPelanggan').value = customer.idPelanggan || '';
        document.getElementById('alamat').value = customer.alamat || '';
        
        // Set form mode to edit
        setFormMode('edit', customerId);
        
        // Navigate to form section
        NavigationManager.navigateTo('/form');
        
        // Scroll to form and focus
        const form = document.getElementById('transaction-form');
        if (form) {
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Focus on first editable field
            document.getElementById('namaBarang').focus();
        }
        
        // Show success notification
        NotificationManager.success('Data pelanggan berhasil dimuat. Silakan perbarui data dan simpan.');
        
        // Announce to screen readers
        announceToScreenReader(`Data pelanggan ${customer.namaPembeli} dimuat dalam formulir untuk diedit`, 'polite');
        
    } catch (error) {
        console.error('Error loading customer for edit:', error);
        NotificationManager.error('Gagal memuat data pelanggan. Silakan coba lagi.');
        announceToScreenReader('Gagal memuat data pelanggan untuk diedit', 'assertive');
    }
}

/**
 * Handle delete button click from search results
 * Shows confirmation dialog before deleting customer record
 * @param {string} customerId - ID of customer to delete
 */
async function handleSearchDeleteClick(customerId) {
    try {
        // Load customer to get name for confirmation
        const customer = await CustomerManager.read(customerId);
        
        if (!customer) {
            NotificationManager.error('Pelanggan tidak ditemukan');
            return;
        }
        
        const customerName = customer.namaPembeli || 'pelanggan ini';
        
        // Show confirmation dialog with Indonesian message
        const confirmed = confirm(
            `Apakah Anda yakin ingin menghapus data pelanggan ${customerName}?\n\n` +
            `ID: ${customer.idPelanggan}\n` +
            `Total Belanja: ${CalculationEngine.formatCurrency(customer.totalBelanja)}\n\n` +
            'Tindakan ini tidak dapat dibatalkan.'
        );
        
        if (!confirmed) {
            // User cancelled deletion
            announceToScreenReader('Penghapusan data pelanggan dibatalkan', 'polite');
            return;
        }
        
        // Delete customer from storage
        const success = await CustomerManager.delete(customerId);
        
        if (success) {
            // Show success notification
            NotificationManager.success(`Data pelanggan ${customerName} berhasil dihapus`);
            
            announceToScreenReader(`Data pelanggan ${customerName} telah dihapus`, 'polite');
            
            // Refresh search results if search query exists
            const searchInput = document.getElementById('search-input');
            if (searchInput && searchInput.value.trim()) {
                // Re-execute search to refresh results
                const searchEvent = new Event('submit', { bubbles: true });
                document.getElementById('search-form').dispatchEvent(searchEvent);
            } else {
                // Clear results if no search query
                SearchManager.clearResults();
            }
        } else {
            // Deletion failed
            NotificationManager.error('Gagal menghapus data pelanggan. Silakan coba lagi.');
            announceToScreenReader('Gagal menghapus data pelanggan', 'assertive');
        }
        
    } catch (error) {
        console.error('Error deleting customer:', error);
        NotificationManager.error('Terjadi kesalahan saat menghapus data pelanggan.');
        announceToScreenReader('Terjadi kesalahan saat menghapus data pelanggan', 'assertive');
    }
}

// ============================================
// Event Listeners Setup
// ============================================

/**
 * Handle transaction form submission (Task 8.2 & 8.4)
 * Validates all fields before allowing submission
 * Supports both create (new) and update (edit) modes
 * 
 * Enhanced with loading states (Task 14.3):
 * - Show button loading spinner during submission
 * - Disable form buttons during operation
 * - Display "Memproses..." message
 * - Auto-clear loading state on completion/error
 * - Handle timeout scenarios (30s max)
 */
async function handleTransactionFormSubmit(event) {
    event.preventDefault();
    
    const form = document.getElementById('transaction-form');
    const submitBtn = document.querySelector('#transaction-form button[type="submit"]');
    
    // Validate entire form before submission
    if (!validateTransactionForm()) {
        // Highlight all invalid fields
        const invalidFields = highlightInvalidFields();
        
        // Show error notification
        if (invalidFields.length > 0) {
            const errorMessage = invalidFields.length === 1
                ? `Silakan perbaiki 1 bidang yang berisi kesalahan sebelum melanjutkan.`
                : `Silakan perbaiki ${invalidFields.length} bidang yang berisi kesalahan sebelum melanjutkan.`;
            
            NotificationManager.error(errorMessage);
            
            // Announce to screen readers
            announceToScreenReader(
                `Formulir memiliki ${invalidFields.length} kesalahan. Silakan perbaiki sebelum mengirim.`,
                'assertive'
            );
        }
        return;
    }
    
    // Show loading state on submit button (Task 14.3)
    let loadingOperationId = null;
    if (submitBtn) {
        loadingOperationId = LoadingManager.showButtonLoading(submitBtn, 30000);
    }
    
    try {
        // Gather form data
        const formData = {
            namaBarang: document.getElementById('namaBarang')?.value || '',
            kategoriBarang: document.getElementById('kategoriBarang')?.value || '',
            hargaBarang: parseFloat(document.getElementById('hargaBarang')?.value || 0),
            kuantitas: parseInt(document.getElementById('kuantitas')?.value || 0),
            varianBarang: document.getElementById('varianBarang')?.value || '',
            ongkir: parseFloat(document.getElementById('ongkir')?.value || 0),
            sisaBayar: parseFloat(document.getElementById('sisaBayar')?.value || 0),
            totalBelanja: parseFloat(document.getElementById('totalBelanja')?.value || 0),
            namaPembeli: document.getElementById('namaPembeli')?.value || '',
            noTelp: document.getElementById('noTelp')?.value || '',
            alamat: document.getElementById('alamat')?.value || ''
        };
        
        // Determine if we're in edit or new mode
        const mode = form.dataset.mode || 'new';
        const customerId = form.dataset.customerId || null;
        
        let result = null;
        let successMessage = '';
        
        if (mode === 'edit' && customerId) {
            // Update existing customer
            result = await CustomerManager.update(customerId, formData);
            successMessage = `Data pelanggan ${formData.namaPembeli} berhasil diperbarui`;
        } else {
            // Create new customer
            result = await CustomerManager.create(formData);
            successMessage = `Data pelanggan ${formData.namaPembeli} berhasil disimpan`;
        }
        
        if (result) {
            // Show success notification
            NotificationManager.success(successMessage);
            
            // Announce to screen readers
            announceToScreenReader(successMessage, 'polite');
            
            // Reset form to new mode
            resetFormToNewMode();
            
            // Refresh charts if analytics are currently displayed (Task 11.3)
            if (NavigationManager.getCurrentRoute && NavigationManager.getCurrentRoute() === '/analytics') {
                await ChartManager.refreshData();
            }
            
            // Navigate to dashboard to show updated KPIs
            setTimeout(() => {
                NavigationManager.navigateTo('/');
                DashboardManager.refreshData();
            }, 500);
            
        } else {
            // Operation failed
            const errorMessage = mode === 'edit'
                ? 'Gagal memperbarui data pelanggan. Silakan coba lagi.'
                : 'Gagal menyimpan data pelanggan. Silakan coba lagi.';
            
            NotificationManager.error(errorMessage);
            announceToScreenReader(errorMessage, 'assertive');
        }
        
    } catch (error) {
        console.error('Error during form submission:', error);
        
        // Handle specific error types
        if (error.message && error.message.includes('QuotaExceededError')) {
            NotificationManager.error(
                'Penyimpanan penuh. Silakan hapus beberapa data lama atau ekspor ke CSV sebelum menambah data baru.'
            );
        } else {
            NotificationManager.error(
                'Terjadi kesalahan saat menyimpan data. Silakan coba lagi atau hubungi dukungan.'
            );
        }
        
        announceToScreenReader('Terjadi kesalahan saat memproses form', 'assertive');
        
    } finally {
        // Hide loading state from submit button (Task 14.3)
        if (loadingOperationId) {
            LoadingManager.hideButtonLoading(loadingOperationId);
        }
    }
}

// ============================================
// Auto-Calculation of Total Belanja (Task 8.3)
// ============================================

/**
 * Calculate and update Total Belanja field
 * Formula: Total Belanja = (Kuantitas × Harga Barang) + Ongkir + Sisa Bayar
 * 
 * Triggers on change of:
 * - Harga Barang (unit price)
 * - Kuantitas (quantity)
 * - Ongkir (shipping cost)
 * - Sisa Bayar (remaining payment)
 */
function updateTotalBelanja() {
    try {
        // Get values from form fields
        const kuantitas = parseFloat(document.getElementById('kuantitas')?.value || 0);
        const hargaBarang = parseFloat(document.getElementById('hargaBarang')?.value || 0);
        const ongkir = parseFloat(document.getElementById('ongkir')?.value || 0);
        const sisaBayar = parseFloat(document.getElementById('sisaBayar')?.value || 0);
        
        // Calculate using CalculationEngine
        // Formula: (Quantity × Price) + Shipping + Remaining Payment
        const subtotal = (kuantitas * hargaBarang) + ongkir + sisaBayar;
        
        // Ensure non-negative total
        const total = Math.max(0, subtotal);
        
        // Update the totalBelanja field with formatted currency
        const totalBelanja = document.getElementById('totalBelanja');
        if (totalBelanja) {
            // Set raw numeric value
            totalBelanja.value = total;
            
            // Update display with formatted currency (optional, for better UX)
            // The field will display the numeric value, but could be formatted
            // This allows the value to be submitted as a number
        }
        
        // Optional: Update a display element with formatted currency
        // This helps users see the currency format while the field stays numeric
        const totalBelanjaCurrency = CalculationEngine.formatCurrency(total);
        // Could display this in a label or helper text if needed
        
        return total;
    } catch (error) {
        console.error('Error calculating Total Belanja:', error);
        
        // Reset to 0 on error
        const totalBelanja = document.getElementById('totalBelanja');
        if (totalBelanja) {
            totalBelanja.value = 0;
        }
        
        return 0;
    }
}

/**
 * Set up auto-calculation event listeners
 * Attaches input event listeners to calculation-dependent fields
 */
function setupAutoCalculation() {
    const form = document.getElementById('transaction-form');
    if (!form) return;
    
    // Fields that trigger recalculation
    const calculationFields = [
        'hargaBarang',    // Harga Barang (unit price)
        'kuantitas',      // Kuantitas (quantity)
        'ongkir',         // Ongkir (shipping)
        'sisaBayar'       // Sisa Bayar (remaining payment)
    ];
    
    // Attach input event listeners to each calculation field
    calculationFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (!field) return;
        
        // Trigger calculation on input (real-time as user types)
        field.addEventListener('input', function() {
            updateTotalBelanja();
        });
        
        // Also trigger on change (for programmatic updates)
        field.addEventListener('change', function() {
            updateTotalBelanja();
        });
        
        // Also trigger on blur (when user leaves the field)
        field.addEventListener('blur', function() {
            updateTotalBelanja();
        });
    });
}

/**
 * Handle export button click (Task 12.1)
 * Exports all customer data to CSV file
 */
async function handleExportClick() {
    try {
        const success = await ExportManager.exportToCSV();
        if (success) {
            announceToScreenReader('Data pelanggan berhasil diekspor ke file CSV', 'polite');
        }
    } catch (error) {
        console.error('Error during export:', error);
        NotificationManager.error('Gagal mengekspor data pelanggan');
        announceToScreenReader('Gagal mengekspor data pelanggan', 'assertive');
    }
}

/**
 * Handle import button click (Task 12.1)
 * Opens file picker for CSV import
 */
function handleImportClick() {
    const fileInput = document.getElementById('import-file-input');
    if (fileInput) {
        fileInput.click();
    }
}

/**
 * Handle import file selection (Task 12.1)
 * Processes the selected CSV file for import
 */
async function handleImportFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
        // Show loading state
        NotificationManager.info('Memproses file CSV...');
        
        // Import the CSV file
        const result = await ExportManager.importFromCSV(file);
        
        // Refresh dashboard if import was successful
        if (result.success > 0) {
            // Refresh KPI data
            await DashboardManager.renderKPIs();
            
            // Refresh charts if they're visible
            const analyticsSection = document.getElementById('analytics-section');
            if (analyticsSection && analyticsSection.style.display !== 'none') {
                await ChartManager.refreshData();
            }
            
            announceToScreenReader(
                `${result.success} data berhasil diimpor dari file CSV`,
                'polite'
            );
        }
        
        // Clear file input
        event.target.value = '';
    } catch (error) {
        console.error('Error during import:', error);
        NotificationManager.error('Gagal mengimpor data pelanggan');
        announceToScreenReader('Gagal mengimpor data pelanggan', 'assertive');
        
        // Clear file input
        event.target.value = '';
    }
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const searchForm = document.getElementById('search-form');
    const transactionForm = document.getElementById('transaction-form');
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const importFileInput = document.getElementById('import-file-input');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Set up search form submission handler (Task 9.2)
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearchSubmit);
    }
    
    // Set up transaction form submission handler (Task 8.2 & 8.4)
    if (transactionForm) {
        transactionForm.addEventListener('submit', handleTransactionFormSubmit);
    }
    
    // Set up export button handler (Task 12.1)
    if (exportBtn) {
        exportBtn.addEventListener('click', handleExportClick);
    }
    
    // Set up import button handler (Task 12.1)
    if (importBtn) {
        importBtn.addEventListener('click', handleImportClick);
    }
    
    // Set up import file input change handler (Task 12.1)
    if (importFileInput) {
        importFileInput.addEventListener('change', handleImportFileChange);
    }
    
    // Set up reset button to return form to new mode (Task 9.3)
    const resetBtn = document.querySelector('#transaction-form button[type="reset"]');
    if (resetBtn) {
        resetBtn.addEventListener('click', function(e) {
            // Reset removes all errors and clears data
            clearFormErrors();
            setFormMode('new');
            
            // Show notification
            NotificationManager.info('Formulir berhasil direset ke mode input baru');
        });
    }
    
    // Initialize form mode for new transaction (Task 9.3)
    if (transactionForm) {
        setFormMode('new');
    }
    
    // Set up real-time field validation for transaction form (Task 8.2)
    setupFieldValidation();
    
    // Set up auto-calculation of Total Belanja (Task 8.3)
    setupAutoCalculation();
}

// ============================================
// Application Initialization
// ============================================

/**
 * Initialize the application
 */
function initializeApp() {
    // Initialize accessibility features (Task 13.3)
    initializeAccessibility();
    
    // Initialize navigation system
    NavigationManager.init();
    
    // Set up event listeners
    setupEventListeners();
    
    // Set up route change handler for chart rendering (Task 11.3)
    setupChartRouteHandler();
    
    // Initialize UI based on current auth state
    updateUIBasedOnAuthState();
}

// ============================================
// Chart Rendering Integration (Task 11.3)
// ============================================

/**
 * Handle navigation to analytics route and render charts
 * Called when user navigates to /analytics
 */
function setupChartRouteHandler() {
    // Store original navigateTo method
    const originalNavigateTo = NavigationManager.navigateTo.bind(NavigationManager);
    
    // Override NavigationManager.navigateTo to handle chart rendering
    NavigationManager.navigateTo = function(route) {
        // Call original navigation
        originalNavigateTo(route);
        
        // Render charts when navigating to analytics
        if (route === '/analytics') {
            handleAnalyticsRoute();
        }
    };
}

/**
 * Handle analytics route activation
 * Initializes and renders all 5 charts
 */
async function handleAnalyticsRoute() {
    try {
        // Destroy any existing charts first (prevent memory leaks)
        ChartManager.destroyCharts();
        
        // Small delay to ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Render all charts
        await ChartManager.renderCharts();
        
        console.log('Analytics charts initialized');
        
    } catch (error) {
        console.error('Error initializing analytics charts:', error);
        NotificationManager.error('Gagal memuat grafik analitik');
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM is already loaded
    initializeApp();
}

