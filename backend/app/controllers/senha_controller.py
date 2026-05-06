from flask import Blueprint, request, jsonify
from app.models.usuario_model import UsuarioModel
from app.services.email_service import EmailService
from werkzeug.security import generate_password_hash
import random

senha_bp = Blueprint('senha', __name__)
model = UsuarioModel()
email_service = EmailService()

# 1. SOLICITAR CÓDIGO (Envia E-mail)
@senha_bp.route('/api/senha/recuperar', methods=['POST'])
def solicitar_recuperacao():
    email = request.json.get('email')
    
    # Gera código de 5 dígitos (ex: 49210)
    codigo = str(random.randint(10000, 99999))
    
    # Salva no banco
    model.salvar_codigo_recuperacao(email, codigo)
    
    # Envia e-mail
    enviou = email_service.enviar_codigo_recuperacao(email, codigo)
    
    if enviou:
        return jsonify({"status": "sucesso", "mensagem": "Código enviado para o e-mail"}), 200
    else:
        return jsonify({"erro": "Falha ao enviar e-mail. Tente novamente."}), 500

# 2. VALIDAR CÓDIGO (Só checa se tá certo)
@senha_bp.route('/api/senha/validar', methods=['POST'])
def validar_codigo():
    dados = request.json
    valido = model.validar_codigo_recuperacao(dados.get('email'), dados.get('codigo'))
    
    if valido:
        return jsonify({"status": "sucesso", "mensagem": "Código válido"}), 200
    return jsonify({"erro": "Código inválido ou expirado"}), 400

# 3. REDEFINIR SENHA (Troca de verdade)
@senha_bp.route('/api/senha/redefinir', methods=['POST'])
def redefinir_senha():
    dados = request.json
    email = dados.get('email')
    codigo = dados.get('codigo')
    nova_senha = dados.get('nova_senha')
    
    # 1. Verifica o código de novo (Segurança extra)
    if not model.validar_codigo_recuperacao(email, codigo):
        return jsonify({"erro": "Código inválido ou expirado"}), 400
        
    # 2. Hash da nova senha
    senha_hash = generate_password_hash(nova_senha)
    
    # 3. Atualiza no banco
    sucesso = model.redefinir_senha_geral(email, senha_hash)
    
    if sucesso:
        return jsonify({"status": "sucesso", "mensagem": "Senha alterada com sucesso! Faça login."}), 200
    
    return jsonify({"erro": "E-mail não encontrado na base de usuários."}), 404