class CarrinhoModel {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('carrinho')) || [];
        this.totalItems = 0;
        this.valorTotal = 0;
        this.calcularTotais();
        this.observers = [];
    }

    // Adiciona um item ao carrinho
    adicionarItem(produto, quantidade = 1, unidade = 'kg') {
        // Verifica se o produto já está no carrinho
        const itemExistente = this.items.find(item => 
            item.nome === produto.nome || 
            (typeof produto === 'string' && item.nome === produto)
        );

        if (itemExistente) {
            // Incrementa a quantidade
            itemExistente.quantidade += quantidade;
        } else {
            // Cria um novo item
            const novoItem = {
                id: Date.now().toString(),
                nome: typeof produto === 'string' ? produto : produto.nome,
                preco: typeof produto === 'string' ? 0 : parseFloat(produto.preco.replace('R$ ', '').replace(',', '.')),
                quantidade,
                unidade
            };
            this.items.push(novoItem);
        }

        // Atualiza os totais
        this.calcularTotais();
        
        // Salva no localStorage
        this._salvarDados();
        
        // Atualiza o contador no DOM
        this._atualizarContadorDOM();
        
        this.notificarObservadores();
        
        return { success: true, message: 'Item adicionado ao carrinho!' };
    }

    // Remove um item do carrinho
    removerItem(id) {
        const indexItem = this.items.findIndex(item => item.id === id);
        
        if (indexItem === -1) {
            return { success: false, message: 'Item não encontrado no carrinho.' };
        }
        
        // Remove o item
        this.items.splice(indexItem, 1);
        
        // Atualiza os totais
        this.calcularTotais();
        
        // Salva no localStorage
        this._salvarDados();
        
        // Atualiza o contador no DOM
        this._atualizarContadorDOM();
        
        this.notificarObservadores();
        
        return { success: true, message: 'Item removido do carrinho!' };
    }

    // Atualiza a quantidade de um item
    atualizarQuantidade(id, quantidade) {
        const item = this.items.find(item => item.id === id);
        
        if (!item) {
            return { success: false, message: 'Item não encontrado no carrinho.' };
        }
        
        // Não permite quantidade menor que 1
        if (quantidade < 1) {
            return { success: false, message: 'A quantidade deve ser pelo menos 1.' };
        }
        
        // Atualiza a quantidade
        item.quantidade = quantidade;
        
        // Atualiza os totais
        this.calcularTotais();
        
        // Salva no localStorage
        this._salvarDados();
        
        this.notificarObservadores();
        
        return { success: true, message: 'Quantidade atualizada!' };
    }

    // Limpa o carrinho
    limparCarrinho() {
        this.items = [];
        this.calcularTotais();
        this._salvarDados();
        this._atualizarContadorDOM();
        this.notificarObservadores();
        return { success: true, message: 'Carrinho limpo com sucesso!' };
    }

    // Calcula o total de itens e valor
    calcularTotais() {
        this.totalItems = this.items.reduce((acc, item) => acc + item.quantidade, 0);
        this.valorTotal = this.items.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    }

    // Retorna todos os itens do carrinho
    getItems() {
        return this.items;
    }

    // Retorna o total de itens
    getTotalItems() {
        return this.totalItems;
    }

    // Retorna o valor total
    getValorTotal() {
        return this.valorTotal;
    }

    // Método privado para salvar dados no localStorage
    _salvarDados() {
        localStorage.setItem('carrinho', JSON.stringify(this.items));
    }
    
    // Método privado para atualizar o contador no DOM
    _atualizarContadorDOM() {
        // Atualiza o contador visual
        const contadores = document.querySelectorAll('.carrinho-contador');
        if (contadores.length > 0) {
            contadores.forEach(contador => {
                contador.textContent = this.totalItems;
                contador.style.display = this.totalItems > 0 ? 'flex' : 'none';
            });
        }
    }

    aplicarDesconto(desconto) {
        const subtotal = this.getValorTotal();
        return subtotal * desconto;
    }

    getTotal(desconto = 0) {
        const subtotal = this.getValorTotal();
        const valorDesconto = subtotal * desconto;
        return subtotal - valorDesconto;
    }

    adicionarObservador(observador) {
        this.observers.push(observador);
    }

    notificarObservadores() {
        this.observers.forEach(observador => observador.atualizar(this));
    }
}

export default CarrinhoModel; 