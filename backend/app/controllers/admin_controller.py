import os
from flask import Blueprint, jsonify, request, send_file
from flask_jwt_extended import jwt_required, get_jwt
from app.services.dashboard_service import DashboardService
from app.models.usuario_model import UsuarioModel
from app.services.auth_service import AuthService
from app.services.paciente_service import PacienteService
from app.models.predicao_model import PredicaoModel
from app.services.pdf_service import PDFService
from app.utils.database import obter_conexao

admin_bp = Blueprint('admin', __name__)
dashboard_service = DashboardService()
usuario_model = UsuarioModel()
auth_service = AuthService()
paciente_service = PacienteService()
predicao_model = PredicaoModel()
pdf_service = PDFService()

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

# =====================================================================
# ROTAS PARA A VISÃO INTERNA DO HOSPITAL (US27 E US28)
# =====================================================================
@admin_bp.route('/api/admin/hospital/<int:hospital_id>/dashboard', methods=['GET'])
@jwt_required()
def dashboard_hospital_restrito(hospital_id):
    try:
        check_admin()
        stats = dashboard_service.obter_estatisticas_hospital_simples(hospital_id)
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@admin_bp.route('/api/admin/hospital/<int:hospital_id>/medicos', methods=['GET'])
@jwt_required()
def listar_medicos_hospital_restrito(hospital_id):
    try:
        check_admin()
        medicos_brutos = usuario_model.listar_medicos_por_hospital(hospital_id)
        
        lista = []
        for m in medicos_brutos:
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

@admin_bp.route('/api/admin/hospital/<int:hospital_id>/convite', methods=['POST'])
@jwt_required()
def suporte_enviar_convite(hospital_id):
    try:
        check_admin()
        dados = request.json
        email = dados.get('email')
        crm = dados.get('crm')
        
        medico = usuario_model.buscar_medico_por_crm(crm)
        if not medico:
            return jsonify({"erro": "Médico não encontrado com este CRM."}), 404
            
        criou = usuario_model.criar_vinculo_pendente(hospital_id, medico[0])
        if not criou:
            return jsonify({"erro": "Já existe um vínculo ativo ou pendente."}), 400
            
        return jsonify({"status": "sucesso", "mensagem": "Convite de suporte enviado com sucesso"}), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@admin_bp.route('/api/admin/hospital/<int:hospital_id>/medicos/<int:medico_id>/status', methods=['PUT'])
@jwt_required()
def suporte_alterar_status_medico(hospital_id, medico_id):
    try:
        check_admin()
        dados = request.json
        novo_status = 'Ativo' if dados.get('ativo') else 'Inativo'
        
        conn = obter_conexao()
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE vinculos_hospital_medico 
            SET status = %s 
            WHERE hospital_id = %s AND medico_id = %s
        """, (novo_status, hospital_id, medico_id))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"status": "sucesso"}), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

# =====================================================================
# GERAÇÃO DE PDF ANONIMIZADO (LGPD - US31)
# =====================================================================
@admin_bp.route('/api/admin/predicao/<int:predicao_id>/pdf', methods=['GET'])
@jwt_required()
def baixar_pdf_auditoria_anonimizado(predicao_id):
    try:
        check_admin()
        
        # 1. Busca os dados originais completos usando a Model correta
        dados_completos = predicao_model.buscar_por_id_completo(predicao_id)
        if not dados_completos:
            return jsonify({"erro": "Laudo não encontrado"}), 404
            
        # 2. Aplica a máscara para cumprir a LGPD em memória
        dados_completos['paciente_nome'] = "PACIENTE ANÔNIMO (LGPD)"
        dados_completos['paciente_nasc'] = "**/**/****"
        
        # 3. Gera o PDF utilizando o serviço de PDF (cria o arquivo temporário)
        caminho_arquivo = pdf_service.gerar_laudo(dados_completos)
        
        # 4. Envia o arquivo físico protegido
        id_display = dados_completos.get("paciente_id") or dados_completos.get("id_personalizado") or "Anonimo"
        return send_file(
            os.path.abspath(caminho_arquivo),
            as_attachment=True,
            download_name=f'Auditoria_Predicao_{id_display}.pdf',
            mimetype='application/pdf'
        )
    except Exception as e:
        print(f"Erro na geração do PDF anonimizado: {e}")
        return jsonify({"erro": str(e)}), 500