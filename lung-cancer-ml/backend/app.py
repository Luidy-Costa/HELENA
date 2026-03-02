# importando as bibliotecas 
from flask import Flask, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import datetime
import os, sys

# ensinando a rota para a pasta models onde tem o arquivo "conexao" com a função que conecta o banco de dados
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__),"models")))
from conexao import obter_conexao

# iniciando o servidor 
app = Flask(__name__)

# --- CONFIGURAÇÕES DE SEGURANÇA JWT ---
app.config['JWT_SECRET_KEY'] = 'Carimbo_super_secreto'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(hours=12) # RN11: Expiração em 12 horas
jwt = JWTManager(app)
# --------------------------------------

# uma rota de aferição do servidor, para ver se ele esta realmente ligado
@app.route('/api/health', methods=['GET'])
def health_check():
     return jsonify({
          'status': "sucesso",
          "mensagem": "O servidor do Lung Cancer Prediction esta rodando com sucesso"
     }), 200

# Rota de Cadastro das contas dos hospitais
@app.route('/api/hospitais', methods=["POST"])
def cadastrar_hospital():
    dados = request.json

    cnpj = dados.get('cnpj')
    nome_fantasia = dados.get('nome_fantasia')
    email = dados.get('email_recuperacao')
    senha_bruta = dados.get("senha")

    if not nome_fantasia or not cnpj or not email or not senha_bruta:
        return jsonify({"erro": "Todos os campos são obrigatórios!"}), 400
     
    senha_segura = generate_password_hash(senha_bruta)

    conn = obter_conexao()
    if not conn:
        return jsonify({"erro": "Falha na conexão com o banco de dados."}), 500
    
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO hospitais (nome_fantasia, cnpj, email_recuperacao, senha_hash)
            VALUES (%s, %s, %s, %s) 
            RETURNING id;
        """, (nome_fantasia, cnpj, email, senha_segura))
        
        hospital_id = cursor.fetchone()[0]
        conn.commit()

        return jsonify({
            "status": "sucesso",
            "mensagem": "Hospital cadastrado com perfeição!",
            "hospital_id": hospital_id
        }), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'erro': f'Erro ao cadastrar no banco: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()


# Rota de Login do Hospital
@app.route('/api/login/hospital', methods=["POST"])
def login_hospital():
    dados = request.json

    # CORREÇÃO 1: Hospital loga com CNPJ e não e-mail
    cnpj = dados.get('cnpj')
    senha_pura = dados.get('senha')

    if not cnpj or not senha_pura:
        return jsonify({"erro": "CNPJ e senha são obrigatórios!"}), 400

    conn = obter_conexao()
    if not conn:
        return jsonify({"erro": "Falha na conexão com o banco de dados."}), 500

    try:
        cursor = conn.cursor()
        
        # CORREÇÃO 2: Buscando pelo CNPJ no banco de dados
        cursor.execute("SELECT id, nome_fantasia, senha_hash FROM hospitais WHERE cnpj = %s;", (cnpj,))
        hospital = cursor.fetchone()

        if not hospital or not check_password_hash(hospital[2], senha_pura):
            return jsonify({"erro": "CNPJ ou senha incorretos!"}), 401

        # CORREÇÃO 3: A MÁGICA DO JWT (Gerando o crachá do Hospital)
        identidade_usuario = {
            "id": hospital[0],
            "tipo": "hospital"
        }
        token_acesso = create_access_token(identity=identidade_usuario)

        return jsonify({
            "status": "sucesso",
            "mensagem": f"Bem-vindo(a) ao painel de gestão, {hospital[1]}!",
            "hospital_id": hospital[0],
            "tipo_acesso": "hospital",
            "token": token_acesso  # Entregando o crachá!
        }), 200

    except Exception as e:
        return jsonify({'erro': f'Erro no login: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()


# rota de cadastro do médico
@app.route('/api/medicos', methods=["POST"])
def cadastrar_medico():
    dados = request.json

    nome = dados.get('nome')
    crm = dados.get('crm')
    email = dados.get('email')
    senha_bruta = dados.get('senha')

    if not nome or not crm or not email or not senha_bruta:
        return jsonify({"erro": "Todos os campos do médico são obrigatórios!"}), 400
     
    senha_segura = generate_password_hash(senha_bruta)

    conn = obter_conexao()
    if not conn:
        return jsonify({"erro": "Falha na conexão com o banco de dados."}), 500
     
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO medicos (nome_completo, crm, email_recuperacao, senha_hash)
            VALUES (%s, %s, %s, %s) 
            RETURNING id;
        """, (nome, crm, email, senha_segura))
         
        medico_id = cursor.fetchone()[0]
        conn.commit()
     
        return jsonify({
            "status": "sucesso",
            "mensagem": "Médico cadastrado com sucesso! Perfil pronto para receber convites.",
            "medico_id": medico_id
        }), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'erro': f'Erro ao cadastrar no banco: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()


# Rota de Login do Médico
@app.route('/api/login/medico', methods=["POST"])
def login_medico():
    dados = request.json

    # CORREÇÃO 4: Médico loga com CRM e não e-mail
    crm = dados.get('crm')
    senha_bruta = dados.get('senha')

    if not crm or not senha_bruta:
        return jsonify({"erro": "CRM e senha são obrigatórios!"}), 400

    conn = obter_conexao()
    if not conn:
        return jsonify({"erro": "Falha na conexão com o banco de dados."}), 500

    try:
        cursor = conn.cursor()
        
        # CORREÇÃO 5: Buscando pelo CRM no banco de dados
        cursor.execute("SELECT id, nome_completo, senha_hash FROM medicos WHERE crm = %s;", (crm,))
        medico = cursor.fetchone()

        if not medico or not check_password_hash(medico[2], senha_bruta):
            return jsonify({"erro": "CRM ou senha incorretos!"}), 401

        # CORREÇÃO 6: A MÁGICA DO JWT (Gerando o crachá do Médico)
        identidade_usuario = {
            "id": medico[0],
            "tipo": "medico"
        }
        token_acesso = create_access_token(identity=identidade_usuario)

        return jsonify({
            "status": "sucesso",
            "mensagem": f"Bem-vindo(a) ao sistema, {medico[1]}!",
            "medico_id": medico[0],
            "tipo_acesso": "medico",
            "token": token_acesso  # Entregando o crachá!
        }), 200

    except Exception as e:
        return jsonify({'erro': f'Erro no login: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/api/login/admin', methods=["POST"])
def login_admin():
    dados = request.json

    email=dados.get('email')
    senha_bruta= dados.get('senha')

    if not email or not senha_bruta:
        return jsonify({'erro':"E-mail e senha são obrigatórios!"}),400

    conn= obter_conexao()
    if not conn:
        return jsonify({"erro": "Falha na conexão com o banco de dados."}), 500
    
    try:
        cursor = conn.cursor()
        
        cursor.execute("SELECT id, nome_completo, senha_hash FROM admins WHERE email = %s;", (email,))
        admin = cursor.fetchone()

        if not admin or not check_password_hash(admin[2], senha_bruta):
            return jsonify({"erro": "E-mail ou senha incorretos!"}), 401
    
        identidade_usuario = {
            "id": admin[0],
            "tipo": "admin"
        }

        token_acesso = create_access_token(identity=identidade_usuario)

        return jsonify({
            "status": "sucesso",
            "mensagem": f"Bem-vindo(a) ao modo Deus, {admin[1]}!",
            "admin_id": admin[0],
            "tipo_acesso": "admin",
            "token": token_acesso
        }), 200
    
    except Exception as e:
        return jsonify({'erro': f'Erro no login: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

# Rota de Cadastro de Super Admin
@app.route('/api/admins', methods=["POST"])
@jwt_required()
def cadastrar_admin():
    usuario_logado = get_jwt_identity()

    if usuario_logado.get('tipo') != 'admin':
        return jsonify({"erro": "Acesso negado! Apenas o Super Admin pode cadastrar novos administradores."}), 403

    dados = request.json
    # AJUSTE: Pegando o nome_completo do JSON
    nome_completo = dados.get('nome_completo')
    email = dados.get('email')
    senha_bruta = dados.get('senha')

    if not nome_completo or not email or not senha_bruta:
        return jsonify({"erro": "Nome completo, e-mail e senha são obrigatórios!"}), 400
     
    senha_segura = generate_password_hash(senha_bruta)

    conn = obter_conexao()
    if not conn:
        return jsonify({"erro": "Falha na conexão com o banco de dados."}), 500
    
    try:
        cursor = conn.cursor()
        # AJUSTE: Inserindo na tabela super_admins
        cursor.execute("""
            INSERT INTO admins (nome_completo, email, senha_hash)
            VALUES (%s, %s, %s) 
            RETURNING id;
        """, (nome_completo, email, senha_segura))
        
        novo_admin_id = cursor.fetchone()[0]
        conn.commit()

        return jsonify({
            "status": "sucesso",
            "mensagem": "Novo Super Admin cadastrado com sucesso!",
            "admin_id": novo_admin_id
        }), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'erro': f'Erro ao cadastrar no banco: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

# ligando o servidor
if __name__ == '__main__':
    app.run(debug=True, port=5000)