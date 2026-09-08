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

@paciente_bp.route('/api/pacientes/<int:paciente_id>', methods=['PUT'])
@jwt_required()
def editar_paciente(paciente_id):
    dados = request.json
    if not dados.get('nome') or not dados.get('data_nascimento'):
        return jsonify({"erro": "Nome e Data de Nascimento são obrigatórios"}), 400

    try:
        sucesso = service.atualizar_paciente(paciente_id, dados)
        if sucesso:
            return jsonify({"status": "sucesso", "mensagem": "Paciente atualizado!"}), 200
        return jsonify({"erro": "Paciente não encontrado."}), 404
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

# [NOVA ROTA] Inativação (Soft Delete - RI-2)
@paciente_bp.route('/api/pacientes/<int:paciente_id>/inativar', methods=['PATCH'])
@jwt_required()
def inativar_paciente(paciente_id):
    try:
        sucesso = service.model.inativar(paciente_id)
        if sucesso:
            return jsonify({"status": "sucesso", "mensagem": "Paciente inativado do sistema."}), 200
        return jsonify({"erro": "Paciente não encontrado."}), 404
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

# [NOVA ROTA] Exclusão Física Excepcional (Hard Delete - RI-3)
@paciente_bp.route('/api/pacientes/<int:paciente_id>', methods=['DELETE'])
@jwt_required()
def excluir_paciente(paciente_id):
    claims = get_jwt()
    if claims.get('tipo') != 'hospital' and claims.get('tipo') != 'medico':
        return jsonify({"erro": "Acesso negado."}), 403

    try:
        sucesso = service.model.excluir_fisicamente(paciente_id)
        if sucesso:
            return jsonify({"status": "sucesso", "mensagem": "Registro excluído permanentemente."}), 200
        return jsonify({"erro": "Paciente não encontrado ou já possui laudos (violação de integridade)."}), 400
    except Exception as e:
        return jsonify({"erro": "Não é possível excluir um paciente que já possui laudos emitidos."}), 400

@paciente_bp.route('/api/hospitais/<int:hospital_id>/pacientes', methods=['GET'])
@jwt_required()
def listar_pacientes_do_hospital(hospital_id):
    claims = get_jwt()
    medico_id = get_jwt_identity()
    
    if claims.get('tipo') != 'medico':
        return jsonify({"erro": "Acesso negado"}), 403
        
    try:
        if not service.usuario_model.verificar_vinculo(medico_id, hospital_id):
            return jsonify({"erro": "Você não tem permissão para acessar este hospital"}), 403
            
        pacientes_brutos = service.model.listar_por_hospital(hospital_id)
        lista = [{"id": p[0], "nome": p[1], "dataNascimento": str(p[2]), "ultimaAtualizacao": str(p[3])} for p in pacientes_brutos]
        return jsonify(lista), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500