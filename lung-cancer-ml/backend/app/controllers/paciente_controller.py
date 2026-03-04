from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.services.paciente_service import PacienteService

paciente_bp = Blueprint('paciente', __name__)
service = PacienteService()

@paciente_bp.route('/api/pacientes', methods=['GET'])
@jwt_required()
def listar_pacientes():
    usuario_id = get_jwt_identity()
    claims = get_jwt()
    
    try:
        lista = service.listar(usuario_id, claims.get('tipo'))
        return jsonify(lista), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

# [NOVO] Rota para Editar Paciente
@paciente_bp.route('/api/pacientes/<int:paciente_id>', methods=['PUT'])
@jwt_required()
def editar_paciente(paciente_id):
    dados = request.json
    # Espera: { "nome": "Novo Nome", "data_nascimento": "YYYY-MM-DD" }
    
    if not dados.get('nome') or not dados.get('data_nascimento'):
        return jsonify({"erro": "Nome e Data de Nascimento são obrigatórios"}), 400

    try:
        sucesso = service.atualizar_paciente(paciente_id, dados)
        
        if sucesso:
            return jsonify({"status": "sucesso", "mensagem": "Paciente atualizado!"}), 200
        else:
            return jsonify({"erro": "Paciente não encontrado."}), 404
    except Exception as e:
        return jsonify({"erro": str(e)}), 500