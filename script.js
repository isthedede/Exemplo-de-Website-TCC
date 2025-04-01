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
        imagem: "https://www.infoescola.com/wp-content/uploads/2021/09/maca-red-1102078_1920-1536x1017.jpg",
        descricao: "Maçãs frescas e crocantes, ricas em fibras e vitaminas.",
        categoria: "frutas",
        avaliacao: 4.5
    },
    {
        nome: "Bananas Prata",
        preco: "R$ 8,90",
        imagem: "https://www.tastingtable.com/img/gallery/the-real-difference-between-bananas-and-baby-bananas/l-intro-1663622196.jpg",
        descricao: "Bananas prata maduras e doces, perfeitas para consumo.",
        categoria: "frutas",
        avaliacao: 3.0
    },
    {
        nome: "Laranjas",
        preco: "R$ 7,90",
        imagem: "https://th.bing.com/th/id/OIP.KcAlyW4W4Uh3saa4J9rotAHaHa?rs=1&pid=ImgDetMain",
        descricao: "Laranjas suculentas e ricas em vitamina C.",
        categoria: "frutas",
        avaliacao: 5.0
    },
    {
        nome: "Morangos",
        preco: "R$ 15,90",
        imagem: "https://img.quizur.com/f/img605f9cc0c5aba4.57840816.jpg?lastEdited=1616878788",
        descricao: "Morangos frescos e doces, ricos em antioxidantes.",
        categoria: "frutas",
        avaliacao: 2.5
    },
    {
        nome: "Uvas",
        preco: "R$ 18,90",
        imagem: "https://www.ecestaticos.com/image/clipping/20d79ca06459672307da435a850b5285/temporada-de-uvas-tres-grandes-platos-que-puedes-cocinar-con-ellas.jpg",
        descricao: "Uvas doces e sem sementes, perfeitas para consumo.",
        categoria: "frutas",
        avaliacao: 3.5
    },
    {
        nome: "Abacaxis",
        preco: "R$ 12,90",
        imagem: "https://th.bing.com/th/id/OIP.AeEePlRt-a59rneF9Cd4yAHaFj?rs=1&pid=ImgDetMain",
        descricao: "Abacaxis maduros e doces, prontos para consumo.",
        categoria: "frutas",
        avaliacao: 4.0
    },
    {
        nome: "Cenouras",
        preco: "R$ 5,90",
        imagem: "https://www.infoescola.com/wp-content/uploads/2010/08/cenoura_250834906.jpg",
        descricao: "Cenouras frescas e crocantes, ricas em vitamina A.",
        categoria: "legumes",
        avaliacao: 4.2
    },
    {
        nome: "Tomates",
        preco: "R$ 9,90",
        imagem: "https://th.bing.com/th/id/R.6d6c5f1327c4294e1534b4a91f35dd78?rik=Gh1tkiq8dhKRqw&pid=ImgRaw&r=0",
        descricao: "Tomates maduros e suculentos, perfeitos para saladas.",
        categoria: "legumes",
        avaliacao: 3.7
    },
    {
        nome: "Batatas",
        preco: "R$ 6,90",
        imagem: "https://revistasaboresdosul.com.br/wp-content/uploads/2020/06/batatas-2.jpg",
        descricao: "Batatas selecionadas, perfeitas para diversos preparos.",
        categoria: "legumes",
        avaliacao: 4.3
    },
    {
        nome: "Beterrabas",
        preco: "R$ 7,90",
        imagem: "https://th.bing.com/th/id/OIP.kSOkRyQbG1PfjvOOGkQzZQHaE6?rs=1&pid=ImgDetMain",
        descricao: "Beterrabas frescas e suculentas, ricas em nutrientes.",
        categoria: "legumes",
        avaliacao: 3.8
    },
    {
        nome: "Alface Crespa",
        preco: "R$ 3,90",
        imagem: "https://th.bing.com/th/id/OIP.hoJy8VJuV0kBWl6Xi9uAxQHaE8?rs=1&pid=ImgDetMain",
        descricao: "Alface crespa fresca e crocante, colhida no dia.",
        categoria: "verduras",
        avaliacao: 4.8
    },
    {
        nome: "Couve",
        preco: "R$ 4,50",
        imagem: "https://th.bing.com/th/id/R.94f51587d5ea2a093619cbc63cddad20?rik=ydhsBmdwpBqccQ&riu=http%3a%2f%2f4.bp.blogspot.com%2f-vhdGJ5-KIiE%2fUTd7DXI_7fI%2fAAAAAAAATBk%2fWM4PVCnduv4%2fs1600%2fcouve.jpg&ehk=1vY04UejPQOlbI6z4%2b573tQmM%2bguw6rlZINmZy9Bnfc%3d&risl=&pid=ImgRaw&r=0",
        descricao: "Couve fresca e tenra, rica em vitaminas e minerais.",
        categoria: "verduras",
        avaliacao: 4.1
    },
    {
        nome: "Espinafre",
        preco: "R$ 5,90",
        imagem: "https://www.infoescola.com/wp-content/uploads/2010/02/espinafre_224442694.jpg",
        descricao: "Espinafre fresco e nutritivo, fonte de ferro.",
        categoria: "verduras",
        avaliacao: 3.9
    }
];

// Função para filtrar e ordenar produtos
function filtrarEOrdenarProdutos() {
    const categoria = document.getElementById('categoria').value;
    const faixaPreco = document.getElementById('preco').value;
    const ordenacao = document.getElementById('ordenacao').value;

    let produtosFiltrados = [...produtosDisponiveis];

    // Filtrar por categoria
    if (categoria !== 'todos') {
        produtosFiltrados = produtosFiltrados.filter(produto => produto.categoria === categoria);
    }

    // Filtrar por faixa de preço
    if (faixaPreco !== 'todos') {
        const [min, max] = faixaPreco.split('-').map(valor => parseFloat(valor));
        produtosFiltrados = produtosFiltrados.filter(produto => {
            const preco = parseFloat(produto.preco.replace('R$ ', '').replace(',', '.'));
            if (max) {
                return preco >= min && preco <= max;
            } else {
                return preco >= min;
            }
        });
    }

    // Ordenar produtos
    produtosFiltrados.sort((a, b) => {
        const precoA = parseFloat(a.preco.replace('R$ ', '').replace(',', '.'));
        const precoB = parseFloat(b.preco.replace('R$ ', '').replace(',', '.'));

        switch (ordenacao) {
            case 'nome':
                return a.nome.localeCompare(b.nome);
            case 'preco-asc':
                return precoA - precoB;
            case 'preco-desc':
                return precoB - precoA;
            case 'avaliacao':
                return (b.avaliacao || 0) - (a.avaliacao || 0);
            default:
                return 0;
        }
    });

    // Atualizar a exibição dos produtos
    const produtosGrid = document.querySelector('.produtos-grid');
    if (produtosGrid) {
        produtosGrid.innerHTML = '';
        produtosFiltrados.forEach(produto => {
            // Definir uma avaliação para cada produto se não existir
            if (!produto.avaliacao) {
                switch (produto.nome) {
                    case "Maçãs Vermelhas": produto.avaliacao = 4.5; break;
                    case "Bananas Prata": produto.avaliacao = 3.0; break;
                    case "Laranjas": produto.avaliacao = 5.0; break;
                    case "Morangos": produto.avaliacao = 2.5; break;
                    case "Uvas": produto.avaliacao = 3.5; break;
                    case "Abacaxis": produto.avaliacao = 4.0; break;
                    default: produto.avaliacao = Math.floor(Math.random() * 4) + 1 + (Math.random() > 0.5 ? 0.5 : 0);
                }
            }
            
            // Gerar HTML das estrelas com base na avaliação
            let starsHtml = '';
            const avaliacao = produto.avaliacao;
            for (let i = 1; i <= 5; i++) {
                if (i <= Math.floor(avaliacao)) {
                    starsHtml += '<i class="fas fa-star"></i>';
                } else if (i - avaliacao < 1 && i - avaliacao > 0) {
                    starsHtml += '<i class="fas fa-star-half-alt"></i>';
                } else {
                    starsHtml += '<i class="far fa-star"></i>';
                }
            }
            
            const card = document.createElement('div');
            card.className = 'produto-card';
            card.innerHTML = `
                <img src="${produto.imagem}" alt="${produto.nome}">
                <h3 class="produto-titulo">${produto.nome}</h3>
                <p>${produto.descricao}</p>
                <div class="rating" data-avaliacao="${produto.avaliacao}">
                    ${starsHtml}
                </div>
                <div class="preco">
                    ${produto.preco}
                    <span class="unidade">/kg</span>
                </div>
                <div class="produto-acoes">
                    <button class="comprar-btn" role="button" aria-label="Comprar ${produto.nome}">Adicionar ao Carrinho</button>
                    <button class="favorito-btn" aria-label="Adicionar aos favoritos">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            `;
            produtosGrid.appendChild(card);
            
            // Adicionar evento de clique para o card
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('comprar-btn') && !e.target.classList.contains('favorito-btn') && !e.target.closest('.favorito-btn')) {
                    redirecionarParaDetalhes(produto.nome);
                }
            });
            
            // Adicionar evento para o botão de compra
            const comprarBtn = card.querySelector('.comprar-btn');
            comprarBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const precoNumerico = parseFloat(produto.preco.replace('R$ ', '').replace(',', '.'));
                adicionarAoCarrinho(produto.nome, precoNumerico, 'kg');
            });
        });
    }
}

// Adicionar event listeners para os filtros
document.addEventListener('DOMContentLoaded', () => {
    const categoria = document.getElementById('categoria');
    const faixaPreco = document.getElementById('preco');
    const ordenacao = document.getElementById('ordenacao');

    if (categoria && faixaPreco && ordenacao) {
        categoria.addEventListener('change', filtrarEOrdenarProdutos);
        faixaPreco.addEventListener('change', filtrarEOrdenarProdutos);
        ordenacao.addEventListener('change', filtrarEOrdenarProdutos);

        // Carregar produtos iniciais
        filtrarEOrdenarProdutos();
    }
});

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
            <div class="search-result-item" data-produto="${produto.nome}">
                <img src="${produto.imagem}" alt="${produto.nome}">
                <div class="result-info">
                    <div class="result-name">${produto.nome}</div>
                    <div class="result-price">${produto.preco}/kg</div>
                </div>
            </div>
        `).join('');
        
        // Adicionar eventos de clique aos resultados
        document.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const nomeProduto = item.getAttribute('data-produto');
                redirecionarParaDetalhes(nomeProduto);
            });
        });
        
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
        imagem: "https://www.tastingtable.com/img/gallery/the-real-difference-between-bananas-and-baby-bananas/l-intro-1663622196.jpg",
        descricao: "Bananas prata maduras e doces, perfeitas para consumo.",
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
        descricao: "Morangos frescos e doces, ricos em antioxidantes.",
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
    },
    "Laranjas": {
        nome: "Laranjas",
        preco: 7.90,
        imagem: "https://th.bing.com/th/id/OIP.KcAlyW4W4Uh3saa4J9rotAHaHa?rs=1&pid=ImgDetMain",
        descricao: "Laranjas suculentas e ricas em vitamina C. Cultivadas em pomares ensolarados, nossas laranjas são colhidas no ponto ideal de maturação para garantir o melhor sabor e qualidade. Perfeitas para sucos naturais ou consumo in natura.",
        categoria: "frutas",
        nutricional: [
            { nome: "Calorias", valor: "43 kcal" },
            { nome: "Carboidratos", valor: "8.3g" },
            { nome: "Proteínas", valor: "1g" },
            { nome: "Fibras", valor: "2.4g" },
            { nome: "Vitamina C", valor: "53.2mg" }
        ],
        avaliacao: 5.0,
        avaliacoes: 143
    },
    "Uvas": {
        nome: "Uvas",
        preco: 18.90,
        imagem: "https://www.ecestaticos.com/image/clipping/20d79ca06459672307da435a850b5285/temporada-de-uvas-tres-grandes-platos-que-puedes-cocinar-con-ellas.jpg",
        descricao: "Uvas doces e sem sementes, perfeitas para consumo. Selecionadas a dedo, nossas uvas são cultivadas com cuidado para garantir sabor e qualidade. Ideais para consumo in natura, sobremesas ou acompanhamentos.",
        categoria: "frutas",
        nutricional: [
            { nome: "Calorias", valor: "67 kcal" },
            { nome: "Carboidratos", valor: "17.2g" },
            { nome: "Proteínas", valor: "0.6g" },
            { nome: "Fibras", valor: "0.9g" },
            { nome: "Vitamina C", valor: "3.2mg" }
        ],
        avaliacao: 4.6,
        avaliacoes: 118
    },
    "Abacaxis": {
        nome: "Abacaxis",
        preco: 12.90,
        imagem: "https://th.bing.com/th/id/OIP.AeEePlRt-a59rneF9Cd4yAHaFj?rs=1&pid=ImgDetMain",
        descricao: "Abacaxis maduros e doces, prontos para consumo. Cultivados em solo rico, nossos abacaxis são fonte de sabor e nutrientes. Perfeitos para consumo in natura, sucos ou sobremesas.",
        categoria: "frutas",
        nutricional: [
            { nome: "Calorias", valor: "50 kcal" },
            { nome: "Carboidratos", valor: "13.1g" },
            { nome: "Proteínas", valor: "0.5g" },
            { nome: "Fibras", valor: "1.4g" },
            { nome: "Vitamina C", valor: "47.8mg" }
        ],
        avaliacao: 4.8,
        avaliacoes: 92
    },
    "Cenouras": {
        nome: "Cenouras",
        preco: 5.90,
        imagem: "https://www.infoescola.com/wp-content/uploads/2010/08/cenoura_250834906.jpg",
        descricao: "Cenouras frescas e crocantes, ricas em vitamina A. Cultivadas com cuidado, nossas cenouras são colhidas no ponto certo para garantir sabor e qualidade. Excelentes para saladas, sucos ou pratos quentes.",
        categoria: "legumes",
        nutricional: [
            { nome: "Calorias", valor: "41 kcal" },
            { nome: "Carboidratos", valor: "9.6g" },
            { nome: "Proteínas", valor: "0.9g" },
            { nome: "Fibras", valor: "2.8g" },
            { nome: "Vitamina A", valor: "835µg" }
        ],
        avaliacao: 4.2,
        avaliacoes: 78
    },
    "Tomates": {
        nome: "Tomates",
        preco: 9.90,
        imagem: "https://th.bing.com/th/id/R.6d6c5f1327c4294e1534b4a91f35dd78?rik=Gh1tkiq8dhKRqw&pid=ImgRaw&r=0",
        descricao: "Tomates maduros e suculentos, perfeitos para saladas. Cultivados com técnicas sustentáveis, nossos tomates são colhidos no ponto certo de maturação. Excelentes para saladas, molhos ou sanduíches.",
        categoria: "legumes",
        nutricional: [
            { nome: "Calorias", valor: "18 kcal" },
            { nome: "Carboidratos", valor: "3.9g" },
            { nome: "Proteínas", valor: "0.9g" },
            { nome: "Fibras", valor: "1.2g" },
            { nome: "Vitamina C", valor: "13.7mg" }
        ],
        avaliacao: 4.5,
        avaliacoes: 83
    },
    "Batatas": {
        nome: "Batatas",
        preco: 6.90,
        imagem: "https://revistasaboresdosul.com.br/wp-content/uploads/2020/06/batatas-2.jpg",
        descricao: "Batatas selecionadas, perfeitas para diversos preparos. Nossas batatas são cultivadas em solo fértil para garantir sabor e textura ideais. Versáteis para fritar, assar ou cozinhar.",
        categoria: "legumes",
        nutricional: [
            { nome: "Calorias", valor: "77 kcal" },
            { nome: "Carboidratos", valor: "17.5g" },
            { nome: "Proteínas", valor: "2g" },
            { nome: "Fibras", valor: "2.2g" },
            { nome: "Potássio", valor: "421mg" }
        ],
        avaliacao: 4.3,
        avaliacoes: 105
    },
    "Beterrabas": {
        nome: "Beterrabas",
        preco: 7.90,
        imagem: "https://th.bing.com/th/id/OIP.kSOkRyQbG1PfjvOOGkQzZQHaE6?rs=1&pid=ImgDetMain",
        descricao: "Beterrabas frescas e suculentas, ricas em nutrientes. Cultivadas com amor, nossas beterrabas são colhidas no ponto ideal. Excelentes para saladas, sucos ou pratos quentes.",
        categoria: "legumes",
        nutricional: [
            { nome: "Calorias", valor: "43 kcal" },
            { nome: "Carboidratos", valor: "9.6g" },
            { nome: "Proteínas", valor: "1.6g" },
            { nome: "Fibras", valor: "2.8g" },
            { nome: "Folato", valor: "109µg" }
        ],
        avaliacao: 4.0,
        avaliacoes: 67
    },
    "Alface Crespa": {
        nome: "Alface Crespa",
        preco: 3.90,
        imagem: "https://th.bing.com/th/id/OIP.hoJy8VJuV0kBWl6Xi9uAxQHaE8?rs=1&pid=ImgDetMain",
        descricao: "Alface crespa fresca e crocante, colhida no dia. Nossa alface é cultivada com técnicas sustentáveis para garantir sabor e frescor. Perfeita para saladas, sanduíches ou acompanhamentos.",
        categoria: "verduras",
        nutricional: [
            { nome: "Calorias", valor: "15 kcal" },
            { nome: "Carboidratos", valor: "2.9g" },
            { nome: "Proteínas", valor: "1.4g" },
            { nome: "Fibras", valor: "1.3g" },
            { nome: "Vitamina A", valor: "166µg" }
        ],
        avaliacao: 4.7,
        avaliacoes: 89
    },
    "Couve": {
        nome: "Couve",
        preco: 4.50,
        imagem: "https://th.bing.com/th/id/R.94f51587d5ea2a093619cbc63cddad20?rik=ydhsBmdwpBqccQ&riu=http%3a%2f%2f4.bp.blogspot.com%2f-vhdGJ5-KIiE%2fUTd7DXI_7fI%2fAAAAAAAATBk%2fWM4PVCnduv4%2fs1600%2fcouve.jpg&ehk=1vY04UejPQOlbI6z4%2b573tQmM%2bguw6rlZINmZy9Bnfc%3d&risl=&pid=ImgRaw&r=0",
        descricao: "Couve fresca e tenra, rica em vitaminas e minerais. Cultivada com cuidado, nossa couve é colhida diariamente para garantir frescor e qualidade. Excelente para saladas, refogados ou sucos verdes.",
        categoria: "verduras",
        nutricional: [
            { nome: "Calorias", valor: "49 kcal" },
            { nome: "Carboidratos", valor: "8.8g" },
            { nome: "Proteínas", valor: "3.3g" },
            { nome: "Fibras", valor: "3.6g" },
            { nome: "Vitamina K", valor: "817µg" }
        ],
        avaliacao: 4.4,
        avaliacoes: 72
    },
    "Espinafre": {
        nome: "Espinafre",
        preco: 5.90,
        imagem: "https://www.infoescola.com/wp-content/uploads/2010/02/espinafre_224442694.jpg",
        descricao: "Espinafre fresco e nutritivo, fonte de ferro. Cultivado com métodos sustentáveis, nosso espinafre é rico em nutrientes essenciais. Ideal para saladas, refogados ou sucos verdes.",
        categoria: "verduras",
        nutricional: [
            { nome: "Calorias", valor: "23 kcal" },
            { nome: "Carboidratos", valor: "3.6g" },
            { nome: "Proteínas", valor: "2.9g" },
            { nome: "Fibras", valor: "2.2g" },
            { nome: "Ferro", valor: "2.7mg" }
        ],
        avaliacao: 4.2,
        avaliacoes: 63
    }
};

// Função para redirecionar para a página de detalhes do produto
function redirecionarParaDetalhes(produto) {
    // Normalizar o nome do produto (remover acentos e substituir espaços por hífens)
    const nomeProdutoNormalizado = produto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, '-');
    
    // Lista de produtos que têm páginas específicas
    const paginasEspecificas = [
        'macas-vermelhas',
        'bananas-prata',
        'morangos',
        'laranjas',
        'abacaxis',
        'uvas',
        'cenouras',
        'tomates',
        'batatas',
        'alface-crespa',
        'cebolas',
        'pepinos',
        'beterrabas',
        'couve',
        'espinafre'
    ];
    
    // Verificar se o produto tem uma página específica
    if (paginasEspecificas.includes(nomeProdutoNormalizado)) {
        window.location.href = `produtos/${nomeProdutoNormalizado}.html`;
    } else {
        // Redirecionar para a página genérica de produto com o nome do produto como parâmetro
        window.location.href = `produto.html?produto=${encodeURIComponent(produto)}`;
    }
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
            <h3 class="produto-titulo">${p.nome}</h3>
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

// Adiciona evento de clique no logo para redirecionar para a página inicial
document.querySelector('.logo').addEventListener('click', () => {
    window.location.href = 'index.html';
}); 