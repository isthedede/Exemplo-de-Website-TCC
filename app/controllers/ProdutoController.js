class ProdutoController {
    constructor(produtoModel, produtoView) {
        this.produtoModel = produtoModel;
        this.produtoView = produtoView;
        this.inicializar();
    }

    inicializar() {
        // Configurar filtros de produtos
        this.configurarFiltros();
        
        // Configurar página de detalhes do produto
        this.carregarDetalhesProduto();
        
        // Configurar busca de produtos
        this.configurarBusca();
        
        // Carregar produtos iniciais
        this.carregarProdutosIniciais();
        
        // Configurar eventos para os botões de favoritos e carrinho
        this.configurarEventosProdutos();
    }

    carregarProdutosIniciais() {
        if (!window.location.pathname.includes('produtos.html')) return;
        
        const urlParams = new URLSearchParams(window.location.search);
        const buscaTerm = urlParams.get('busca');
        
        if (buscaTerm) {
            // Se há um termo de busca na URL, aplicamos o filtro
            this.filtrarProdutos({ termo: decodeURIComponent(buscaTerm) });
        } else {
            // Carregamos todos os produtos
            this.produtoView.renderizarProdutos(this.produtoModel.getTodosProdutos());
        }
    }

    configurarFiltros() {
        const categoriaSelect = document.getElementById('categoria');
        const precoSelect = document.getElementById('preco');
        const ordenacaoSelect = document.getElementById('ordenacao');

        if (categoriaSelect) {
            categoriaSelect.addEventListener('change', () => this.aplicarFiltros());
        }
        
        if (precoSelect) {
            precoSelect.addEventListener('change', () => this.aplicarFiltros());
        }
        
        if (ordenacaoSelect) {
            ordenacaoSelect.addEventListener('change', () => this.aplicarFiltros());
        }
    }

    aplicarFiltros() {
        const categoriaSelect = document.getElementById('categoria');
        const precoSelect = document.getElementById('preco');
        const ordenacaoSelect = document.getElementById('ordenacao');
        const searchInput = document.querySelector('.search-input, #searchInput');

        const filtros = {
            categoria: categoriaSelect ? categoriaSelect.value : 'todos',
            preco: precoSelect ? precoSelect.value : 'todos',
            ordenacao: ordenacaoSelect ? ordenacaoSelect.value : 'nome',
            termo: searchInput ? searchInput.value.toLowerCase().trim() : ''
        };

        this.filtrarProdutos(filtros);
    }

    filtrarProdutos(filtros) {
        const produtosFiltrados = this.produtoModel.filtrarProdutos(filtros);
        this.produtoView.renderizarProdutos(produtosFiltrados);
    }

    carregarDetalhesProduto() {
        if (!window.location.pathname.includes('produto.html')) return;

        const params = new URLSearchParams(window.location.search);
        const nomeProduto = decodeURIComponent(params.get('produto'));
        const produto = this.produtoModel.getProdutoDetalhado(nomeProduto);

        if (!produto) {
            window.location.href = 'produtos.html';
            return;
        }

        this.produtoView.renderizarDetalhesProduto(produto);
        
        // Carregar produtos relacionados
        const produtosRelacionados = Object.values(this.produtoModel.produtosDetalhados)
            .filter(p => p.nome !== produto.nome)
            .slice(0, 3);
            
        this.produtoView.renderizarProdutosRelacionados(produtosRelacionados);
    }

    configurarBusca() {
        const searchInput = document.querySelector('.search-input, #searchInput');
        const searchButton = document.querySelector('.search-button, #searchButton');

        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.realizarBusca(searchInput.value);
                }
            });
            
            // Busca dinâmica
            searchInput.addEventListener('input', (e) => {
                this.realizarBuscaDinamica(e.target.value);
            });
        }

        if (searchButton) {
            searchButton.addEventListener('click', () => {
                this.realizarBusca(searchInput ? searchInput.value : '');
            });
        }
        
        // Fechar resultados ao clicar fora
        document.addEventListener('click', (e) => {
            if (searchInput && !searchInput.contains(e.target) && !document.querySelector('.search-results')?.contains(e.target)) {
                this.produtoView.esconderResultadosBusca();
            }
        });
    }

    realizarBusca(termo) {
        const searchTerm = termo.trim();
        
        if (searchTerm) {
            // Se estiver na página de produtos, filtra os produtos
            if (window.location.pathname.includes('produtos.html')) {
                this.filtrarProdutos({ termo: searchTerm });
            } else {
                // Em outras páginas, redireciona para produtos.html com o termo de busca
                window.location.href = `produtos.html?busca=${encodeURIComponent(searchTerm)}`;
            }
        }
    }

    realizarBuscaDinamica(termo) {
        const searchTerm = termo.trim();
        
        if (!searchTerm || searchTerm.length < 2) {
            this.produtoView.esconderResultadosBusca();
            return;
        }
        
        const resultados = this.produtoModel.filtrarProdutos({ termo: searchTerm });
        this.produtoView.renderizarResultadosBusca(resultados);
    }

    redirecionarParaDetalhes(nome) {
        window.location.href = `produto.html?produto=${encodeURIComponent(nome)}`;
    }

    configurarEventosProdutos() {
        // Delegação de eventos para os botões de produtos
        document.addEventListener('click', (e) => {
            // Verificar se o clique foi em um botão de favorito
            if (e.target.closest('.favorito-btn')) {
                e.preventDefault();
                this.gerenciarFavorito(e.target.closest('.produto-card'));
            }
            
            // Verificar se o clique foi em um botão de comprar
            if (e.target.closest('.comprar-btn')) {
                e.preventDefault();
                this.adicionarAoCarrinho(e.target.closest('.produto-card'));
            }
        });
    }
    
    gerenciarFavorito(produtoCard) {
        // Importar os modelos necessários
        const ModelFactory = (window.ModelFactory || globalThis.ModelFactory);
        
        if (!ModelFactory) {
            console.error('ModelFactory não encontrado');
            this.mostrarMensagem('Erro ao processar sua solicitação. Tente novamente.', 'erro');
            return;
        }
        
        const usuarioModel = ModelFactory.createUsuarioModel();
        
        // Verificar se o usuário está logado
        if (!usuarioModel.estaLogado()) {
            // Redirecionar para a página de login
            window.location.href = 'login.html';
            return;
        }
        
        // Obter os dados do produto
        const nome = produtoCard.querySelector('.produto-titulo').textContent;
        const produto = this.produtoModel.getProduto(nome);
        
        if (!produto) {
            this.mostrarMensagem('Produto não encontrado', 'erro');
            return;
        }
        
        // Verificar se o produto já está nos favoritos
        const estaNaLista = usuarioModel.estaNaListaFavoritos(produto.nome);
        
        let resultado;
        if (estaNaLista) {
            // Encontrar o ID do produto nos favoritos
            const favoritos = usuarioModel.getFavoritos();
            const favorito = favoritos.find(f => f.nome === produto.nome);
            
            if (favorito) {
                resultado = usuarioModel.removerFavorito(favorito.id);
                if (resultado.success) {
                    // Atualizar o ícone do coração para vazio
                    const heartIcon = produtoCard.querySelector('.favorito-btn i');
                    heartIcon.className = 'far fa-heart';
                }
            }
        } else {
            resultado = usuarioModel.adicionarFavorito(produto);
            if (resultado.success) {
                // Atualizar o ícone do coração para preenchido
                const heartIcon = produtoCard.querySelector('.favorito-btn i');
                heartIcon.className = 'fas fa-heart';
            }
        }
        
        // Mostrar mensagem de sucesso ou erro
        if (resultado) {
            this.mostrarMensagem(resultado.message, resultado.success ? 'sucesso' : 'erro');
        }
    }
    
    adicionarAoCarrinho(produtoCard) {
        // Importar os modelos necessários
        const ModelFactory = (window.ModelFactory || globalThis.ModelFactory);
        
        if (!ModelFactory) {
            console.error('ModelFactory não encontrado');
            this.mostrarMensagem('Erro ao processar sua solicitação. Tente novamente.', 'erro');
            return;
        }
        
        const carrinhoModel = ModelFactory.createCarrinhoModel();
        
        // Obter os dados do produto
        const nome = produtoCard.querySelector('.produto-titulo').textContent;
        const produto = this.produtoModel.getProduto(nome);
        
        if (!produto) {
            this.mostrarMensagem('Produto não encontrado', 'erro');
            return;
        }
        
        // Adicionar ao carrinho
        const resultado = carrinhoModel.adicionarItem(produto);
        
        // Mostrar mensagem de sucesso ou erro
        this.mostrarMensagem(resultado.message, resultado.success ? 'sucesso' : 'erro');
    }
    
    mostrarMensagem(mensagem, tipo) {
        const id = 'mensagem-flutuante';
        let mensagemElement = document.getElementById(id);
        
        // Criar o elemento se não existir
        if (!mensagemElement) {
            mensagemElement = document.createElement('div');
            mensagemElement.id = id;
            mensagemElement.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 10px 20px;
                border-radius: 4px;
                font-weight: bold;
                z-index: 9999;
                transition: transform 0.3s, opacity 0.3s;
                transform: translateY(-20px);
                opacity: 0;
            `;
            document.body.appendChild(mensagemElement);
        }
        
        // Definir a cor com base no tipo
        mensagemElement.style.backgroundColor = tipo === 'sucesso' ? '#2ecc71' : '#e74c3c';
        mensagemElement.style.color = 'white';
        
        // Definir a mensagem
        mensagemElement.textContent = mensagem;
        
        // Mostrar a mensagem com animação
        setTimeout(() => {
            mensagemElement.style.transform = 'translateY(0)';
            mensagemElement.style.opacity = '1';
        }, 10);
        
        // Ocultar a mensagem após 3 segundos
        setTimeout(() => {
            mensagemElement.style.transform = 'translateY(-20px)';
            mensagemElement.style.opacity = '0';
        }, 3000);
    }
}

export default ProdutoController; 