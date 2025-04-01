// Sistema de Carrinho
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Elementos do carrinho
let carrinhoModal;
let carrinhoBtn;
let fecharCarrinhoBtn;
let carrinhoItems;
let carrinhoContainer;
let carrinhoContador;
let finalizarCompraBtn;
let carrinhoResumo;

// Função para inicializar elementos do carrinho
function inicializarElementosCarrinho() {
    carrinhoModal = document.getElementById('carrinhoModal');
    carrinhoBtn = document.querySelector('.carrinho-btn');
    fecharCarrinhoBtn = document.querySelector('.fechar-carrinho');
    carrinhoItems = document.querySelector('.carrinho-items');
    carrinhoContainer = document.querySelector('.carrinho-total');
    carrinhoContador = document.querySelector('.carrinho-contador');
    finalizarCompraBtn = document.querySelector('.finalizar-compra-btn');
    carrinhoResumo = document.querySelector('.carrinho-resumo');
}

// Sistema de Toasts
class ToastSystem {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 2000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas ${this.getIcon(type)}"></i>
            <span class="toast-message">${message}</span>
            <button class="toast-close" aria-label="Fechar notificação">
                <i class="fas fa-times"></i>
            </button>
        `;

        this.container.appendChild(toast);
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.removeToast(toast));
        setTimeout(() => this.removeToast(toast), duration);
    }

    removeToast(toast) {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }

    getIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }
}

const toasts = new ToastSystem();

function showToast(message, type = 'info', duration = 2000) {
    toasts.show(message, type, duration);
}

// Funções do carrinho
function adicionarAoCarrinho(nome, preco, unidade) {
    const itemExistente = carrinho.find(item => item.nome === nome);
    
    if (itemExistente) {
        itemExistente.quantidade += 1;
        itemExistente.subtotal = itemExistente.quantidade * itemExistente.preco;
    } else {
        carrinho.push({
            nome,
            preco,
            unidade,
            quantidade: 1,
            subtotal: preco
        });
    }
    
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarCarrinho();
    showToast(`${nome} adicionado ao carrinho`, 'success', 2000);
}

function atualizarCarrinho() {
    inicializarElementosCarrinho(); // Atualizar referências dos elementos
    
    // Atualizar contador do carrinho em todas as páginas
    if (carrinhoContador) {
        const totalItems = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
        carrinhoContador.textContent = totalItems;
    }

    // Se não estiver na página do carrinho, não precisa atualizar o resto
    if (!carrinhoItems) return;

    carrinhoItems.innerHTML = '';
    let subtotal = 0;
    
    carrinho.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'carrinho-item';
        itemElement.innerHTML = `
            <div class="item-info">
                <h4>${item.nome}</h4>
                <p>R$ ${item.preco.toFixed(2)} / ${item.unidade}</p>
            </div>
            <div class="item-quantidade">
                <button class="quantidade-btn diminuir" data-nome="${item.nome}">-</button>
                <span>${item.quantidade}</span>
                <button class="quantidade-btn aumentar" data-nome="${item.nome}">+</button>
            </div>
            <button class="remover-item" data-nome="${item.nome}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        carrinhoItems.appendChild(itemElement);
        subtotal += item.preco * item.quantidade;
    });

    // Atualizar resumo do pedido
    const subtotalElement = document.querySelector('#subtotal');
    const descontoElement = document.querySelector('#desconto');
    const totalElement = document.querySelector('#total');

    if (subtotalElement) subtotalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
    
    if (descontoElement) {
        const desconto = parseFloat(descontoElement.textContent.replace('R$ ', '')) || 0;
        descontoElement.textContent = `R$ ${desconto.toFixed(2)}`;
    }

    if (totalElement) {
        const desconto = descontoElement ? parseFloat(descontoElement.textContent.replace('R$ ', '')) || 0 : 0;
        const total = subtotal - desconto;
        totalElement.textContent = `R$ ${total.toFixed(2)}`;
    }
}

function alterarQuantidade(nome, delta) {
    const item = carrinho.find(item => item.nome === nome);
    if (item) {
        const novaQuantidade = Math.max(1, item.quantidade + delta);
        if (novaQuantidade !== item.quantidade) {
            item.quantidade = novaQuantidade;
            item.subtotal = item.quantidade * item.preco;
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            atualizarCarrinho();
            showToast(`Quantidade atualizada: ${nome}`, 'info', 2000);
        }
    }
}

function removerItem(nome) {
    carrinho = carrinho.filter(item => item.nome !== nome);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarCarrinho();
    showToast('Item removido do carrinho', 'info', 2000);
}

function inicializarCarrinho() {
    carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    inicializarElementosCarrinho();
    
    if (carrinhoBtn) {
        carrinhoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (carrinhoModal) {
                carrinhoModal.classList.add('active');
                atualizarCarrinho();
                document.body.style.overflow = 'hidden';
            }
        });
    }

    if (fecharCarrinhoBtn) {
        fecharCarrinhoBtn.addEventListener('click', () => {
            if (carrinhoModal) {
                carrinhoModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    if (carrinhoModal) {
        carrinhoModal.addEventListener('click', (e) => {
            if (e.target === carrinhoModal) {
                carrinhoModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    if (finalizarCompraBtn) {
        finalizarCompraBtn.addEventListener('click', () => {
            if (carrinho.length === 0) {
                showToast('Seu carrinho está vazio!', 'warning', 2000);
                return;
            }
            
            showToast('Compra finalizada com sucesso!', 'success', 2000);
            carrinho = [];
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            atualizarCarrinho();
            if (carrinhoModal) {
                carrinhoModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Event delegation para botões de quantidade e remover
    document.addEventListener('click', (e) => {
        const target = e.target;
        
        if (target.classList.contains('quantidade-btn')) {
            const nome = target.dataset.nome;
            const delta = target.classList.contains('diminuir') ? -1 : 1;
            alterarQuantidade(nome, delta);
        }
        
        if (target.classList.contains('remover-item') || target.closest('.remover-item')) {
            const nome = target.dataset.nome || target.closest('.remover-item').dataset.nome;
            removerItem(nome);
        }
    });

    atualizarCarrinho();
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    inicializarCarrinho();
    
    // Event delegation para botões de compra
    document.addEventListener('click', (e) => {
        const target = e.target;
        
        if (target.classList.contains('comprar-btn') || target.closest('.comprar-btn')) {
            const produto = target.closest('.produto-card');
            if (produto) {
                const nome = produto.querySelector('h3').textContent;
                const precoText = produto.querySelector('.preco').textContent;
                const preco = parseFloat(precoText.replace('R$ ', '').replace(',', '.'));
                adicionarAoCarrinho(nome, preco, 'kg');
            }
        }
        
        if (target.classList.contains('search-result-item') || target.closest('.search-result-item')) {
            const resultItem = target.closest('.search-result-item');
            if (resultItem) {
                const nome = resultItem.querySelector('.result-name').textContent;
                const precoText = resultItem.querySelector('.result-price').textContent;
                const preco = parseFloat(precoText.replace('R$ ', '').replace('/kg', '').replace(',', '.'));
                adicionarAoCarrinho(nome, preco, 'kg');
            }
        }
    });
});

const contatoForm = document.getElementById('contato-form');
if (contatoForm) {
    contatoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const mensagem = document.getElementById('mensagem').value;
        
        if (validarFormulario(nome, email, mensagem)) {
            showToast('Mensagem enviada com sucesso!', 'success', 2000);
            this.reset();
        }
    });
}

function validarFormulario(nome, email, mensagem) {
    if (!nome || !email || !mensagem) {
        showToast('Por favor, preencha todos os campos.', 'error', 2000);
        return false;
    }
    
    if (!validarEmail(email)) {
        showToast('Por favor, insira um email válido.', 'error', 2000);
        return false;
    }
    
    return true;
}

function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('teclado-navegacao');
    }
});

const style = document.createElement('style');
style.textContent = `
    .notificacao {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--success-color);
        color: var(--primary-color);
        padding: 1rem;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(92, 82, 89, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        border: 2px solid var(--accent-color);
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .teclado-navegacao *:focus {
        outline: 3px solid var(--accent-color);
        outline-offset: 2px;
    }
`;

document.head.appendChild(style);

document.querySelectorAll('img').forEach(img => {
    if (!img.alt) {
        img.setAttribute('alt', 'Imagem descritiva');
    }
});

const menuButton = document.createElement('button');
menuButton.className = 'menu-button';
menuButton.setAttribute('aria-label', 'Abrir menu');
menuButton.innerHTML = '<i class="fas fa-bars"></i>';

const nav = document.querySelector('nav');
if (nav) {
    nav.prepend(menuButton);

    menuButton.addEventListener('click', function() {
        const navLinks = document.querySelector('.nav-links');
        const isExpanded = navLinks.classList.toggle('show');
        this.setAttribute('aria-expanded', isExpanded);
    });
}

document.querySelectorAll('.faq-pergunta').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.parentElement;
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) {
                item.classList.remove('active');
                item.querySelector('.faq-pergunta').setAttribute('aria-expanded', 'false');
            }
        });
        
        faqItem.classList.toggle('active');
        button.setAttribute('aria-expanded', !isExpanded);
    });
});

const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('newsletter-email').value;
        
        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                showToast('Cadastro realizado com sucesso!', 'success');
                newsletterForm.reset();
            } else {
                throw new Error('Erro ao cadastrar');
            }
        } catch (error) {
            showToast('Erro ao cadastrar. Tente novamente.', 'error');
        }
    });
}

const cupomInput = document.getElementById('cupom');
const aplicarCupomBtn = document.querySelector('.aplicar-cupom-btn');

if (cupomInput && aplicarCupomBtn) {
    aplicarCupomBtn.addEventListener('click', async () => {
        const cupom = cupomInput.value;
        if (cupom.length === 0) return;

        try {
            const response = await fetch(`/api/cupom/${cupom}`);
            const data = await response.json();
            
            if (data.valido) {
                showToast('Cupom aplicado com sucesso!', 'success');
                aplicarDesconto(data.desconto);
            } else {
                showToast('Cupom inválido', 'error');
            }
        } catch (error) {
            showToast('Erro ao validar cupom', 'error');
        }
    });
}

function aplicarDesconto(desconto) {
    const subtotalElement = document.getElementById('subtotal');
    const descontoElement = document.getElementById('desconto');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement && descontoElement && totalElement) {
        const subtotal = parseFloat(subtotalElement.textContent.replace('R$ ', ''));
        const valorDesconto = subtotal * desconto;
        const total = subtotal - valorDesconto;
        
        descontoElement.textContent = `R$ ${valorDesconto.toFixed(2)}`;
        totalElement.textContent = `R$ ${total.toFixed(2)}`;
    }
}

const elementos = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

elementos.forEach(elemento => observer.observe(elemento));

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('carrinhoModal');
        if (modal && !modal.classList.contains('hidden')) {
            fecharCarrinho();
        }
    }
});

function setLoading(element, isLoading) {
    if (isLoading) {
        element.classList.add('loading');
    } else {
        element.classList.remove('loading');
    }
}

// Sistema de Busca
function realizarBusca() {
    const searchInput = document.querySelector('.search-input, #searchInput');
    const searchButton = document.querySelector('.search-button, #searchButton');
    const searchTerm = searchInput ? searchInput.value.trim() : '';

    if (searchTerm) {
        // Se estiver na página de produtos, filtra os produtos
        if (window.location.pathname.includes('produtos.html')) {
            filtrarProdutos();
        } else {
            // Em outras páginas, redireciona para produtos.html com o termo de busca
            window.location.href = `produtos.html?busca=${encodeURIComponent(searchTerm)}`;
        }
    }
}

// Adicionar event listeners para a busca
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input, #searchInput');
    const searchButton = document.querySelector('.search-button, #searchButton');

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                realizarBusca();
            }
        });
    }

    if (searchButton) {
        searchButton.addEventListener('click', realizarBusca);
    }

    // Preencher o campo de busca se houver um termo na URL
    const urlParams = new URLSearchParams(window.location.search);
    const buscaTerm = urlParams.get('busca');
    if (buscaTerm && searchInput) {
        searchInput.value = decodeURIComponent(buscaTerm);
        if (window.location.pathname.includes('produtos.html')) {
            filtrarProdutos();
        }
    }
});

// Função para filtrar produtos na página de produtos
function filtrarProdutos() {
    const searchInput = document.querySelector('.search-input, #searchInput');
    const categoriaSelect = document.getElementById('categoria');
    const precoSelect = document.getElementById('preco');
    const ordenacaoSelect = document.getElementById('ordenacao');
    const produtosGrid = document.querySelector('.produtos-grid');
    const semResultados = document.querySelector('.sem-resultados');

    if (!produtosGrid) return;

    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const categoria = categoriaSelect ? categoriaSelect.value : 'todos';
    const preco = precoSelect ? precoSelect.value : 'todos';
    const ordenacao = ordenacaoSelect ? ordenacaoSelect.value : 'nome';

    let produtos = Array.from(produtosGrid.children);

    // Filtrar por busca
    if (searchTerm) {
        produtos = produtos.filter(produto => {
            const nome = produto.querySelector('h3').textContent.toLowerCase();
            const descricao = produto.querySelector('p').textContent.toLowerCase();
            return nome.includes(searchTerm) || descricao.includes(searchTerm);
        });
    }

    // Filtrar por categoria
    if (categoria !== 'todos') {
        produtos = produtos.filter(produto => {
            const produtoCategoria = produto.dataset.categoria || 'frutas';
            return produtoCategoria === categoria;
        });
    }

    // Filtrar por preço
    if (preco !== 'todos') {
        produtos = produtos.filter(produto => {
            const precoTexto = produto.querySelector('.preco').textContent;
            const precoNumero = parseFloat(precoTexto.replace('R$ ', '').replace(',', '.'));
            
            switch(preco) {
                case '0-10':
                    return precoNumero <= 10;
                case '10-20':
                    return precoNumero > 10 && precoNumero <= 20;
                case '20-30':
                    return precoNumero > 20 && precoNumero <= 30;
                case '30+':
                    return precoNumero > 30;
                default:
                    return true;
            }
        });
    }

    // Ordenar produtos
    produtos.sort((a, b) => {
        const nomeA = a.querySelector('h3').textContent;
        const nomeB = b.querySelector('h3').textContent;
        const precoA = parseFloat(a.querySelector('.preco').textContent.replace('R$ ', '').replace(',', '.'));
        const precoB = parseFloat(b.querySelector('.preco').textContent.replace('R$ ', '').replace(',', '.'));
        const avaliacaoA = parseInt(a.querySelector('.rating').getAttribute('data-avaliacao') || '0');
        const avaliacaoB = parseInt(b.querySelector('.rating').getAttribute('data-avaliacao') || '0');

        switch(ordenacao) {
            case 'nome':
                return nomeA.localeCompare(nomeB);
            case 'preco-asc':
                return precoA - precoB;
            case 'preco-desc':
                return precoB - precoA;
            case 'avaliacao':
                return avaliacaoB - avaliacaoA;
            default:
                return 0;
        }
    });

    // Limpar grid e adicionar produtos filtrados
    produtosGrid.innerHTML = '';
    produtos.forEach(produto => produtosGrid.appendChild(produto));

    // Mostrar mensagem de sem resultados
    if (semResultados) {
        if (produtos.length === 0) {
            semResultados.style.display = 'block';
        } else {
            semResultados.style.display = 'none';
        }
    }
}

// Adicionar event listeners para os filtros
document.addEventListener('DOMContentLoaded', () => {
    const categoriaSelect = document.getElementById('categoria');
    const precoSelect = document.getElementById('preco');
    const ordenacaoSelect = document.getElementById('ordenacao');

    if (categoriaSelect) categoriaSelect.addEventListener('change', filtrarProdutos);
    if (precoSelect) precoSelect.addEventListener('change', filtrarProdutos);
    if (ordenacaoSelect) ordenacaoSelect.addEventListener('change', filtrarProdutos);

    // Executar filtro inicial se houver parâmetros de busca na URL
    if (window.location.search) {
        filtrarProdutos();
    }
});

// Lista de produtos disponíveis em todas as páginas
const produtosDisponiveis = [
    {
        nome: "Maçãs Vermelhas",
        preco: "R$ 12,90",
        imagem: "https://th.bing.com/th/id/OIP.DnBqF1misIba7yN3lja2fwHaHb?rs=1&pid=ImgDetMain",
        descricao: "Maçãs vermelhas frescas e suculentas, colhidas diariamente."
    },
    {
        nome: "Bananas Prata",
        preco: "R$ 8,90",
        imagem: "https://th.bing.com/th/id/OIP.7w4kPAYPE_ecMisRzA1qJwAAAA?rs=1&pid=ImgDetMain",
        descricao: "Bananas prata maduras e doces, perfeitas para consumo imediato."
    },
    {
        nome: "Morangos",
        preco: "R$ 15,90",
        imagem: "https://img.quizur.com/f/img605f9cc0c5aba4.57840816.jpg?lastEdited=1616878788",
        descricao: "Morangos frescos e doces, colhidos na hora."
    },
    {
        nome: "Uvas",
        preco: "R$ 14,90",
        imagem: "https://th.bing.com/th/id/OIP.aJ3nuGpglx0SunU0C5FKAwHaEK?rs=1&pid=ImgDetMain",
        descricao: "Uvas doces e suculentas, disponíveis em diferentes variedades."
    },
    {
        nome: "Abacaxis",
        preco: "R$ 16,90",
        imagem: "https://th.bing.com/th/id/OIP.04Hxw701P8-1cR-o_Gew5wHaEK?rs=1&pid=ImgDetMain",
        descricao: "Abacaxis maduros e doces, prontos para consumo."
    }
];

// Função para realizar busca dinâmica
function realizarBuscaDinamica(termo) {
    const searchResults = document.querySelector('.search-results');
    
    if (!termo || termo.length < 2) {
        searchResults.classList.remove('active');
        return;
    }

    const resultados = produtosDisponiveis.filter(produto => {
        const nome = produto.nome.toLowerCase();
        const descricao = produto.descricao.toLowerCase();
        return nome.includes(termo.toLowerCase()) || descricao.includes(termo.toLowerCase());
    });

    if (resultados.length > 0) {
        searchResults.innerHTML = resultados.map(produto => `
            <div class="search-result-item">
                <img src="${produto.imagem}" alt="${produto.nome}">
                <div class="result-info">
                    <div class="result-name">${produto.nome}</div>
                    <div class="result-price">${produto.preco}/kg</div>
                </div>
            </div>
        `).join('');
        searchResults.classList.add('active');
    } else {
        searchResults.innerHTML = '<div class="search-result-item">Nenhum produto encontrado</div>';
        searchResults.classList.add('active');
    }
}

// Adicionar eventos de busca dinâmica
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');

    if (searchInput) {
        // Evento de digitação
        searchInput.addEventListener('input', (e) => {
            realizarBuscaDinamica(e.target.value);
        });

        // Evento de clique no botão de busca
        const searchButton = document.querySelector('.search-button');
        if (searchButton) {
            searchButton.addEventListener('click', () => {
                realizarBuscaDinamica(searchInput.value);
            });
        }

        // Evento de tecla Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                realizarBuscaDinamica(searchInput.value);
            }
        });

        // Fechar resultados ao clicar fora
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.remove('active');
            }
        });

        // Navegação pelos resultados com teclas
        searchInput.addEventListener('keydown', (e) => {
            const items = searchResults.querySelectorAll('.search-result-item');
            const activeItem = searchResults.querySelector('.search-result-item.active');
            
            if (e.key === 'ArrowDown' && items.length > 0) {
                e.preventDefault();
                if (!activeItem) {
                    items[0].classList.add('active');
                } else {
                    const nextItem = activeItem.nextElementSibling;
                    if (nextItem) {
                        activeItem.classList.remove('active');
                        nextItem.classList.add('active');
                    }
                }
            } else if (e.key === 'ArrowUp' && activeItem) {
                e.preventDefault();
                const prevItem = activeItem.previousElementSibling;
                if (prevItem) {
                    activeItem.classList.remove('active');
                    prevItem.classList.add('active');
                }
            } else if (e.key === 'Enter' && activeItem) {
                e.preventDefault();
                const nome = activeItem.querySelector('.result-name').textContent;
                searchInput.value = nome;
                searchResults.classList.remove('active');
                realizarBusca(nome);
            }
        });
    }
});

// Lista de produtos com informações detalhadas
const produtosDetalhados = {
    "Maçãs Vermelhas": {
        nome: "Maçãs Vermelhas",
        preco: 12.90,
        imagem: "https://th.bing.com/th/id/OIP.DnBqF1misIba7yN3lja2fwHaHb?rs=1&pid=ImgDetMain",
        descricao: "Maçãs vermelhas frescas e suculentas, colhidas diariamente. Nossas maçãs são cultivadas com cuidado e amor, garantindo o melhor sabor e qualidade. Ideais para consumo in natura, sobremesas ou sucos.",
        categoria: "frutas",
        nutricional: [
            { nome: "Calorias", valor: "52 kcal" },
            { nome: "Carboidratos", valor: "14g" },
            { nome: "Proteínas", valor: "0.3g" },
            { nome: "Fibras", valor: "2.4g" },
            { nome: "Vitamina C", valor: "4.6mg" }
        ],
        avaliacao: 4.5,
        avaliacoes: 127
    },
    "Bananas Prata": {
        nome: "Bananas Prata",
        preco: 8.90,
        imagem: "https://th.bing.com/th/id/OIP.7w4kPAYPE_ecMisRzA1qJwAAAA?rs=1&pid=ImgDetMain",
        descricao: "Bananas prata maduras e doces, perfeitas para consumo imediato. Cultivadas em solo rico em nutrientes, nossas bananas são fonte natural de energia e sabor. Excelentes para lanches, vitaminas ou sobremesas.",
        categoria: "frutas",
        nutricional: [
            { nome: "Calorias", valor: "89 kcal" },
            { nome: "Carboidratos", valor: "22.8g" },
            { nome: "Proteínas", valor: "1.1g" },
            { nome: "Fibras", valor: "2.6g" },
            { nome: "Potássio", valor: "358mg" }
        ],
        avaliacao: 4.8,
        avaliacoes: 156
    },
    "Morangos": {
        nome: "Morangos",
        preco: 15.90,
        imagem: "https://img.quizur.com/f/img605f9cc0c5aba4.57840816.jpg?lastEdited=1616878788",
        descricao: "Morangos frescos e doces, colhidos na hora. Selecionados a dedo para garantir a melhor qualidade. Perfeitos para consumo in natura, sobremesas ou sucos.",
        categoria: "frutas",
        nutricional: [
            { nome: "Calorias", valor: "32 kcal" },
            { nome: "Carboidratos", valor: "7.7g" },
            { nome: "Proteínas", valor: "0.7g" },
            { nome: "Fibras", valor: "2g" },
            { nome: "Vitamina C", valor: "58.8mg" }
        ],
        avaliacao: 4.7,
        avaliacoes: 98
    }
};

// Função para redirecionar para a página de detalhes do produto
function redirecionarParaDetalhes(nome) {
    window.location.href = `produto.html?produto=${encodeURIComponent(nome)}`;
}

// Função para carregar os detalhes do produto na página de produto
function carregarDetalhesProduto() {
    if (!window.location.pathname.includes('produto.html')) return;

    const params = new URLSearchParams(window.location.search);
    const nomeProduto = decodeURIComponent(params.get('produto'));
    const produto = produtosDetalhados[nomeProduto];

    if (!produto) {
        window.location.href = 'produtos.html';
        return;
    }

    // Atualizar elementos da página
    document.title = `${produto.nome} - Frutas Frescas`;
    document.getElementById('produto-img').src = produto.imagem;
    document.getElementById('produto-img').alt = produto.nome;
    document.getElementById('produto-nome').textContent = produto.nome;
    document.getElementById('produto-preco').textContent = `R$ ${produto.preco.toFixed(2)}`;
    document.getElementById('produto-descricao').textContent = produto.descricao;

    // Atualizar informações nutricionais
    const nutriList = document.getElementById('produto-nutricional');
    nutriList.innerHTML = produto.nutricional.map(info => `
        <li>
            <span>${info.nome}</span>
            <span>${info.valor}</span>
        </li>
    `).join('');

    // Atualizar avaliação
    const rating = document.getElementById('produto-rating');
    rating.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('i');
        star.className = 'fas fa-star' + (i <= produto.avaliacao ? '' : 
            (i - produto.avaliacao < 1 ? '-half-alt' : '-o'));
        rating.appendChild(star);
    }
    document.querySelector('.avaliacoes-count').textContent = `(${produto.avaliacoes} avaliações)`;

    // Carregar produtos relacionados
    const produtosRelacionados = Object.values(produtosDetalhados)
        .filter(p => p.nome !== produto.nome)
        .slice(0, 3);

    const produtosGrid = document.querySelector('.produtos-grid');
    produtosGrid.innerHTML = produtosRelacionados.map(p => `
        <div class="produto-card" onclick="redirecionarParaDetalhes('${p.nome}')">
            <img src="${p.imagem}" alt="${p.nome}">
            <h3>${p.nome}</h3>
            <p class="preco">R$ ${p.preco.toFixed(2)}/kg</p>
            <button class="comprar-btn">
                <i class="fas fa-shopping-cart"></i>
                Ver Detalhes
            </button>
        </div>
    `).join('');

    // Adicionar event listeners para quantidade
    const quantidadeInput = document.getElementById('quantidade');
    document.querySelector('.quantidade-btn.diminuir').addEventListener('click', () => {
        const valor = parseInt(quantidadeInput.value);
        if (valor > 1) quantidadeInput.value = valor - 1;
    });

    document.querySelector('.quantidade-btn.aumentar').addEventListener('click', () => {
        const valor = parseInt(quantidadeInput.value);
        quantidadeInput.value = valor + 1;
    });

    // Event listener para adicionar ao carrinho
    document.querySelector('.produto-acoes .comprar-btn').addEventListener('click', () => {
        const quantidade = parseInt(quantidadeInput.value);
        for (let i = 0; i < quantidade; i++) {
            adicionarAoCarrinho(produto.nome, produto.preco, 'kg');
        }
    });
}

// Adicionar event listener para clique nos produtos
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...

    // Adicionar evento de clique nos cards de produtos
    document.querySelectorAll('.produto-card').forEach(card => {
        const nome = card.querySelector('h3').textContent;
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('comprar-btn')) {
                redirecionarParaDetalhes(nome);
            }
        });
    });

    // Carregar detalhes do produto se estiver na página de produto
    carregarDetalhesProduto();
}); 