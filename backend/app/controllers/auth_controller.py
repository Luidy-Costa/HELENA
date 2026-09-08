from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.services.auth_service import AuthService

auth_bp = Blueprint('auth', __name__)
service = AuthService()

# --- ROTAS DE PERFIL ---
@auth_bp.route('/api/perfil', methods=['GET'])
@jwt_required()
def obter_meu_perfil():
    usuario_id = get_jwt_identity()
    claims = get_jwt()
    tipo = claims.get('tipo') 
    
    try:
        perfil = service.obter_perfil(usuario_id, tipo)
        if perfil:
            if tipo == 'hospital' and 'nome_fantasia' in perfil:
                perfil['nome'] = perfil['nome_fantasia']
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

# --- ROTAS DE LOGIN E CADASTRO ---
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
    status_code = resultado.pop("status", 401)
    return jsonify(resultado), status_code

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
        status_code = resultado.pop("status", 401)
        return jsonify(resultado), status_code
    except Exception as e:
        print(f"🔥 ERRO CRÍTICO NO LOGIN: {str(e)}") 
        return jsonify({"erro": f"Falha interna do Flask: {str(e)}"}), 500

@auth_bp.route('/api/login/admin', methods=['POST'])
def login_admin():
    dados = request.json
    resultado = service.login_admin(dados.get('email'), dados.get('senha'))
    status_code = resultado.pop("status", 401)
    return jsonify(resultado), status_code