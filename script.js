// E2E-Commerce - Sistema de Gestão de Usuários e Produtos
// Desenvolvido com HTML, CSS e JavaScript puro

class E2ECommerce {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.products = this.loadProducts();
        this.currentPage = 1;
        this.itemsPerPage = 6;
        this.inactivityTimer = null;
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutos
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkExistingSession();
        this.renderProducts();
        this.startInactivityTimer();
    }

    // ==================== EVENT BINDING ====================
    bindEvents() {
        // Navigation
        document.getElementById('loginBtn').addEventListener('click', () => this.showModal('loginModal'));
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        document.getElementById('showUserManagement').addEventListener('click', () => this.showUserManagement());
        document.getElementById('showProductManagement').addEventListener('click', () => this.showProductManagement());

        // Modals
        document.getElementById('closeLoginModal').addEventListener('click', () => this.hideModal('loginModal'));
        document.getElementById('closeRegisterModal').addEventListener('click', () => this.hideModal('registerModal'));
        document.getElementById('closeConfirmModal').addEventListener('click', () => this.hideModal('confirmModal'));
        document.getElementById('showRegister').addEventListener('click', () => this.switchToRegister());
        document.getElementById('showLogin').addEventListener('click', () => this.switchToLogin());

        // Forms
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));

        // User Management
        document.getElementById('addUserBtn').addEventListener('click', () => this.showModal('registerModal'));

        // Product Management
        document.getElementById('productSearch').addEventListener('input', () => this.filterProducts());
        document.getElementById('categoryFilter').addEventListener('change', () => this.filterProducts());
        document.getElementById('sortBy').addEventListener('change', () => this.filterProducts());
        document.getElementById('searchBtn').addEventListener('click', () => this.filterProducts());

        // Confirmation Modal
        document.getElementById('confirmCancel').addEventListener('click', () => this.hideModal('confirmModal'));
        document.getElementById('confirmOk').addEventListener('click', () => this.handleConfirm());

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target.id);
            }
        });

        // Reset inactivity timer on user activity
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, () => this.resetInactivityTimer(), true);
        });
    }

    // ==================== DATA MANAGEMENT ====================
    loadUsers() {
        const stored = localStorage.getItem('e2e_users');
        return stored ? JSON.parse(stored) : [
            {
                id: 1,
                name: 'Administrador',
                email: 'admin@e2e.com',
                password: btoa('Admin123!@#'),
                profile: 'admin',
                createdAt: new Date().toISOString()
            }
        ];
    }

    loadProducts() {
        const stored = localStorage.getItem('e2e_products');
        if (stored) return JSON.parse(stored);

        // Dados de exemplo
        const sampleProducts = [
            {
                id: 1,
                name: 'Smartphone Galaxy S23',
                category: 'eletrônicos',
                price: 1299.99,
                stock: 15,
                description: 'Smartphone Android com câmera de 108MP',
                image: '📱',
                active: true
            },
            {
                id: 2,
                name: 'Notebook Dell Inspiron',
                category: 'eletrônicos',
                price: 2499.99,
                stock: 8,
                description: 'Notebook para trabalho e estudos',
                image: '💻',
                active: true
            },
            {
                id: 3,
                name: 'Camiseta Básica',
                category: 'roupas',
                price: 29.99,
                stock: 50,
                description: 'Camiseta 100% algodão',
                image: '👕',
                active: true
            },
            {
                id: 4,
                name: 'Tênis Esportivo',
                category: 'esportes',
                price: 199.99,
                stock: 25,
                description: 'Tênis para corrida e caminhada',
                image: '👟',
                active: true
            },
            {
                id: 5,
                name: 'Livro JavaScript',
                category: 'livros',
                price: 49.99,
                stock: 12,
                description: 'Guia completo de JavaScript',
                image: '📚',
                active: true
            },
            {
                id: 6,
                name: 'Mesa de Escritório',
                category: 'casa',
                price: 299.99,
                stock: 5,
                description: 'Mesa ergonômica para home office',
                image: '🪑',
                active: true
            },
            {
                id: 7,
                name: 'Fone de Ouvido Bluetooth',
                category: 'eletrônicos',
                price: 89.99,
                stock: 30,
                description: 'Fone sem fio com cancelamento de ruído',
                image: '🎧',
                active: true
            },
            {
                id: 8,
                name: 'Calça Jeans',
                category: 'roupas',
                price: 79.99,
                stock: 40,
                description: 'Calça jeans clássica',
                image: '👖',
                active: true
            },
            {
                id: 9,
                name: 'Bola de Futebol',
                category: 'esportes',
                price: 39.99,
                stock: 20,
                description: 'Bola oficial de futebol',
                image: '⚽',
                active: true
            },
            {
                id: 10,
                name: 'Cafeteira Elétrica',
                category: 'casa',
                price: 149.99,
                stock: 10,
                description: 'Cafeteira automática 12 xícaras',
                image: '☕',
                active: true
            }
        ];

        this.saveProducts(sampleProducts);
        return sampleProducts;
    }

    saveUsers() {
        localStorage.setItem('e2e_users', JSON.stringify(this.users));
    }

    saveProducts() {
        localStorage.setItem('e2e_products', JSON.stringify(this.products));
    }

    // ==================== AUTHENTICATION ====================
    checkExistingSession() {
        const session = localStorage.getItem('e2e_session');
        if (session) {
            const sessionData = JSON.parse(session);
            const user = this.users.find(u => u.id === sessionData.userId);
            if (user) {
                this.currentUser = user;
                this.updateUI();
            }
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        const user = this.users.find(u => u.email === email && u.password === btoa(password));
        
        if (user) {
            this.currentUser = user;
            this.saveSession();
            this.updateUI();
            this.hideModal('loginModal');
            this.showMessage('Login realizado com sucesso!', 'success');
            this.resetInactivityTimer();
        } else {
            this.showMessage('E-mail ou senha incorretos!', 'error');
        }
    }

    handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const profile = document.getElementById('registerProfile').value;
        
        // Validações
        if (!this.validateEmail(email)) {
            this.showMessage('E-mail inválido!', 'error');
            return;
        }
        
        if (this.users.find(u => u.email === email)) {
            this.showMessage('E-mail já cadastrado!', 'error');
            return;
        }
        
        if (!this.validatePassword(password)) {
            this.showMessage('Senha deve ter mínimo 10 caracteres com letras, números e caracteres especiais!', 'error');
            return;
        }
        
        // Criar usuário
        const newUser = {
            id: Date.now(),
            name,
            email,
            password: btoa(password),
            profile,
            createdAt: new Date().toISOString()
        };
        
        this.users.push(newUser);
        this.saveUsers();
        
        this.showMessage('Usuário cadastrado com sucesso!', 'success');
        this.hideModal('registerModal');
        this.resetForm('registerForm');
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('e2e_session');
        this.updateUI();
        this.showMessage('Logout realizado com sucesso!', 'success');
        this.hideAllSections();
    }

    saveSession() {
        const session = {
            userId: this.currentUser.id,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('e2e_session', JSON.stringify(session));
    }

    // ==================== VALIDATION ====================
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    validatePassword(password) {
        if (password.length < 10) return false;
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return hasLetter && hasNumber && hasSpecial;
    }

    // ==================== UI MANAGEMENT ====================
    showModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    hideModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    hideAllSections() {
        document.getElementById('welcomeSection').style.display = 'block';
        document.getElementById('userManagementSection').style.display = 'none';
        document.getElementById('productManagementSection').style.display = 'none';
        document.getElementById('userDashboard').style.display = 'none';
    }

    switchToRegister() {
        this.hideModal('loginModal');
        this.showModal('registerModal');
    }

    switchToLogin() {
        this.hideModal('registerModal');
        this.showModal('loginModal');
    }

    updateUI() {
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (this.currentUser) {
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'block';
            this.showUserDashboard();
        } else {
            loginBtn.style.display = 'block';
            logoutBtn.style.display = 'none';
            this.hideAllSections();
        }
    }

    showUserDashboard() {
        this.hideAllSections();
        document.getElementById('userDashboard').style.display = 'block';
        
        const title = document.getElementById('dashboardTitle');
        const content = document.getElementById('dashboardContent');
        
        title.textContent = `Bem-vindo, ${this.currentUser.name}!`;
        
        let dashboardHTML = '';
        
        if (this.currentUser.profile === 'admin') {
            dashboardHTML = `
                <div class="dashboard-content">
                    <div class="dashboard-card">
                        <h3>👥 Gestão de Usuários</h3>
                        <p>Gerencie todos os usuários do sistema</p>
                        <button class="btn btn-primary" onclick="app.showUserManagement()">Acessar</button>
                    </div>
                    <div class="dashboard-card">
                        <h3>📦 Gestão de Produtos</h3>
                        <p>Consulte e gerencie o estoque de produtos</p>
                        <button class="btn btn-primary" onclick="app.showProductManagement()">Acessar</button>
                    </div>
                </div>
            `;
        } else if (this.currentUser.profile === 'vendedor') {
            dashboardHTML = `
                <div class="dashboard-content">
                    <div class="dashboard-card">
                        <h3>📦 Gestão de Produtos</h3>
                        <p>Consulte produtos e gerencie estoque</p>
                        <button class="btn btn-primary" onclick="app.showProductManagement()">Acessar</button>
                    </div>
                    <div class="dashboard-card">
                        <h3>📊 Meus Dados</h3>
                        <p>Gerencie suas informações pessoais</p>
                        <button class="btn btn-secondary" onclick="app.editUser(${this.currentUser.id})">Editar</button>
                    </div>
                </div>
            `;
        } else {
            dashboardHTML = `
                <div class="dashboard-content">
                    <div class="dashboard-card">
                        <h3>🛍️ Loja Virtual</h3>
                        <p>Navegue pelos produtos disponíveis</p>
                        <button class="btn btn-primary" onclick="app.showProductManagement()">Acessar Loja</button>
                    </div>
                    <div class="dashboard-card">
                        <h3>👤 Meus Dados</h3>
                        <p>Gerencie suas informações pessoais</p>
                        <button class="btn btn-secondary" onclick="app.editUser(${this.currentUser.id})">Editar</button>
                    </div>
                </div>
            `;
        }
        
        content.innerHTML = dashboardHTML;
    }

    showUserManagement() {
        if (!this.currentUser || this.currentUser.profile !== 'admin') {
            this.showMessage('Acesso negado! Apenas administradores podem gerenciar usuários.', 'error');
            return;
        }
        
        this.hideAllSections();
        document.getElementById('userManagementSection').style.display = 'block';
        this.renderUsers();
    }

    showProductManagement() {
        this.hideAllSections();
        document.getElementById('productManagementSection').style.display = 'block';
        this.renderProducts();
    }

    // ==================== USER MANAGEMENT ====================
    renderUsers() {
        const userList = document.getElementById('userList');
        const usersToShow = this.users.filter(user => user.id !== this.currentUser.id);
        
        if (usersToShow.length === 0) {
            userList.innerHTML = '<p class="text-center">Nenhum usuário encontrado.</p>';
            return;
        }
        
        userList.innerHTML = usersToShow.map(user => `
            <div class="user-card">
                <div class="user-info">
                    <h3>${user.name}</h3>
                    <p>${user.email} • ${user.profile.charAt(0).toUpperCase() + user.profile.slice(1)}</p>
                </div>
                <div class="user-actions">
                    <button class="btn btn-secondary" onclick="app.editUser(${user.id})">✏️ Editar</button>
                    <button class="btn btn-danger" onclick="app.deleteUser(${user.id})">🗑️ Excluir</button>
                </div>
            </div>
        `).join('');
    }

    editUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;
        
        // Se não for admin, só pode editar próprio usuário
        if (this.currentUser.profile !== 'admin' && user.id !== this.currentUser.id) {
            this.showMessage('Você só pode editar seus próprios dados!', 'error');
            return;
        }
        
        const newName = prompt('Nome completo:', user.name);
        if (newName === null) return;
        
        const newEmail = prompt('E-mail:', user.email);
        if (newEmail === null) return;
        
        if (!this.validateEmail(newEmail)) {
            this.showMessage('E-mail inválido!', 'error');
            return;
        }
        
        if (this.users.find(u => u.email === newEmail && u.id !== user.id)) {
            this.showMessage('E-mail já cadastrado!', 'error');
            return;
        }
        
        user.name = newName;
        user.email = newEmail;
        this.saveUsers();
        
        if (user.id === this.currentUser.id) {
            this.currentUser = user;
            this.saveSession();
        }
        
        this.showMessage('Usuário atualizado com sucesso!', 'success');
        this.renderUsers();
    }

    deleteUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;
        
        this.showConfirmModal(
            'Excluir Usuário',
            `Tem certeza que deseja excluir o usuário "${user.name}"?`,
            () => {
                this.users = this.users.filter(u => u.id !== userId);
                this.saveUsers();
                this.showMessage('Usuário excluído com sucesso!', 'success');
                this.renderUsers();
            }
        );
    }

    // ==================== PRODUCT MANAGEMENT ====================
    renderProducts() {
        const productGrid = document.getElementById('productGrid');
        const pagination = document.getElementById('pagination');
        
        const filteredProducts = this.getFilteredProducts();
        const totalPages = Math.ceil(filteredProducts.length / this.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const productsToShow = filteredProducts.slice(startIndex, endIndex);
        
        if (productsToShow.length === 0) {
            productGrid.innerHTML = '<p class="text-center">Nenhum produto encontrado.</p>';
            pagination.innerHTML = '';
            return;
        }
        
        productGrid.innerHTML = productsToShow.map(product => `
            <div class="product-card">
                <div class="product-image">${product.image}</div>
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div>
                    <div class="product-price">R$ ${product.price.toFixed(2)}</div>
                    <div class="product-stock">Estoque: ${product.stock} unidades</div>
                    <div class="product-actions">
                        <select class="stock-selector" id="stockSelect_${product.id}">
                            <option value="">Selecionar lote</option>
                            <option value="10">+10 unidades</option>
                            <option value="20">+20 unidades</option>
                            <option value="30">+30 unidades</option>
                            <option value="40">+40 unidades</option>
                            <option value="50">+50 unidades</option>
                        </select>
                        <button class="btn btn-success" onclick="app.addStock(${product.id})" ${!product.active ? 'disabled' : ''}>
                            ${product.active ? 'Adicionar ao Estoque' : 'Produto Inativo'}
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        this.renderPagination(totalPages);
    }

    getFilteredProducts() {
        let filtered = [...this.products];
        
        const searchTerm = document.getElementById('productSearch').value.toLowerCase();
        const category = document.getElementById('categoryFilter').value;
        const sortBy = document.getElementById('sortBy').value;
        
        if (searchTerm) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(searchTerm)
            );
        }
        
        if (category) {
            filtered = filtered.filter(product => product.category === category);
        }
        
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'price':
                    return a.price - b.price;
                case 'stock':
                    return a.stock - b.stock;
                default:
                    return 0;
            }
        });
        
        return filtered;
    }

    filterProducts() {
        this.currentPage = 1;
        this.renderProducts();
    }

    renderPagination(totalPages) {
        const pagination = document.getElementById('pagination');
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button ${this.currentPage === 1 ? 'disabled' : ''} onclick="app.changePage(${this.currentPage - 1})">
                Anterior
            </button>
        `;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `
                    <button class="${i === this.currentPage ? 'active' : ''}" onclick="app.changePage(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += '<span>...</span>';
            }
        }
        
        // Next button
        paginationHTML += `
            <button ${this.currentPage === totalPages ? 'disabled' : ''} onclick="app.changePage(${this.currentPage + 1})">
                Próxima
            </button>
        `;
        
        pagination.innerHTML = paginationHTML;
    }

    changePage(page) {
        const totalPages = Math.ceil(this.getFilteredProducts().length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderProducts();
        }
    }

    addStock(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        if (!product.active) {
            this.showMessage('Produto inativo: não é possível ajustar estoque!', 'error');
            return;
        }
        
        const stockSelect = document.getElementById(`stockSelect_${productId}`);
        const selectedValue = stockSelect.value;
        
        if (!selectedValue) {
            this.showMessage('Selecione um lote para adicionar!', 'error');
            return;
        }
        
        const quantity = parseInt(selectedValue);
        
        if (quantity % 10 !== 0) {
            this.showMessage('Acréscimo deve ser em lotes de 10 (10, 20, 30...)!', 'error');
            return;
        }
        
        this.showConfirmModal(
            'Adicionar ao Estoque',
            `Adicionar +${quantity} ao estoque do produto "${product.name}"?`,
            () => {
                this.showLoading(true);
                
                // Simular delay de processamento
                setTimeout(() => {
                    product.stock += quantity;
                    this.saveProducts();
                    this.showLoading(false);
                    this.showMessage(`Estoque atualizado com sucesso! Novo estoque: ${product.stock} unidades`, 'success');
                    this.renderProducts();
                }, 1000);
            }
        );
    }

    // ==================== UTILITY FUNCTIONS ====================
    showMessage(message, type = 'success') {
        const container = document.getElementById('messageContainer');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        container.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    showConfirmModal(title, message, onConfirm) {
        document.getElementById('confirmTitle').textContent = title;
        document.getElementById('confirmMessage').textContent = message;
        this.confirmCallback = onConfirm;
        this.showModal('confirmModal');
    }

    handleConfirm() {
        if (this.confirmCallback) {
            this.confirmCallback();
            this.confirmCallback = null;
        }
        this.hideModal('confirmModal');
    }

    showLoading(show) {
        document.getElementById('loadingSpinner').style.display = show ? 'block' : 'none';
    }

    resetForm(formId) {
        document.getElementById(formId).reset();
    }

    // ==================== SESSION MANAGEMENT ====================
    startInactivityTimer() {
        this.resetInactivityTimer();
    }

    resetInactivityTimer() {
        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
        }
        
        if (this.currentUser) {
            this.inactivityTimer = setTimeout(() => {
                this.showMessage('Sessão expirada por inatividade. Faça login novamente.', 'warning');
                this.logout();
            }, this.sessionTimeout);
        }
    }
}

// Initialize the application
const app = new E2ECommerce();
