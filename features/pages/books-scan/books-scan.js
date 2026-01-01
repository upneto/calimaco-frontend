// Books Scan Page
console.log('Books Scan page loaded');

let currentImage = null;

// Initialize page
function initScanPage() {
    setupFileInput();
    setupDropzone();
    populateSelects();
    setupFormSubmit();
}

// Setup file input
function setupFileInput() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }
}

// Setup dropzone
function setupDropzone() {
    const dropzone = document.getElementById('dropzone');
    if (!dropzone) return;
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    // Highlight dropzone when dragging over
    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, unhighlight, false);
    });
    
    // Handle dropped files
    dropzone.addEventListener('drop', handleDrop, false);
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    const dropzone = document.getElementById('dropzone');
    if (dropzone) {
        dropzone.classList.add('dragover');
    }
}

function unhighlight(e) {
    const dropzone = document.getElementById('dropzone');
    if (dropzone) {
        dropzone.classList.remove('dragover');
    }
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0) {
        handleFiles(files);
    }
}

function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        handleFiles(files);
    }
}

function handleFiles(files) {
    const file = files[0];
    
    // Validate file type
    if (!file.type.match('image.*')) {
        alert('Por favor, selecione uma imagem válida (JPG, PNG, HEIC)');
        return;
    }
    
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 10MB');
        return;
    }
    
    currentImage = file;
    displayImage(file);
    showPreviewSection();
}

function displayImage(file) {
    const reader = new FileReader();
    const imagePreview = document.getElementById('imagePreview');
    
    reader.onload = function(e) {
        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
    };
    
    reader.readAsDataURL(file);
}

function showPreviewSection() {
    document.getElementById('uploadSection').style.display = 'none';
    document.getElementById('previewSection').style.display = 'block';
    document.getElementById('formSection').style.display = 'none';
}

function changeImage() {
    document.getElementById('uploadSection').style.display = 'block';
    document.getElementById('previewSection').style.display = 'none';
    document.getElementById('formSection').style.display = 'none';
    document.getElementById('fileInput').value = '';
    currentImage = null;
}

// Process image (simulated)
function processImage() {
    const processingStatus = document.getElementById('processingStatus');
    const loadingStatus = document.getElementById('loadingStatus');
    
    // Show loading
    processingStatus.style.display = 'none';
    loadingStatus.style.display = 'block';
    
    // Simulate processing (2-3 seconds)
    setTimeout(() => {
        // Simulate extracted data
        const extractedData = {
            title: 'O Senhor dos Anéis: A Sociedade do Anel',
            subtitle: 'Volume 1',
            authors: ['J.R.R. Tolkien'],
            publisher: 'Editora Martins Fontes',
            isbn: '978-8533613379',
            year: '2019'
        };
        
        fillFormWithExtractedData(extractedData);
        showFormSection();
    }, 2500);
}

function fillFormWithExtractedData(data) {
    document.getElementById('extractedTitle').value = data.title || '';
    document.getElementById('extractedSubtitle').value = data.subtitle || '';
    document.getElementById('extractedISBN').value = data.isbn || '';
    document.getElementById('extractedYear').value = data.year || '';
    
    // Select publisher
    const publisherSelect = document.getElementById('extractedPublisher');
    if (publisherSelect && data.publisher) {
        const option = Array.from(publisherSelect.options).find(opt => opt.value === data.publisher);
        if (option) {
            publisherSelect.value = data.publisher;
        }
    }
    
    // Select authors
    const authorsSelect = document.getElementById('extractedAuthors');
    if (authorsSelect && data.authors) {
        Array.from(authorsSelect.options).forEach(option => {
            option.selected = data.authors.includes(option.value);
        });
    }
}

function showFormSection() {
    document.getElementById('previewSection').style.display = 'none';
    document.getElementById('formSection').style.display = 'block';
    
    // Scroll to form
    document.getElementById('formSection').scrollIntoView({ behavior: 'smooth' });
}

// Populate selects
function populateSelects() {
    const authors = JSON.parse(localStorage.getItem('calimaco_authors') || '[]');
    const publishers = JSON.parse(localStorage.getItem('calimaco_publishers') || '[]');
    
    const authorsSelect = document.getElementById('extractedAuthors');
    const publisherSelect = document.getElementById('extractedPublisher');
    
    if (authorsSelect) {
        authors.forEach(author => {
            const option = document.createElement('option');
            option.value = author.name;
            option.textContent = author.name;
            authorsSelect.appendChild(option);
        });
    }
    
    if (publisherSelect) {
        publishers.forEach(pub => {
            const option = document.createElement('option');
            option.value = pub.name;
            option.textContent = pub.name;
            publisherSelect.appendChild(option);
        });
    }
}

// Setup form submit
function setupFormSubmit() {
    const form = document.getElementById('extractedDataForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get selected authors
    const authorsSelect = document.getElementById('extractedAuthors');
    const selectedAuthors = Array.from(authorsSelect.selectedOptions).map(opt => opt.value);
    
    // Collect form data
    const bookData = {
        id: Date.now(),
        title: document.getElementById('extractedTitle').value.trim(),
        subtitle: document.getElementById('extractedSubtitle').value.trim(),
        authors: selectedAuthors,
        publisher: document.getElementById('extractedPublisher').value,
        isbn: document.getElementById('extractedISBN').value.trim(),
        year: document.getElementById('extractedYear').value,
        scanDate: new Date().toISOString(),
        createdAt: new Date().toISOString()
    };
    
    // Get existing books
    const books = JSON.parse(localStorage.getItem('calimaco_books') || '[]');
    
    // Add new book
    books.push(bookData);
    
    // Save to localStorage
    localStorage.setItem('calimaco_books', JSON.stringify(books));
    
    // Show success message
    alert('Livro cadastrado com sucesso através da foto!');
    
    // Redirect to list
    window.location.hash = 'books-list';
}

function resetForm() {
    if (confirm('Deseja tirar uma nova foto? Os dados extraídos serão perdidos.')) {
        changeImage();
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScanPage);
} else {
    initScanPage();
}
