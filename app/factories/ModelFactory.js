import ProdutoModel from '../models/ProdutoModel.js';
import CarrinhoModel from '../models/CarrinhoModel.js';
import UsuarioModel from '../models/UsuarioModel.js';

/**
 * Factory para criação de instâncias de modelos
 */
class ModelFactory {
    constructor() {
        // Cache de instâncias já criadas
        this.instances = {};
    }

    /**
     * Cria uma instância do ProdutoModel
     * @param {Object} options - Opções de configuração
     * @returns {ProdutoModel} - Instância do modelo de produtos
     */
    createProdutoModel(options = {}) {
        // Reutiliza a instância se já existir
        if (this.instances.produtoModel) {
            return this.instances.produtoModel;
        }
        
        // Cria uma nova instância
        const produtoModel = new ProdutoModel(options);
        this.instances.produtoModel = produtoModel;
        return produtoModel;
    }

    /**
     * Cria uma instância do CarrinhoModel
     * @param {Object} options - Opções de configuração
     * @returns {CarrinhoModel} - Instância do modelo de carrinho
     */
    createCarrinhoModel(options = {}) {
        // Reutiliza a instância se já existir
        if (this.instances.carrinhoModel) {
            return this.instances.carrinhoModel;
        }
        
        // Cria uma nova instância
        const carrinhoModel = new CarrinhoModel(options);
        this.instances.carrinhoModel = carrinhoModel;
        return carrinhoModel;
    }

    /**
     * Cria uma instância do UsuarioModel
     * @param {Object} options - Opções de configuração
     * @returns {UsuarioModel} - Instância do modelo de usuário
     */
    createUsuarioModel(options = {}) {
        // Reutiliza a instância se já existir
        if (this.instances.usuarioModel) {
            return this.instances.usuarioModel;
        }
        
        // Cria uma nova instância
        const usuarioModel = new UsuarioModel(options);
        this.instances.usuarioModel = usuarioModel;
        return usuarioModel;
    }

    /**
     * Cria uma instância dinâmica com base no nome
     * @param {string} modelName - Nome do modelo a ser criado
     * @param {Object} options - Opções de configuração
     * @returns {Object} - Instância do modelo solicitado
     */
    createModel(modelName, options = {}) {
        switch (modelName.toLowerCase()) {
            case 'produto':
            case 'produtomodel':
                return this.createProdutoModel(options);
                
            case 'carrinho':
            case 'carrinhomodel':
                return this.createCarrinhoModel(options);
                
            case 'usuario':
            case 'usuariomodel':
                return this.createUsuarioModel(options);
                
            default:
                throw new Error(`Modelo desconhecido: ${modelName}`);
        }
    }

    /**
     * Limpa o cache de instâncias
     * @param {string} modelName - Nome do modelo a ser removido (opcional)
     */
    clearCache(modelName = null) {
        if (modelName) {
            switch (modelName.toLowerCase()) {
                case 'produto':
                case 'produtomodel':
                    delete this.instances.produtoModel;
                    break;
                    
                case 'carrinho':
                case 'carrinhomodel':
                    delete this.instances.carrinhoModel;
                    break;
                    
                case 'usuario':
                case 'usuariomodel':
                    delete this.instances.usuarioModel;
                    break;
            }
        } else {
            this.instances = {};
        }
    }
}

// Exporta uma instância única (Singleton)
export default new ModelFactory(); 