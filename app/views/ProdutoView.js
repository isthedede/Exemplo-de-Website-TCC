class ProdutoView {
    constructor() {
        this.produtosGrid = document.querySelector('.produtos-grid');
        this.semResultados = document.querySelector('.sem-resultados');
    }

    renderizarProdutos(produtos) {
        if (!this.produtosGrid) return;

        this.produtosGrid.innerHTML = '';
        
        if (produtos.length === 0) {
            if (this.semResultados) {
                this.semResultados.style.display = 'block';
            }
            return;
        }
        
        if (this.semResultados) {
            this.semResultados.style.display = 'none';
        }

        produtos.forEach(produto => {
            const card = this.criarCardProduto(produto);
            this.produtosGrid.appendChild(card);
        });
    }

    criarCardProduto(produto) {
        const card = document.createElement('div');
        card.className = 'produto-card';
        card.dataset.categoria = produto.categoria;
        
        // Gerar HTML das estrelas
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
        
        return card;
    }

    renderizarDetalhesProduto(produto) {
        if (!window.location.pathname.includes('produto.html')) return;
        
        document.title = `${produto.nome} - Frutas Frescas`;
        document.getElementById('produto-img').src = produto.imagem;
        document.getElementById('produto-img').alt = produto.nome;
        document.getElementById('produto-nome').textContent = produto.nome;
        document.getElementById('produto-preco').textContent = `R$ ${produto.preco.toFixed(2)}`;
        document.getElementById('produto-descricao').textContent = produto.descricao;

        // Atualizar informações nutricionais
        const nutriList = document.getElementById('produto-nutricional');
        if (nutriList && produto.nutricional) {
            nutriList.innerHTML = produto.nutricional.map(info => `
                <li>
                    <span>${info.nome}</span>
                    <span>${info.valor}</span>
                </li>
            `).join('');
        }

        // Atualizar avaliação
        const rating = document.getElementById('produto-rating');
        if (rating) {
            rating.innerHTML = '';
            for (let i = 1; i <= 5; i++) {
                const star = document.createElement('i');
                star.className = 'fas fa-star' + (i <= produto.avaliacao ? '' : 
                    (i - produto.avaliacao < 1 ? '-half-alt' : '-o'));
                rating.appendChild(star);
            }
            document.querySelector('.avaliacoes-count').textContent = `(${produto.avaliacoes} avaliações)`;
        }
    }

    renderizarProdutosRelacionados(produtos) {
        const produtosGrid = document.querySelector('.produtos-grid');
        if (!produtosGrid) return;
        
        produtosGrid.innerHTML = produtos.map(p => `
            <div class="produto-card" data-nome="${p.nome}">
                <img src="${p.imagem}" alt="${p.nome}">
                <h3 class="produto-titulo">${p.nome}</h3>
                <p class="preco">R$ ${p.preco.toFixed(2)}/kg</p>
                <button class="comprar-btn">
                    <i class="fas fa-shopping-cart"></i>
                    Ver Detalhes
                </button>
            </div>
        `).join('');
    }

    renderizarResultadosBusca(resultados) {
        const searchResults = document.querySelector('.search-results');
        
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

    esconderResultadosBusca() {
        const searchResults = document.querySelector('.search-results');
        if (searchResults) {
            searchResults.classList.remove('active');
        }
    }
}

export default ProdutoView; 