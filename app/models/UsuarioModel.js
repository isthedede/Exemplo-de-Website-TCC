class UsuarioModel {
    constructor() {
        this.usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        this.usuarioAtual = JSON.parse(localStorage.getItem('usuarioAtual')) || null;
    }

    // Cadastra um novo usuário
    cadastrar(nome, email, senha) {
        // Verifica se o email já está cadastrado
        if (this.usuarios.find(u => u.email === email)) {
            return { success: false, message: 'Este email já está cadastrado.' };
        }

        // Cria um novo usuário
        const novoUsuario = {
            id: Date.now().toString(),
            nome,
            email,
            senha, // Em um sistema real, a senha deveria ser criptografada
            dataCadastro: new Date().toISOString(),
            pedidos: [],
            favoritos: []
        };

        // Adiciona à lista de usuários
        this.usuarios.push(novoUsuario);
        
        // Salva no localStorage
        this._salvarDados();

        // Retorna sucesso
        return { success: true, message: 'Cadastro realizado com sucesso!' };
    }

    // Realiza login
    login(email, senha) {
        // Busca o usuário pelo email
        const usuario = this.usuarios.find(u => u.email === email);

        // Verifica se o usuário existe e a senha está correta
        if (!usuario || usuario.senha !== senha) {
            return { success: false, message: 'Email ou senha incorretos.' };
        }

        // Salva o usuário atual no estado e no localStorage
        this.usuarioAtual = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        };
        
        localStorage.setItem('usuarioAtual', JSON.stringify(this.usuarioAtual));

        // Retorna sucesso
        return { success: true, message: 'Login realizado com sucesso!' };
    }

    // Realiza logout
    logout() {
        this.usuarioAtual = null;
        localStorage.removeItem('usuarioAtual');
        return { success: true, message: 'Logout realizado com sucesso!' };
    }

    // Verifica se o usuário está logado
    estaLogado() {
        return this.usuarioAtual !== null;
    }

    // Retorna os dados do usuário atual
    getUsuarioAtual() {
        return this.usuarioAtual;
    }

    // Retorna os dados completos do usuário atual
    getDadosCompletos() {
        if (!this.usuarioAtual) return null;
        
        return this.usuarios.find(u => u.id === this.usuarioAtual.id);
    }

    // Atualiza os dados do usuário
    atualizarDados(nome, email) {
        if (!this.usuarioAtual) return { success: false, message: 'Usuário não logado.' };

        // Encontra o usuário
        const usuario = this.usuarios.find(u => u.id === this.usuarioAtual.id);
        if (!usuario) return { success: false, message: 'Usuário não encontrado.' };

        // Atualiza os dados
        usuario.nome = nome;
        if (email !== usuario.email) {
            // Verifica se o novo email já está em uso
            if (this.usuarios.find(u => u.email === email && u.id !== usuario.id)) {
                return { success: false, message: 'Este email já está em uso.' };
            }
            usuario.email = email;
        }

        // Atualiza o usuário atual
        this.usuarioAtual.nome = nome;
        this.usuarioAtual.email = email;

        // Salva alterações
        this._salvarDados();

        return { success: true, message: 'Dados atualizados com sucesso!' };
    }

    // Atualiza senha do usuário
    atualizarSenha(senhaAtual, novaSenha) {
        if (!this.usuarioAtual) return { success: false, message: 'Usuário não logado.' };

        // Encontra o usuário
        const usuario = this.usuarios.find(u => u.id === this.usuarioAtual.id);
        if (!usuario) return { success: false, message: 'Usuário não encontrado.' };

        // Verifica a senha atual
        if (usuario.senha !== senhaAtual) {
            return { success: false, message: 'Senha atual incorreta.' };
        }

        // Atualiza a senha
        usuario.senha = novaSenha;

        // Salva alterações
        this._salvarDados();

        return { success: true, message: 'Senha atualizada com sucesso!' };
    }

    // Método privado para salvar dados no localStorage
    _salvarDados() {
        localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
        if (this.usuarioAtual) {
            localStorage.setItem('usuarioAtual', JSON.stringify(this.usuarioAtual));
        }
    }

    // Verifica se um email existe no sistema
    verificarEmail(email) {
        const usuario = this.usuarios.find(u => u.email === email);
        if (usuario) {
            return { success: true, message: 'Email encontrado.' };
        } else {
            return { success: false, message: 'Email não encontrado.' };
        }
    }
}

export default UsuarioModel; 