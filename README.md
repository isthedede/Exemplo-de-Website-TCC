# Website de E-commerce de Produtos Naturais

Este projeto implementa um website de e-commerce de produtos naturais (frutas, legumes e verduras) usando o padrão arquitetural MVC (Model-View-Controller).

## Estrutura do Projeto

O projeto segue uma arquitetura avançada baseada em MVC com padrões adicionais:

```
app/
  ├── models/           # Lida com os dados e a lógica de negócios
  │   ├── ProdutoModel.js
  │   └── CarrinhoModel.js
  │
  ├── views/            # Renderiza os dados para o usuário
  │   ├── ProdutoView.js
  │   └── CarrinhoView.js
  │
  ├── controllers/      # Processa eventos e coordena entre Models e Views
  │   ├── ProdutoController.js
  │   └── CarrinhoController.js
  │
  ├── services/         # Serviços compartilhados pela aplicação
  │   ├── ApiService.js        # Abstração para chamadas de API
  │   ├── ConfigService.js     # Gerenciamento de configurações
  │   ├── NotificationService.js # Sistema de notificações
  │   ├── RouterService.js     # Navegação entre páginas
  │   ├── StorageService.js    # Persistência de dados
  │   └── ValidationService.js # Validação de formulários
  │
  ├── factories/        # Factories para criação de objetos
  │   ├── ModelFactory.js
  │   ├── ViewFactory.js
  │   └── ControllerFactory.js
  │
  └── app.js            # Ponto de entrada da aplicação
```

## Padrões de Design Implementados

### MVC (Model-View-Controller)
- **Model**: Gerencia os dados, lógica e regras de negócio.
- **View**: Responsável pela apresentação e renderização na UI.
- **Controller**: Intermedia a comunicação entre Model e View.

### Singleton
Os serviços e factories são implementados como singletons para garantir uma única instância em toda a aplicação:
- Evita múltiplas instâncias desnecessárias
- Garante um ponto de acesso global

### Factory
Usado para criar instâncias de objetos sem expor a lógica de criação:
- ModelFactory: Cria e gerencia modelos
- ViewFactory: Cria e gerencia views
- ControllerFactory: Cria e gerencia controllers

### Observer
- O CarrinhoModel notifica suas views sobre mudanças nos dados
- As views se registram como observadoras e atualizam a interface quando notificadas

### Service Layer
Camada de serviços para funcionalidades compartilhadas:
- ApiService: Abstração para chamadas HTTP
- StorageService: Gerencia persistência de dados
- NotificationService: Sistema de toasts/notificações
- RouterService: Navegação entre páginas
- ConfigService: Configurações centralizadas
- ValidationService: Validação de dados de formulários

### Dependency Injection
- Os controllers recebem seus modelos e views por injeção
- Melhora testabilidade e desacoplamento

## Benefícios da Arquitetura

1. **Manutenibilidade**: Código organizado com responsabilidades claras
2. **Testabilidade**: Componentes isolados facilitam testes unitários
3. **Extensibilidade**: Fácil adicionar novos recursos ou modificar existentes
4. **Reusabilidade**: Componentes podem ser reutilizados em diferentes partes
5. **Depuração**: Localização de problemas facilitada pela divisão clara
6. **Segurança**: Validação de dados centralizada
7. **Consistência**: Padrões aplicados uniformemente no código

## Como executar o projeto

1. Clone o repositório
2. Abra o `index.html` em um navegador moderno

## Funcionalidades

- Listagem de produtos com filtros por categoria, preço e avaliação
- Busca de produtos
- Detalhes do produto
- Carrinho de compras
- Aplicação de cupom de desconto (use o código "DESCONTO20")

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript
- Python (Flask)
- Font Awesome para ícones

## Como Executar o Projeto

1. Clone o repositório:
```bash
git clone https://github.com/isthedede/Exemplo-de-Website-TCC.git
```

2. Instale as dependências:
```bash
pip install -r requirements.txt
```

3. Execute o servidor:
```bash
python app.py
```

4. Acesse o website em seu navegador:
```
http://localhost:5000
```

## Estrutura do Projeto

```
Exemplo-de-Website-TCC/
├── app.py              # Servidor Flask
├── index.html          # Página inicial
├── produtos.html       # Catálogo de produtos
├── produto.html        # Página de detalhes do produto
├── carrinho.html       # Carrinho de compras
├── contato.html        # Página de contato
├── sobre.html          # Página sobre a empresa
├── styles.css          # Estilos CSS
├── script.js           # Scripts JavaScript
├── requirements.txt    # Dependências Python
└── README.md          # Este arquivo
```

## Autores

- André Toyama - Desenvolvedor Principal
- Lucas Carita - Desenvolvedor Principal

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Contato

Para mais informações sobre o projeto, entre em contato através do email: andreluiz.toyama@gmail.com 