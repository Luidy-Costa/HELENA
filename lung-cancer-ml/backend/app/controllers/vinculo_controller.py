from flask import Blueprint, request, jsonify, current_app, url_for
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.models.usuario_model import UsuarioModel
from app.services.email_service import EmailService
from itsdangerous import URLSafeTimedSerializer, SignatureExpired # <--- Importante!

vinculo_bp = Blueprint('vinculo', __name__)
model = UsuarioModel()
email_service = EmailService()

# 1. HOSPITAL ENVIA CONVITE (Gera Link Mágico)
@vinculo_bp.route('/api/vinculos/convidar', methods=['POST'])
@jwt_required()
def enviar_convite():
    claims = get_jwt()
    if claims.get('tipo') not in ['hospital', 'admin']:
        return jsonify({"erro": "Apenas hospitais podem enviar convites"}), 403

    hospital_id = get_jwt_identity() if claims.get('tipo') == 'hospital' else request.json.get('hospital_id')
    
    # Busca dados do médico pelo CRM enviado
    medico_data = model.buscar_medico_por_crm(request.json.get('crm'))
    
    if not medico_data:
        return jsonify({"erro": "Médico não encontrado com este CRM"}), 404
    
    medico_id = medico_data[0]
    email_real_medico = medico_data[3]
    
    # Busca dados do hospital para o email
    hospital_data = model.buscar_hospital_por_id(hospital_id)
    nome_hospital = hospital_data[1]

    # Cria no banco como "Pendente"
    sucesso_banco = model.criar_vinculo_pendente(hospital_id, medico_id)
    
    if not sucesso_banco:
        # Se já existe, vamos tentar pegar o ID do vínculo existente para re-enviar o e-mail?
        # Por simplicidade agora, retornamos erro.
        return jsonify({"erro": "Médico já vinculado ou convite pendente"}), 400

    # --- MÁGICA DO LINK ---
    # 1. Recuperamos o ID do vínculo recém criado
    # (Como o método criar_vinculo_pendente retorna True/False, vamos ter que buscar o ID)
    convites = model.listar_convites_medico(medico_id)
    # Pega o último convite deste hospital (lógica simplificada)
    vinculo_id = None
    for c in convites:
        if c[1] == nome_hospital: # c[1] é nome do hospital
            vinculo_id = c[0]
            break
            
    if vinculo_id:
        # 2. Gera o Token Seguro
        s = URLSafeTimedSerializer(current_app.config['JWT_SECRET_KEY'])
        token = s.dumps(vinculo_id, salt='confirmar-vinculo')
        
        # 3. Cria o Link completo (http://localhost:5000/api/vinculos/confirmar/TOKEN)
        link = url_for('vinculo.confirmar_via_email', token=token, _external=True)
        
        email_service.enviar_convite_vinculo(email_real_medico, nome_hospital, link)

    return jsonify({"status": "sucesso", "mensagem": "Convite enviado com link de aceite!"}), 201


# 2. ROTA QUE O LINK DO E-MAIL ACESSA (Aceita Automático)
@vinculo_bp.route('/api/vinculos/confirmar/<token>', methods=['GET'])
def confirmar_via_email(token):
    s = URLSafeTimedSerializer(current_app.config['JWT_SECRET_KEY'])
    
    try:
        # Tenta decodificar o token (expira em 24h = 86400 segundos)
        vinculo_id = s.loads(token, salt='confirmar-vinculo', max_age=86400)
    except SignatureExpired:
        return "<h1>O link expirou!</h1> Solicite um novo convite.", 400
    except Exception:
        return "<h1>Link inválido!</h1>", 400
    
    # Atualiza no Banco
    sucesso = model.responder_convite(vinculo_id, 'Ativo')
    
    if sucesso:
        # Retorna uma página HTML simples de sucesso
        return """
        <div style="text-align:center; padding: 50px; font-family: Arial;">
            <h1 style="color: green;">Sucesso! 🎉</h1>
            <p>Você agora faz parte da equipe médica.</p>
            <p>Pode fechar esta janela.</p>
        </div>
        """, 200
    else:
        return "<h1>Erro ao ativar vínculo.</h1>", 500

# 3. LISTAR E RESPONDER MANUALMENTE (Mantemos para o Frontend)
@vinculo_bp.route('/api/vinculos/pendentes', methods=['GET'])
@jwt_required()
def listar_convites():
    medico_id = get_jwt_identity()
    convites = model.listar_convites_medico(medico_id)
    lista = [{"vinculo_id": c[0], "hospital": c[1]} for c in convites]
    return jsonify(lista), 200