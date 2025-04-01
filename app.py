from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import re
import os

app = Flask(__name__, static_folder='.')
CORS(app)

def validar_email(email):
    padrao = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    return re.match(padrao, email) is not None

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/contato', methods=['POST'])
def processar_contato():
    dados = request.get_json()
    
    if not dados.get('nome') or not dados.get('email') or not dados.get('mensagem'):
        return jsonify({
            'sucesso': False,
            'mensagem': 'Todos os campos são obrigatórios'
        }), 400
    
    if not validar_email(dados['email']):
        return jsonify({
            'sucesso': False,
            'mensagem': 'Email inválido'
        }), 400.
    
    return jsonify({
        'sucesso': True,
        'mensagem': 'Mensagem recebida com sucesso!'
    })

@app.route('/api/produtos', methods=['GET'])
def listar_produtos():
    produtos = [
        {
            'id': 1,
            'nome': 'Maçãs Vermelhas',
            'descricao': 'Maçãs vermelhas frescas e suculentas, colhidas no ponto ideal',
            'preco': 12.90,
            'avaliacao': 4.5,
            'unidade': 'kg'
        },
        {
            'id': 2,
            'nome': 'Bananas Prata',
            'descricao': 'Bananas prata maduras e doces, perfeitas para consumo',
            'preco': 8.90,
            'avaliacao': 5.0,
            'unidade': 'kg'
        }
    ]
    
    return jsonify(produtos)

if __name__ == '__main__':
    app.run(debug=True) 