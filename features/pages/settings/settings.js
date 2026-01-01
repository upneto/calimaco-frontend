// Settings Page - Parametrizations Management
console.log('Settings page loaded');

// Data storage keys
const STORAGE_KEYS = {
    categories: 'calimaco_categories',
    genres: 'calimaco_genres',
    publishers: 'calimaco_publishers',
    authors: 'calimaco_authors',
    collections: 'calimaco_collections'
};

// Initialize with default data if empty
function initializeData() {
    const defaults = {
        categories: [
            { id: 1, name: 'Livro', description: 'Livros físicos e digitais' },
            { id: 2, name: 'HQ', description: 'Histórias em quadrinhos' },
            { id: 3, name: 'Mangá', description: 'Quadrinhos japoneses' }
        ],
        genres: [
            { id: 1, name: 'Ficção', description: 'Literatura ficcional' },
            { id: 2, name: 'Fantasia', description: 'Ficção com elementos fantásticos' },
            { id: 3, name: 'Ficção Científica', description: 'FC e tecnologia' },
            { id: 4, name: 'Romance', description: 'Literatura romântica' },
            { id: 5, name: 'Suspense', description: 'Mistério e suspense' },
            { id: 6, name: 'Terror', description: 'Horror e terror' }
        ],
        publishers: [
            { id: 1, name: 'Companhia das Letras', description: 'Editora brasileira' },
            { id: 2, name: 'Intrínseca', description: 'Editora brasileira' },
            { id: 3, name: 'Panini', description: 'Quadrinhos e mangás' }
        ],
        authors: [
            { id: 1, name: 'Machado de Assis', description: 'Escritor brasileiro' },
            { id: 2, name: 'J.R.R. Tolkien', description: 'Autor de O Senhor dos Anéis' }
        ],
        collections: [
            { id: 1, name: 'O Senhor dos Anéis', description: 'Trilogia épica de fantasia' },
            { id: 2, name: 'Harry Potter', description: 'Série de fantasia' }
        ]
    };

    Object.keys(STORAGE_KEYS).forEach(key => {
        if (!localStorage.getItem(STORAGE_KEYS[key])) {
            localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(defaults[key]));
        }
    });
}

// Get data from localStorage
function getData(type) {
    const data = localStorage.getItem(STORAGE_KEYS[type]);
    return data ? JSON.parse(data) : [];
}

// Save data to localStorage
function saveData(type, data) {
    localStorage.setItem(STORAGE_KEYS[type], JSON.stringify(data));
}

// Current state
let currentTab = 'categories';
let currentType = 'category';
let editingId = null;

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tab = this.dataset.tab;
        switchTab(tab);
    });
});

function switchTab(tab) {
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tab}-tab`).classList.add('active');

    currentTab = tab;
    loadItems(tab);
}

// Load items for current tab
function loadItems(type) {
    const data = getData(type);
    const listElement = document.getElementById(`${type}-list`);
    
    if (data.length === 0) {
        listElement.innerHTML = `
            <div class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
                <p>Nenhum item cadastrado. Clique em "Novo" para adicionar.</p>
            </div>
        `;
        return;
    }

    listElement.innerHTML = data.map(item => `
        <div class="item-card">
            <div class="item-card-header">
                <h3>${item.name}</h3>
                <div class="item-actions">
                    <button class="btn-icon" onclick="editItem('${type}', ${item.id})" title="Editar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                        </svg>
                    </button>
                    <button class="btn-icon delete" onclick="deleteItem('${type}', ${item.id})" title="Excluir">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </button>
                </div>
            </div>
            ${item.description ? `<p>${item.description}</p>` : ''}
        </div>
    `).join('');
}

// Open modal for adding new item
window.openAddModal = function(type) {
    currentType = type;
    editingId = null;
    
    const typeNames = {
        category: 'Categoria',
        genre: 'Gênero',
        publisher: 'Editora',
        author: 'Autor',
        collection: 'Coleção'
    };
    
    document.getElementById('modalTitle').textContent = `Adicionar ${typeNames[type]}`;
    document.getElementById('itemName').value = '';
    document.getElementById('itemDescription').value = '';
    document.getElementById('itemModal').classList.add('active');
};

// Edit item
window.editItem = function(type, id) {
    const data = getData(type);
    const item = data.find(i => i.id === id);
    
    if (!item) return;
    
    currentType = type.slice(0, -1); // Remove 's' from plural
    if (currentType === 'categorie') currentType = 'category';
    editingId = id;
    
    const typeNames = {
        category: 'Categoria',
        genre: 'Gênero',
        publisher: 'Editora',
        author: 'Autor',
        collection: 'Coleção'
    };
    
    document.getElementById('modalTitle').textContent = `Editar ${typeNames[currentType]}`;
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemDescription').value = item.description || '';
    document.getElementById('itemModal').classList.add('active');
};

// Delete item
window.deleteItem = function(type, id) {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;
    
    const data = getData(type);
    const filtered = data.filter(item => item.id !== id);
    saveData(type, filtered);
    loadItems(type);
};

// Close modal
window.closeModal = function() {
    document.getElementById('itemModal').classList.remove('active');
    editingId = null;
};

// Form submission
document.getElementById('itemForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('itemName').value.trim();
    const description = document.getElementById('itemDescription').value.trim();
    
    if (!name) return;
    
    const typeMap = {
        category: 'categories',
        genre: 'genres',
        publisher: 'publishers',
        author: 'authors',
        collection: 'collections'
    };
    
    const storageType = typeMap[currentType];
    const data = getData(storageType);
    
    if (editingId) {
        // Edit existing
        const item = data.find(i => i.id === editingId);
        if (item) {
            item.name = name;
            item.description = description;
        }
    } else {
        // Add new
        const newId = data.length > 0 ? Math.max(...data.map(i => i.id)) + 1 : 1;
        data.push({
            id: newId,
            name,
            description
        });
    }
    
    saveData(storageType, data);
    loadItems(storageType);
    closeModal();
});

// Close modal on outside click
document.getElementById('itemModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Initialize
initializeData();
loadItems('categories');
