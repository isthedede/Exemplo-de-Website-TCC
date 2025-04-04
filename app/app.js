// Services
import NotificationService from './services/NotificationService.js';
import StorageService from './services/StorageService.js';
import RouterService from './services/RouterService.js';
import ConfigService from './services/ConfigService.js';

// Factories
import ModelFactory from './factories/ModelFactory.js';
import ViewFactory from './factories/ViewFactory.js';
import ControllerFactory from './factories/ControllerFactory.js';

/**
 * Classe principal da aplicação
 */
class App {
    constructor() {
        this.initialized = false;
        
        // Serviços
        this.services = {
            notification: NotificationService,
            storage: StorageService,
            router: RouterService,
            config: ConfigService
        };
        
        // Factories
        this.factories = {
            model: ModelFactory,
            view: ViewFactory,
            controller: ControllerFactory
        };
        
        // Modelos
        this.models = {};
        
        // Controllers
        this.controllers = {};
    }

    /**
     * Inicializa a aplicação
     */
    init() {
        if (this.initialized) return;
        
        console.log('Inicializando aplicação');
        
        // Expõe o serviço de notificação globalmente para compatibilidade
        window.showToast = (message, type, duration) => this.services.notification.show(message, type, duration);
        
        // Inicializa os modelos
        this.models.produto = this.factories.model.createProdutoModel();
        this.models.carrinho = this.factories.model.createCarrinhoModel();
        this.models.usuario = this.factories.model.createUsuarioModel();
        
        // Inicializa as views
        const produtoView = this.factories.view.createProdutoView();
        const carrinhoView = this.factories.view.createCarrinhoView();
        
        // Inicializa os controllers
        this.controllers.produto = this.factories.controller.createProdutoController({
            produtoModel: this.models.produto,
            produtoView: produtoView
        });
        
        this.controllers.carrinho = this.factories.controller.createCarrinhoController({
            carrinhoModel: this.models.carrinho,
            carrinhoView: carrinhoView
        });
        
        // Configura eventos da interface
        this.setupUIEvents();
        
        this.initialized = true;
        
        // Log de modo de depuração
        if (this.services.config.isDebugMode()) {
            console.log('Aplicação inicializada no modo de depuração');
            console.log('Configurações:', this.services.config.getAll());
        }
    }

    /**
     * Configura eventos gerais da interface
     */
    setupUIEvents() {
        // Adicionar evento de clique no logo para redirecionar para a página inicial
        document.querySelector('.logo')?.addEventListener('click', () => {
            this.services.router.goToHome();
        });
        
        // Configurações de acessibilidade
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('teclado-navegacao');
            }
        });
        
        // Remover classe de acessibilidade ao clicar com o mouse
        document.addEventListener('mousedown', function() {
            document.body.classList.remove('teclado-navegacao');
        });

        // Atualizar botão de perfil baseado no status de login
        this.atualizarBotaoPerfil();
    }
    
    /**
     * Atualiza o botão de perfil com base no status de login
     */
    atualizarBotaoPerfil() {
        const perfilBtn = document.querySelector('.perfil-btn');
        if (!perfilBtn) return;
        
        if (this.models.usuario && this.models.usuario.estaLogado()) {
            perfilBtn.href = 'perfil.html';
            perfilBtn.setAttribute('aria-label', 'Meu perfil');
        } else {
            perfilBtn.href = 'login.html';
            perfilBtn.setAttribute('aria-label', 'Entrar');
        }
    }

    /**
     * Obtém um controlador específico
     * @param {string} name - Nome do controlador
     * @returns {Object} - O controlador solicitado
     */
    getController(name) {
        return this.controllers[name.toLowerCase()];
    }

    /**
     * Obtém um modelo específico
     * @param {string} name - Nome do modelo
     * @returns {Object} - O modelo solicitado
     */
    getModel(name) {
        return this.models[name.toLowerCase()];
    }

    /**
     * Obtém um serviço específico
     * @param {string} name - Nome do serviço
     * @returns {Object} - O serviço solicitado
     */
    getService(name) {
        return this.services[name.toLowerCase()];
    }
}

// Cria e inicializa a aplicação
const app = new App();

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Exporta a aplicação
export default app; 