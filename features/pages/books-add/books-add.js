// Books Add Page - Form Management
console.log('Books Add page loaded');

// Storage key
const BOOKS_STORAGE_KEY = 'calimaco_books';
let editingBookId = null;

// Get data from settings
function getSettingsData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

// Check if in edit mode
function checkForEditMode() {
    const bookId = localStorage.getItem('calimaco_edit_book_id');
    if (bookId) {
        editingBookId = parseInt(bookId);
        loadBookForEdit(editingBookId);
        localStorage.removeItem('calimaco_edit_book_id');
        
        // Update page title
        const pageTitle = document.querySelector('.page-header h1');
        if (pageTitle) {
            pageTitle.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                </svg>
                Editar Livro
            `;
        }
    }
}

// Load book for editing
function loadBookForEdit(bookId) {
    const books = getSettingsData(BOOKS_STORAGE_KEY);
    const book = books.find(b => b.id === bookId);
    
    if (!book) return;
    
    // Fill form with book data
    document.getElementById('bookTitle').value = book.title || '';
    document.getElementById('bookSubtitle').value = book.subtitle || '';
    document.getElementById('bookCategory').value = book.category || '';
    document.getElementById('bookGenre').value = book.genre || '';
    document.getElementById('bookPublisher').value = book.publisher || '';
    document.getElementById('bookISBN').value = book.isbn || '';
    document.getElementById('bookEdition').value = book.edition || '';
    document.getElementById('bookYear').value = book.year || '';
    document.getElementById('bookPages').value = book.pages || '';
    document.getElementById('bookLanguage').value = book.language || '';
    document.getElementById('bookFormat').value = book.format || '';
    document.getElementById('bookCollection').value = book.collection || '';
    document.getElementById('bookVolume').value = book.volume || '';
    document.getElementById('bookStatus').value = book.status || '';
    document.getElementById('bookCondition').value = book.condition || '';
    document.getElementById('bookTags').value = Array.isArray(book.tags) ? book.tags.join(', ') : '';
    document.getElementById('bookNotes').value = book.notes || '';
    document.getElementById('bookWishlist').checked = book.wishlist || false;
    
    // Select authors (multiple select)
    const authorSelect = document.getElementById('bookAuthor');
    if (authorSelect && Array.isArray(book.authors)) {
        Array.from(authorSelect.options).forEach(option => {
            option.selected = book.authors.includes(option.value);
        });
    }
}

// Populate form selects
function populateSelects() {
    // Authors
    const authors = getSettingsData('calimaco_authors');
    const authorSelect = document.getElementById('bookAuthor');
    authors.forEach(author => {
        const option = document.createElement('option');
        option.value = author.name;
        option.textContent = author.name;
        authorSelect.appendChild(option);
    });

    // Categories
    const categories = getSettingsData('calimaco_categories');
    const categorySelect = document.getElementById('bookCategory');
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.name;
        option.textContent = cat.name;
        categorySelect.appendChild(option);
    });

    // Genres
    const genres = getSettingsData('calimaco_genres');
    const genreSelect = document.getElementById('bookGenre');
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.name;
        option.textContent = genre.name;
        genreSelect.appendChild(option);
    });

    // Publishers
    const publishers = getSettingsData('calimaco_publishers');
    const publisherSelect = document.getElementById('bookPublisher');
    publishers.forEach(pub => {
        const option = document.createElement('option');
        option.value = pub.name;
        option.textContent = pub.name;
        publisherSelect.appendChild(option);
    });

    // Collections
    const collections = getSettingsData('calimaco_collections');
    const collectionSelect = document.getElementById('bookCollection');
    collections.forEach(coll => {
        const option = document.createElement('option');
        option.value = coll.name;
        option.textContent = coll.name;
        collectionSelect.appendChild(option);
    });
}

// Form submission
document.getElementById('bookForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get selected authors
    const authorSelect = document.getElementById('bookAuthor');
    const selectedAuthors = Array.from(authorSelect.selectedOptions).map(opt => opt.value);

    // Collect form data
    const bookData = {
        id: editingBookId || Date.now(),
        title: document.getElementById('bookTitle').value.trim(),
        subtitle: document.getElementById('bookSubtitle').value.trim(),
        authors: selectedAuthors,
        category: document.getElementById('bookCategory').value,
        genre: document.getElementById('bookGenre').value,
        publisher: document.getElementById('bookPublisher').value,
        isbn: document.getElementById('bookISBN').value.trim(),
        edition: document.getElementById('bookEdition').value.trim(),
        year: document.getElementById('bookYear').value,
        pages: document.getElementById('bookPages').value,
        language: document.getElementById('bookLanguage').value,
        format: document.getElementById('bookFormat').value,
        collection: document.getElementById('bookCollection').value,
        volume: document.getElementById('bookVolume').value.trim(),
        status: document.getElementById('bookStatus').value,
        condition: document.getElementById('bookCondition').value,
        tags: document.getElementById('bookTags').value.split(',').map(t => t.trim()).filter(t => t),
        notes: document.getElementById('bookNotes').value.trim(),
        wishlist: document.getElementById('bookWishlist').checked,
        createdAt: editingBookId ? undefined : new Date().toISOString(),
        updatedAt: editingBookId ? new Date().toISOString() : undefined
    };

    // Get existing books
    let books = getSettingsData(BOOKS_STORAGE_KEY);
    
    if (editingBookId) {
        // Update existing book
        const index = books.findIndex(b => b.id === editingBookId);
        if (index !== -1) {
            // Preserve createdAt
            bookData.createdAt = books[index].createdAt;
            books[index] = bookData;
        }
    } else {
        // Add new book
        books.push(bookData);
    }
    
    // Save to localStorage
    localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(books));

    // Show success message
    alert(editingBookId ? 'Livro atualizado com sucesso!' : 'Livro cadastrado com sucesso!');

    // Redirect to list
    window.location.hash = 'books-list';
});

// Initialize
populateSelects();
checkForEditMode();
