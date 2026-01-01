// Home Dashboard JS
console.log('Home page loaded');

let currentChart = null;

// Initialize dashboard
function initDashboard() {
    loadStatistics();
    loadRecentBooks();
    setupChartControls();
    renderChart();
}

// Load statistics
function loadStatistics() {
    const books = JSON.parse(localStorage.getItem('calimaco_books') || '[]');
    
    const totalBooks = books.length;
    const readBooks = books.filter(b => b.status === 'Lido').length;
    const readingBooks = books.filter(b => b.status === 'Lendo').length;
    const unreadBooks = books.filter(b => b.status === 'Não lido').length;
    
    document.getElementById('totalBooks').textContent = totalBooks;
    document.getElementById('readBooks').textContent = readBooks;
    document.getElementById('readingBooks').textContent = readingBooks;
    document.getElementById('unreadBooks').textContent = unreadBooks;
}

// Load recent books
function loadRecentBooks() {
    const books = JSON.parse(localStorage.getItem('calimaco_books') || '[]');
    const recentBooksContainer = document.getElementById('recentBooks');
    
    if (!recentBooksContainer) return;
    
    if (books.length === 0) {
        recentBooksContainer.innerHTML = `
            <div class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/>
                </svg>
                <h3>Nenhum livro cadastrado ainda</h3>
                <p>Comece adicionando seus primeiros livros à biblioteca!</p>
                <button class="btn-primary" onclick="window.location.hash='books-add'">Adicionar Livro</button>
            </div>
        `;
        return;
    }
    
    // Sort by creation date and get last 6
    const recentBooks = books
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6);
    
    recentBooksContainer.innerHTML = recentBooks.map(book => {
        const authors = Array.isArray(book.authors) ? book.authors.join(', ') : book.authors || 'Autor desconhecido';
        const date = new Date(book.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
        
        return `
            <div class="recent-book-card" onclick="window.location.hash='books-list'">
                ${book.category ? `<span class="recent-book-category">${book.category}</span>` : ''}
                <h3 class="recent-book-title">${book.title}</h3>
                <p class="recent-book-author">${authors}</p>
                <div class="recent-book-date">Adicionado em ${date}</div>
            </div>
        `;
    }).join('');
}

// Setup chart controls
function setupChartControls() {
    const chartTypeSelect = document.getElementById('chartType');
    const chartDataSelect = document.getElementById('chartData');
    
    if (chartTypeSelect) {
        chartTypeSelect.addEventListener('change', renderChart);
    }
    
    if (chartDataSelect) {
        chartDataSelect.addEventListener('change', renderChart);
    }
}

// Get chart data based on selection
function getChartData(dataType) {
    const books = JSON.parse(localStorage.getItem('calimaco_books') || '[]');
    const dataMap = new Map();
    
    books.forEach(book => {
        let key;
        
        switch(dataType) {
            case 'genre':
                key = book.genre || 'Sem gênero';
                break;
            case 'category':
                key = book.category || 'Sem categoria';
                break;
            case 'author':
                if (Array.isArray(book.authors) && book.authors.length > 0) {
                    book.authors.forEach(author => {
                        dataMap.set(author, (dataMap.get(author) || 0) + 1);
                    });
                    return;
                } else {
                    key = 'Sem autor';
                }
                break;
            case 'publisher':
                key = book.publisher || 'Sem editora';
                break;
            case 'status':
                key = book.status || 'Sem status';
                break;
            case 'year':
                key = book.year || 'Sem ano';
                break;
            case 'language':
                key = book.language || 'Sem idioma';
                break;
            case 'format':
                key = book.format || 'Sem formato';
                break;
            default:
                key = 'Outros';
        }
        
        dataMap.set(key, (dataMap.get(key) || 0) + 1);
    });
    
    // Convert to arrays and sort by count
    const sortedData = Array.from(dataMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // Limit to top 10
    
    return {
        labels: sortedData.map(item => item[0]),
        data: sortedData.map(item => item[1])
    };
}

// Get color palette
function getColorPalette(count) {
    const colors = [
        '#667eea', '#764ba2', '#48bb78', '#38a169',
        '#4299e1', '#3182ce', '#ed8936', '#dd6b20',
        '#9f7aea', '#805ad5', '#f56565', '#e53e3e',
        '#38b2ac', '#319795', '#ecc94b', '#d69e2e'
    ];
    
    return colors.slice(0, count);
}

// Render chart
function renderChart() {
    const chartType = document.getElementById('chartType')?.value || 'bar';
    const dataType = document.getElementById('chartData')?.value || 'genre';
    const chartCanvas = document.getElementById('mainChart');
    
    if (!chartCanvas) return;
    
    // Destroy previous chart
    if (currentChart) {
        currentChart.destroy();
    }
    
    const chartData = getChartData(dataType);
    
    if (chartData.labels.length === 0) {
        chartCanvas.parentElement.innerHTML = `
            <div class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                    <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/>
                </svg>
                <h3>Sem dados para exibir</h3>
                <p>Adicione livros à sua biblioteca para visualizar estatísticas.</p>
            </div>
        `;
        return;
    }
    
    const colors = getColorPalette(chartData.labels.length);
    
    const config = {
        type: chartType,
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Quantidade de Livros',
                data: chartData.data,
                backgroundColor: colors.map(c => c + '90'),
                borderColor: colors,
                borderWidth: 2,
                borderRadius: chartType === 'bar' ? 8 : 0,
                hoverOffset: chartType === 'pie' || chartType === 'doughnut' ? 10 : 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: chartType === 'pie' || chartType === 'doughnut',
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12,
                            family: "'Inter', 'Segoe UI', sans-serif"
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    }
                }
            },
            scales: chartType === 'bar' || chartType === 'line' ? {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0,
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: '#e2e8f0'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            } : {}
        }
    };
    
    currentChart = new Chart(chartCanvas, config);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}