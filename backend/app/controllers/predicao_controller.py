import os
from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.services.predicao_service import PredicaoService
from app.models.predicao_model import PredicaoModel
from app.services.pdf_service import PDFService

predicao_bp = Blueprint('predicao', __name__)
service = PredicaoService()
model = PredicaoModel()
pdf_service = PDFService()

@predicao_bp.route('/api/predicoes', methods=['POST'])
@jwt_required()
def realizar_predicao():
    claims = get_jwt()
    if claims.get('tipo') != 'medico':
        return jsonify({"erro": "Apenas médicos podem realizar predições."}), 403

    medico_id = get_jwt_identity()
    dados = request.json
    try:
        resultado = service.registrar_predicao(dados, medico_id)
        return jsonify({"status": "sucesso", "data": resultado}), 201
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@predicao_bp.route('/api/predicoes/<int:predicao_id>/pdf', methods=['GET'])
@jwt_required()
def baixar_pdf(predicao_id):
    try:
        dados_completos = model.buscar_por_id_completo(predicao_id)
        if not dados_completos:
            return jsonify({"erro": "Predição não encontrada"}), 404
            
        caminho_arquivo = pdf_service.gerar_laudo(dados_completos)
        
        return send_file(
            os.path.abspath(caminho_arquivo), 
            as_attachment=True, 
            download_name=f"Laudo_HELENA_{predicao_id}.pdf",
            mimetype='application/pdf'
        )
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    
@predicao_bp.route('/api/predicoes/<int:predicao_id>', methods=['GET'])
@jwt_required()
def obter_predicao_json(predicao_id):
    try:
        dados_completos = model.buscar_por_id_completo(predicao_id) 
        if not dados_completos:
            return jsonify({"erro": "Predição não encontrada"}), 404
            
        return jsonify(dados_completos), 200
    except Exception as e:
        print(f"🔥 ERRO NA TELA DE RESULTADO: {str(e)}") 
        return jsonify({"erro": f"Falha no Python: {str(e)}"}), 500
    
@predicao_bp.route('/api/pacientes/<int:paciente_id>/predicoes', methods=['GET'])
@jwt_required()
def historico_paciente_predicoes(paciente_id):
    try:
        lista = model.listar_por_paciente(paciente_id)
        return jsonify(lista), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500