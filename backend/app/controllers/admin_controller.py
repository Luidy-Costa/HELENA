from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt
from app.services.dashboard_service import DashboardService
from app.models.usuario_model import UsuarioModel
from app.services.auth_service import AuthService
from app.services.paciente_service import PacienteService

admin_bp = Blueprint('admin', __name__)
dashboard_service = DashboardService()
usuario_model = UsuarioModel()
auth_service = AuthService()
paciente_service = PacienteService()

def check_admin():
    claims = get_jwt()
    if claims.get('tipo') != 'admin':
        raise PermissionError("Acesso restrito a administradores.")

@admin_bp.route('/api/admin/dashboard', methods=['GET'])
@jwt_required()
def dashboard_geral():
    try:
        check_admin()
        stats = dashboard_service.obter_estatisticas_admin()
        return jsonify(stats), 200
    except PermissionError as e:
        return jsonify({"erro": str(e)}), 403
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@admin_bp.route('/api/admin/hospitais', methods=['GET'])
@jwt_required()
def listar_hospitais():
    try:
        check_admin()
        hospitais_brutos = usuario_model.listar_todos_hospitais()
        
        lista = []
        for h in hospitais_brutos:
            lista.append({
                "id": h[0],
                "nome": h[1],
                "cnpj": h[2],
                "email": h[3],
                "ativo": h[4],
                "data_cadastro": str(h[5])
            })
        return jsonify(lista), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@admin_bp.route('/api/admin/novo', methods=['POST'])
@jwt_required()
def cadastrar_novo_admin():
    try:
        check_admin()
        dados = request.json
        novo_id = auth_service.registrar_admin(dados)
        return jsonify({"status": "sucesso", "mensagem": "Novo Admin criado", "id": novo_id}), 201
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

# VISÃO DE AUDITORIA COM LGPD (Máscara de Dados Sensíveis)
@admin_bp.route('/api/admin/hospital/<int:hospital_id>/pacientes', methods=['GET'])
@jwt_required()
def ver_pacientes_hospital(hospital_id):
    try:
        check_admin()
        pacientes_brutos = paciente_service.listar(hospital_id, 'hospital')
        
        lista_anonima = []
        for p in pacientes_brutos:
            lista_anonima.append({
                "id_paciente": p[0],
                "nome": "PACIENTE ANÔNIMO (LGPD)", 
                "data_nascimento": "**/**/****",   
                "ultima_atualizacao": str(p[3])
            })
            
        return jsonify(lista_anonima), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500