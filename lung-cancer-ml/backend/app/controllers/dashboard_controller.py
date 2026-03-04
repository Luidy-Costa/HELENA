from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.services.dashboard_service import DashboardService

dashboard_bp = Blueprint('dashboard', __name__)
service = DashboardService()

@dashboard_bp.route('/api/dashboard/resumo', methods=['GET'])
@jwt_required()
def get_resumo():
    claims = get_jwt()
    usuario_id = get_jwt_identity()
    
    # Se for médico, mostra as estatísticas dele
    if claims.get('tipo') == 'medico':
        try:
            stats = service.obter_estatisticas_medico(usuario_id)
            return jsonify(stats), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 500
            
    return jsonify({"erro": "Acesso não implementado para este perfil"}), 403