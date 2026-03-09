from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.services.auth_service import AuthService

auth_bp = Blueprint('auth', __name__)
service = AuthService()

# --- ROTAS DE PERFIL (Edição e Visualização) ---
# Funciona para Médico, Hospital e Admin (Automático pelo Token)

@auth_bp.route('/api/perfil', methods=['GET'])
@jwt_required()
def obter_meu_perfil():
    usuario_id = get_jwt_identity()
    claims = get_jwt()
    tipo = claims.get('tipo') # 'medico', 'hospital' ou 'admin'
    
    try:
        perfil = service.obter_perfil(usuario_id, tipo)
        if perfil:
            return jsonify(perfil), 200
        return jsonify({"erro": "Usuário não encontrado"}), 404
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@auth_bp.route('/api/perfil', methods=['PUT'])
@jwt_required()
def atualizar_meu_perfil():
    usuario_id = get_jwt_identity()
    claims = get_jwt()
    tipo = claims.get('tipo')
    dados = request.json
    
    try:
        sucesso = service.atualizar_perfil(usuario_id, tipo, dados)
        if sucesso:
            return jsonify({"status": "sucesso", "mensagem": "Perfil atualizado!"}), 200
        return jsonify({"erro": "Falha ao atualizar. Verifique os dados."}), 400
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

# --- ROTAS DE HOSPITAL (LOGIN/CADASTRO) ---
@auth_bp.route('/api/hospitais', methods=['POST'])
def cadastrar_hospital():
    dados = request.json
    try:
        novo_id = service.registrar_hospital(dados)
        return jsonify({"status": "sucesso", "id": novo_id}), 201
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@auth_bp.route('/api/login/hospital', methods=['POST'])
def login_hospital():
    dados = request.json
    resultado = service.login_hospital(dados.get('cnpj'), dados.get('senha'))
    
    if resultado:
        return jsonify(resultado), 200
    return jsonify({"erro": "CNPJ ou senha incorretos"}), 401

# --- ROTAS DE MÉDICO (LOGIN/CADASTRO) ---
@auth_bp.route('/api/medicos', methods=['POST'])
def cadastrar_medico():
    dados = request.json
    try:
        novo_id = service.registrar_medico(dados)
        return jsonify({"status": "sucesso", "id": novo_id}), 201
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@auth_bp.route('/api/login/medico', methods=['POST'])
def login_medico():
    dados = request.json
    try:
        resultado = service.login_medico(dados.get('crm'), dados.get('senha'))
        
        if resultado:
            return jsonify(resultado), 200
        return jsonify({"erro": "CRM ou senha incorretos"}), 401
    except Exception as e:
        # Agora o erro real vai aparecer no terminal e na tela do React!
        print(f"🔥 ERRO CRÍTICO NO LOGIN: {str(e)}") 
        return jsonify({"erro": f"Falha interna do Flask: {str(e)}"}), 500
# --- ROTAS DE ADMIN (LOGIN) ---
@auth_bp.route('/api/login/admin', methods=['POST'])
def login_admin():
    dados = request.json
    resultado = service.login_admin(dados.get('email'), dados.get('senha'))
    
    if resultado:
        return jsonify(resultado), 200
    return jsonify({"erro": "Credenciais inválidas"}), 401