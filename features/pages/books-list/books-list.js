// Books List Page
document.addEventListener('DOMContentLoaded', initBooksListPage);

function initBooksListPage() {
    populateFilters();
    loadBooks();
    setupEventListeners();
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const filterCategory = document.getElementById('filterCategory');
    const filterGenre = document.getElementById('filterGenre');
    const filterStatus = document.getElementById('filterStatus');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterBooks);
    }
    
    if (filterCategory) {
        filterCategory.addEventListener('change', filterBooks);
    }
    
    if (filterGenre) {
        filterGenre.addEventListener('change', filterBooks);
    }
    
    if (filterStatus) {
        filterStatus.addEventListener('change', filterBooks);
    }
}

function populateFilters() {
    const categories = JSON.parse(localStorage.getItem('calimaco_categories') || '[]');
    const genres = JSON.parse(localStorage.getItem('calimaco_genres') || '[]');
    
    const filterCategory = document.getElementById('filterCategory');
    const filterGenre = document.getElementById('filterGenre');
    
    if (filterCategory) {
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.name;
            option.textContent = cat.name;
            filterCategory.appendChild(option);
        });
    }
    
    if (filterGenre) {
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.name;
            option.textContent = genre.name;
            filterGenre.appendChild(option);
        });
    }
}

function loadBooks() {
    const books = JSON.parse(localStorage.getItem('calimaco_books') || '[]');
    displayBooks(books);
    updateBooksCount(books.length);
}

function displayBooks(books) {
    const booksGrid = document.getElementById('booksGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (!booksGrid) return;
    
    if (books.length === 0) {
        booksGrid.style.display = 'none';
        if (emptyState) {
            emptyState.style.display = 'block';
        }
        return;
    }
    
    booksGrid.style.display = 'grid';
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    booksGrid.innerHTML = books.map(book => createBookCard(book)).join('');
}

function createBookCard(book) {
    const authors = Array.isArray(book.authors) ? book.authors.join(', ') : book.authors || 'Autor desconhecido';
    const subtitle = book.subtitle ? `<div class="book-subtitle">${book.subtitle}</div>` : '';
    const publisher = book.publisher || 'N/A';
    const year = book.year || 'N/A';
    const pages = book.pages || 'N/A';
    const status = book.status || 'Não lido';
    const statusClass = getStatusClass(status);
    const tags = book.tags && book.tags.length > 0 ? 
        `<div class="book-tags">${book.tags.map(tag => `<span class="book-tag">${tag}</span>`).join('')}</div>` : '';
    
    return `
        <div class="book-card" onclick="showBookDetails('${book.id}')">
            <div class="book-status ${statusClass}">${status}</div>
            <div class="book-card-header">
                ${book.category ? `<span class="book-category">${book.category}</span>` : ''}
                <h3>${book.title}</h3>
                ${subtitle}
            </div>
            <div class="book-info">
                <div class="book-info-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm.256 7a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z"/>
                        <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Z"/>
                    </svg>
                    ${authors}
                </div>
                <div class="book-info-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>
                    </svg>
                    ${publisher}
                </div>
                <div class="book-info-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                    </svg>
                    ${year}
                </div>
                <div class="book-info-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
                    </svg>
                    ${pages} páginas
                </div>
            </div>
            ${tags}
        </div>
    `;
}

function getStatusClass(status) {
    const statusMap = {
        'Lido': 'status-read',
        'Lendo': 'status-reading',
        'Não lido': 'status-unread',
        'Abandonado': 'status-abandoned',
        'Relendo': 'status-rereading'
    };
    return statusMap[status] || 'status-unread';
}

function filterBooks() {
    const books = JSON.parse(localStorage.getItem('calimaco_books') || '[]');
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('filterCategory')?.value || '';
    const genreFilter = document.getElementById('filterGenre')?.value || '';
    const statusFilter = document.getElementById('filterStatus')?.value || '';
    
    const filtered = books.filter(book => {
        const matchesSearch = !searchTerm || 
            book.title.toLowerCase().includes(searchTerm) ||
            (book.subtitle && book.subtitle.toLowerCase().includes(searchTerm)) ||
            (Array.isArray(book.authors) && book.authors.some(author => author.toLowerCase().includes(searchTerm))) ||
            (typeof book.authors === 'string' && book.authors.toLowerCase().includes(searchTerm)) ||
            (book.publisher && book.publisher.toLowerCase().includes(searchTerm));
        
        const matchesCategory = !categoryFilter || book.category === categoryFilter;
        const matchesGenre = !genreFilter || book.genre === genreFilter;
        const matchesStatus = !statusFilter || book.status === statusFilter;
        
        return matchesSearch && matchesCategory && matchesGenre && matchesStatus;
    });
    
    displayBooks(filtered);
    updateBooksCount(filtered.length);
}

function updateBooksCount(count) {
    const booksCount = document.getElementById('booksCount');
    if (booksCount) {
        booksCount.textContent = `${count} livro${count !== 1 ? 's' : ''} ${count !== JSON.parse(localStorage.getItem('calimaco_books') || '[]').length ? 'encontrado' + (count !== 1 ? 's' : '') : 'cadastrado' + (count !== 1 ? 's' : '')}`;
    }
}

function showBookDetails(bookId) {
    const books = JSON.parse(localStorage.getItem('calimaco_books') || '[]');
    const book = books.find(b => b.id === bookId);
    
    if (!book) return;
    
    const modal = document.getElementById('bookModal');
    const modalTitle = document.getElementById('modalBookTitle');
    const bookDetails = document.getElementById('bookDetails');
    
    if (!modal || !modalTitle || !bookDetails) return;
    
    modalTitle.textContent = book.title;
    
    const authors = Array.isArray(book.authors) ? book.authors.join(', ') : book.authors || 'Autor desconhecido';
    const tags = book.tags && book.tags.length > 0 ? book.tags.join(', ') : 'Nenhuma tag';
    
    bookDetails.innerHTML = `
        <div class="book-detail-grid">
            ${book.subtitle ? `<div class="detail-item"><div class="detail-label">Subtítulo</div><div class="detail-value">${book.subtitle}</div></div>` : ''}
            <div class="detail-item"><div class="detail-label">Autores</div><div class="detail-value">${authors}</div></div>
            <div class="detail-item"><div class="detail-label">Categoria</div><div class="detail-value">${book.category || 'N/A'}</div></div>
            <div class="detail-item"><div class="detail-label">Gênero</div><div class="detail-value">${book.genre || 'N/A'}</div></div>
            <div class="detail-item"><div class="detail-label">Editora</div><div class="detail-value">${book.publisher || 'N/A'}</div></div>
            <div class="detail-item"><div class="detail-label">ISBN</div><div class="detail-value">${book.isbn || 'N/A'}</div></div>
            <div class="detail-item"><div class="detail-label">Edição</div><div class="detail-value">${book.edition || 'N/A'}</div></div>
            <div class="detail-item"><div class="detail-label">Ano</div><div class="detail-value">${book.year || 'N/A'}</div></div>
            <div class="detail-item"><div class="detail-label">Páginas</div><div class="detail-value">${book.pages || 'N/A'}</div></div>
            <div class="detail-item"><div class="detail-label">Idioma</div><div class="detail-value">${book.language || 'N/A'}</div></div>
            <div class="detail-item"><div class="detail-label">Formato</div><div class="detail-value">${book.format || 'N/A'}</div></div>
            <div class="detail-item"><div class="detail-label">Status</div><div class="detail-value">${book.status || 'N/A'}</div></div>
            ${book.collection ? `<div class="detail-item"><div class="detail-label">Coleção</div><div class="detail-value">${book.collection}</div></div>` : ''}
            ${book.volume ? `<div class="detail-item"><div class="detail-label">Volume</div><div class="detail-value">${book.volume}</div></div>` : ''}
            ${book.condition ? `<div class="detail-item"><div class="detail-label">Condição</div><div class="detail-value">${book.condition}</div></div>` : ''}
            <div class="detail-item"><div class="detail-label">Lista de Desejos</div><div class="detail-value">${book.wishlist ? 'Sim' : 'Não'}</div></div>
        </div>
        ${book.tags && book.tags.length > 0 ? `
            <div class="detail-item" style="margin-top: 20px;">
                <div class="detail-label">Tags</div>
                <div class="detail-value">${tags}</div>
            </div>
        ` : ''}
        ${book.notes ? `
            <div class="detail-item" style="margin-top: 20px;">
                <div class="detail-label">Observações</div>
                <div class="detail-value">${book.notes}</div>
            </div>
        ` : ''}
        <div class="modal-actions">
            <button class="btn-primary" onclick="editBook('${book.id}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                </svg>
                Editar
            </button>
            <button class="btn-danger" onclick="confirmDelete('${book.id}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
                Excluir
            </button>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeBookModal() {
    const modal = document.getElementById('bookModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function editBook(bookId) {
    localStorage.setItem('calimaco_edit_book_id', bookId);
    window.location.hash = 'books-add';
}

function confirmDelete(bookId) {
    if (confirm('Tem certeza que deseja excluir este livro?')) {
        deleteBook(bookId);
    }
}

function deleteBook(bookId) {
    let books = JSON.parse(localStorage.getItem('calimaco_books') || '[]');
    books = books.filter(b => b.id !== bookId);
    localStorage.setItem('calimaco_books', JSON.stringify(books));
    
    closeBookModal();
    loadBooks();
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('bookModal');
    if (modal && event.target === modal) {
        closeBookModal();
    }
});
