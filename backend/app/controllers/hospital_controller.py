from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.models.usuario_model import UsuarioModel
from app.services.dashboard_service import DashboardService
from app.utils.database import obter_conexao

hospital_bp = Blueprint('hospital_painel', __name__)
usuario_model = UsuarioModel()
dashboard_service = DashboardService()

@hospital_bp.route('/api/hospital/medicos', methods=['GET'])
@jwt_required()
def listar_medicos_do_hospital():
    claims = get_jwt()
    if claims.get('tipo') != 'hospital':
        return jsonify({"erro": "Acesso negado"}), 403
        
    hospital_id = get_jwt_identity()
    try:
        medicos = usuario_model.listar_medicos_por_hospital(hospital_id)
        lista = []
        for m in medicos:
            lista.append({
                "id": m[0],
                "nome_completo": m[1],
                "crm": m[2],
                "email": m[3],
                "ativo": m[4]
            })
        return jsonify(lista), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@hospital_bp.route('/api/hospital/dashboard', methods=['GET'])
@jwt_required()
def dashboard_hospital():
    claims = get_jwt()
    if claims.get('tipo') != 'hospital':
        return jsonify({"erro": "Acesso negado"}), 403
        
    hospital_id = get_jwt_identity()
    try:
        stats = dashboard_service.obter_estatisticas_hospital_simples(hospital_id)
        
        resultado_react = {
            "medicos_ativos": stats.get("medicos_ativos", stats.get("medicos", 0)),
            "total_pacientes": stats.get("total_pacientes", stats.get("pacientes", 0)),
            "avaliacoes_mes": stats.get("avaliacoes_mes", stats.get("avaliacoes", 0)),
            "alto_risco": stats.get("alto_risco", stats.get("risco", 0))
        }
        return jsonify(resultado_react), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    
@hospital_bp.route('/api/hospital/medicos/<int:medico_id>/status', methods=['PUT'])
@jwt_required()
def alterar_status_medico(medico_id):
    claims = get_jwt()
    if claims.get('tipo') != 'hospital':
        return jsonify({"erro": "Acesso negado"}), 403

    hospital_id = get_jwt_identity()
    novo_status = 'Ativo' if request.json.get('ativo') else 'Inativo'

    conn = obter_conexao()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE vinculos_hospital_medico
            SET status = %s
            WHERE hospital_id = %s AND medico_id = %s
        """, (novo_status, hospital_id, medico_id))
        
        if cursor.rowcount == 0:
            return jsonify({"erro": "Vínculo não encontrado"}), 404
            
        conn.commit()
        return jsonify({"status": "sucesso"}), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# =====================================================================
# [ROTA ATUALIZADA] Obter dados E estatísticas do hospital
# =====================================================================
@hospital_bp.route('/api/hospitais/<int:hospital_id>', methods=['GET'])
@jwt_required()
def obter_hospital(hospital_id):
    conn = obter_conexao()
    cursor = conn.cursor()
    usuario_id = get_jwt_identity()
    claims = get_jwt()
    tipo_usuario = claims.get('tipo')
    
    try:
        # 1. Busca o nome do hospital
        cursor.execute("""
            SELECT nome_fantasia 
            FROM hospitais 
            WHERE id = %s
        """, (hospital_id,))
        row = cursor.fetchone()
        
        if not row:
            return jsonify({"erro": "Hospital não encontrado"}), 404
        
        nome_hospital = row[0]
        
        # 2. Conta Total de Pacientes do Hospital
        cursor.execute("SELECT COUNT(*) FROM pacientes WHERE hospital_id = %s", (hospital_id,))
        total_pacientes = cursor.fetchone()[0]
        
        # 3. Conta Avaliações do Mês e Alto Risco (Dinâmico por tipo de usuário)
        if tipo_usuario == 'medico':
            # Se for médico, conta só as predições DELE neste hospital
            cursor.execute("""
                SELECT COUNT(*) 
                FROM predicao 
                WHERE hospital_id = %s AND medico_id = %s
                AND EXTRACT(MONTH FROM data_predicao) = EXTRACT(MONTH FROM CURRENT_DATE)
                AND EXTRACT(YEAR FROM data_predicao) = EXTRACT(YEAR FROM CURRENT_DATE)
            """, (hospital_id, usuario_id))
            avaliacoes_mes = cursor.fetchone()[0]
            
            # ATENÇÃO: %%alto%% para escapar o caractere no psycopg2
            cursor.execute("""
                SELECT COUNT(*) 
                FROM predicao 
                WHERE hospital_id = %s AND medico_id = %s
                AND LOWER(diagnostico_final) LIKE '%%alto%%'
            """, (hospital_id, usuario_id))
            alto_risco = cursor.fetchone()[0]
            
        else:
            # Se for hospital, conta TODAS as predições da unidade
            cursor.execute("""
                SELECT COUNT(*) 
                FROM predicao 
                WHERE hospital_id = %s 
                AND EXTRACT(MONTH FROM data_predicao) = EXTRACT(MONTH FROM CURRENT_DATE)
                AND EXTRACT(YEAR FROM data_predicao) = EXTRACT(YEAR FROM CURRENT_DATE)
            """, (hospital_id,))
            avaliacoes_mes = cursor.fetchone()[0]
            
            # ATENÇÃO: %%alto%% para escapar o caractere no psycopg2
            cursor.execute("""
                SELECT COUNT(*) 
                FROM predicao 
                WHERE hospital_id = %s 
                AND LOWER(diagnostico_final) LIKE '%%alto%%'
            """, (hospital_id,))
            alto_risco = cursor.fetchone()[0]

        dados_hospital = {
            "id": hospital_id,
            "nome": nome_hospital,
            "total_pacientes": total_pacientes,
            "avaliacoes_mes": avaliacoes_mes,
            "alto_risco": alto_risco
        }
        
        return jsonify(dados_hospital), 200
        
    except Exception as e:
        print(f"Erro SQL ao obter estatísticas do hospital: {str(e)}")
        return jsonify({"erro": str(e)}), 500
    finally:
        cursor.close()
        conn.close()