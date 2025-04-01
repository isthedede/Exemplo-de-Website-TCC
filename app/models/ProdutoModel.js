class ProdutoModel {
    constructor() {
        this.produtos = [
            {
                nome: "Maçãs Vermelhas",
                preco: "R$ 12,90",
                imagem: "https://th.bing.com/th/id/OIP.DnBqF1misIba7yN3lja2fwHaHb?rs=1&pid=ImgDetMain",
                descricao: "Maçãs frescas e crocantes, ricas em fibras e vitaminas.",
                categoria: "frutas",
                avaliacao: 4.5
            },
            {
                nome: "Bananas Prata",
                preco: "R$ 8,90",
                imagem: "https://th.bing.com/th/id/OIP.7w4kPAYPE_ecMisRzA1qJwAAAA?rs=1&pid=ImgDetMain",
                descricao: "Bananas doces e nutritivas, fonte natural de potássio.",
                categoria: "frutas",
                avaliacao: 3.0
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
                imagem: "https://th.bing.com/th/id/OIP.aJ3nuGpglx0SunU0C5FKAwHaEK?rs=1&pid=ImgDetMain",
                descricao: "Uvas doces e sem sementes, perfeitas para consumo.",
                categoria: "frutas",
                avaliacao: 3.5
            },
            {
                nome: "Abacaxis",
                preco: "R$ 12,90",
                imagem: "https://th.bing.com/th/id/OIP.04Hxw701P8-1cR-o_Gew5wHaEK?rs=1&pid=ImgDetMain",
                descricao: "Abacaxis maduros e doces, prontos para consumo.",
                categoria: "frutas",
                avaliacao: 4.0
            },
            {
                nome: "Cenouras",
                preco: "R$ 5,90",
                imagem: "https://th.bing.com/th/id/OIP.SrVvQxl4XYkdpGiwxqlDdAHaHa?rs=1&pid=ImgDetMain",
                descricao: "Cenouras frescas e crocantes, ricas em vitamina A.",
                categoria: "legumes",
                avaliacao: 4.2
            },
            {
                nome: "Tomates",
                preco: "R$ 9,90",
                imagem: "https://th.bing.com/th/id/OIP.XPXeInO68L49mOlW_1MdZwHaE7?rs=1&pid=ImgDetMain",
                descricao: "Tomates maduros e suculentos, perfeitos para saladas.",
                categoria: "legumes",
                avaliacao: 3.7
            },
            {
                nome: "Batatas",
                preco: "R$ 6,90",
                imagem: "https://th.bing.com/th/id/OIP.z0wQF6yKKgncnMxh5HA_4QHaE8?rs=1&pid=ImgDetMain",
                descricao: "Batatas selecionadas, perfeitas para diversos preparos.",
                categoria: "legumes",
                avaliacao: 4.3
            },
            {
                nome: "Beterrabas",
                preco: "R$ 7,90",
                imagem: "https://th.bing.com/th/id/OIP.iJKwWZ_o4hq2lNB0MwyZ4QHaE8?rs=1&pid=ImgDetMain",
                descricao: "Beterrabas frescas e suculentas, ricas em nutrientes.",
                categoria: "legumes",
                avaliacao: 3.8
            },
            {
                nome: "Alface Crespa",
                preco: "R$ 3,90",
                imagem: "https://th.bing.com/th/id/OIP.ETJgqo-w0-z8GGKYuCd0gwHaE7?rs=1&pid=ImgDetMain",
                descricao: "Alface crespa fresca e crocante, colhida no dia.",
                categoria: "verduras",
                avaliacao: 4.8
            },
            {
                nome: "Couve",
                preco: "R$ 4,50",
                imagem: "https://th.bing.com/th/id/OIP.0oD4-0ZSfvX35HkDqK4QowHaE8?rs=1&pid=ImgDetMain",
                descricao: "Couve fresca e tenra, rica em vitaminas e minerais.",
                categoria: "verduras",
                avaliacao: 4.1
            },
            {
                nome: "Espinafre",
                preco: "R$ 5,90",
                imagem: "https://th.bing.com/th/id/OIP.Ld0kHm8VzGvIH8lZhzIxKwHaE8?rs=1&pid=ImgDetMain",
                descricao: "Espinafre fresco e nutritivo, fonte de ferro.",
                categoria: "verduras",
                avaliacao: 3.9
            }
        ];

        this.produtosDetalhados = {
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
    }

    getTodosProdutos() {
        return this.produtos;
    }

    getProdutoPorNome(nome) {
        return this.produtos.find(produto => produto.nome === nome);
    }

    getProdutoDetalhado(nome) {
        return this.produtosDetalhados[nome];
    }

    filtrarProdutos(filtros) {
        let produtosFiltrados = [...this.produtos];
        
        // Filtrar por categoria
        if (filtros.categoria && filtros.categoria !== 'todos') {
            produtosFiltrados = produtosFiltrados.filter(produto => produto.categoria === filtros.categoria);
        }
        
        // Filtrar por preço
        if (filtros.preco && filtros.preco !== 'todos') {
            const [min, max] = filtros.preco.split('-').map(valor => parseFloat(valor));
            produtosFiltrados = produtosFiltrados.filter(produto => {
                const preco = parseFloat(produto.preco.replace('R$ ', '').replace(',', '.'));
                if (max) {
                    return preco >= min && preco <= max;
                } else {
                    return preco >= min;
                }
            });
        }
        
        // Filtrar por termo de busca
        if (filtros.termo) {
            const termo = filtros.termo.toLowerCase();
            produtosFiltrados = produtosFiltrados.filter(produto => {
                const nome = produto.nome.toLowerCase();
                const descricao = produto.descricao.toLowerCase();
                return nome.includes(termo) || descricao.includes(termo);
            });
        }
        
        // Ordenar produtos
        if (filtros.ordenacao) {
            produtosFiltrados.sort((a, b) => {
                const precoA = parseFloat(a.preco.replace('R$ ', '').replace(',', '.'));
                const precoB = parseFloat(b.preco.replace('R$ ', '').replace(',', '.'));
                
                switch (filtros.ordenacao) {
                    case 'nome':
                        return a.nome.localeCompare(b.nome);
                    case 'preco-asc':
                        return precoA - precoB;
                    case 'preco-desc':
                        return precoB - precoA;
                    case 'avaliacao':
                        return b.avaliacao - a.avaliacao;
                    default:
                        return 0;
                }
            });
        }
        
        return produtosFiltrados;
    }
}

export default ProdutoModel; 