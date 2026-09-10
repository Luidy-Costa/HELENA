from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.services.paciente_service import PacienteService
from app.utils.database import obter_conexao

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

# =====================================================================
# [NOVA ROTA] Obter histórico de predições e dados do paciente
# =====================================================================
@paciente_bp.route('/api/pacientes/<int:paciente_id>/historico', methods=['GET'])
@jwt_required()
def obter_historico_paciente(paciente_id):
    conn = obter_conexao()
    cursor = conn.cursor()
    try:
        # 1. Busca os dados pessoais do paciente (Adequado para a tabela "pacientes")
        cursor.execute("""
            SELECT id, nome_completo, data_nascimento 
            FROM pacientes 
            WHERE id = %s
        """, (paciente_id,))
        pac_row = cursor.fetchone()
        
        if not pac_row:
            return jsonify({"erro": "Paciente não encontrado"}), 404
            
        paciente_data = {
            "id": pac_row[0],
            "nome_completo": pac_row[1],
            "data_nascimento": str(pac_row[2]) if pac_row[2] else "",
            "id_personalizado": str(pac_row[0])
        }

        # 2. Busca o histórico cruzando predicao + hospitais + medicos
        cursor.execute("""
            SELECT p.id, p.probabilidade_risco, p.diagnostico_final, p.data_predicao, 
                   h.nome_fantasia, m.nome_completo
            FROM predicao p
            LEFT JOIN hospitais h ON p.hospital_id = h.id
            LEFT JOIN medicos m ON p.medico_id = m.id
            WHERE p.paciente_id = %s 
            ORDER BY p.data_predicao DESC
        """, (paciente_id,))
        
        pred_rows = cursor.fetchall()
        historico = []
        for row in pred_rows:
            # Pega só a data (DD/MM/YYYY) para bater com o Figma
            data_formatada = row[3].strftime('%d/%m/%Y') if row[3] else "N/A"
            
            historico.append({
                "id": row[0],
                "probabilidade_risco": float(row[1]) if row[1] else 0,
                "diagnostico_final": row[2] or "N/A",
                "data_predicao": data_formatada,
                "hospital": row[4] or "Hospital Não Informado",
                "medico": row[5] or "Médico Não Informado"
            })

        return jsonify({
            "paciente": paciente_data,
            "historico": historico
        }), 200
        
    except Exception as e:
        print(f"Erro SQL na rota historico: {str(e)}") 
        return jsonify({"erro": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# =====================================================================
# [NOVA ROTA] Listar todos os pacientes do Hospital Logado
# =====================================================================
@paciente_bp.route('/api/hospital/pacientes', methods=['GET'])
@jwt_required()
def listar_meus_pacientes_hospital():
    claims = get_jwt()
    hospital_id = get_jwt_identity()
    
    # Garante que quem está chamando é o painel de um hospital
    if claims.get('tipo') != 'hospital':
        return jsonify({"erro": "Acesso restrito a administradores hospitalares."}), 403
        
    conn = obter_conexao()
    cursor = conn.cursor()
    try:
        # Busca todos os pacientes vinculados a este hospital
        cursor.execute("""
            SELECT id, nome_completo, data_nascimento, data_cadastro 
            FROM pacientes 
            WHERE hospital_id = %s 
            ORDER BY id DESC
        """, (hospital_id,))
        
        rows = cursor.fetchall()
        lista = []
        for row in rows:
            lista.append({
                "id": row[0],
                "nome_completo": row[1],
                "data_nascimento": str(row[2]) if row[2] else "",
                "data_cadastro": row[3].strftime('%d/%m/%Y') if row[3] else ""
            })
            
        return jsonify(lista), 200
    except Exception as e:
        print(f"Erro ao listar pacientes do hospital: {str(e)}")
        return jsonify({"erro": str(e)}), 500
    finally:
        cursor.close()
        conn.close()