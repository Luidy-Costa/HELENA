# importando as bibliotecas 
from flask import Flask, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
import datetime
import os, sys
import random
import json

# ensinando a rota para a pasta models onde tem o arquivo "conexao" com a função que conecta o banco de dados
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__),"models")))
from conexao import obter_conexao

# iniciando o servidor 
app = Flask(__name__)

# --- CONFIGURAÇÕES DE SEGURANÇA JWT ---
app.config['JWT_SECRET_KEY'] = 'Carimbo_super_secreto'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(hours=1) 
jwt = JWTManager(app)
# --------------------------------------

# uma rota de aferição do servidor, para ver se ele esta realmente ligado
@app.route('/api/health', methods=['GET'])
def health_check():
     return jsonify({
          'status': "sucesso",
          "mensagem": "O servidor do Lung Cancer Prediction esta rodando com sucesso"
     }), 200


# ==============================================================================
# GESTÃO DE HOSPITAIS
# ==============================================================================

@app.route('/api/hospitais', methods=["POST"])
def cadastrar_hospital():
    dados = request.json

    cnpj = dados.get('cnpj')
    nome_fantasia = dados.get('nome_fantasia')
    email = dados.get('email') 
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
            INSERT INTO hospitais (nome_fantasia, cnpj, email, senha_hash)
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

@app.route('/api/login/hospital', methods=["POST"])
def login_hospital():
    dados = request.json
  
    cnpj = dados.get('cnpj')
    senha_pura = dados.get('senha')

    if not cnpj or not senha_pura:
        return jsonify({"erro": "CNPJ e senha são obrigatórios!"}), 400

    conn = obter_conexao()
    if not conn:
        return jsonify({"erro": "Falha na conexão com o banco de dados."}), 500

    try:
        cursor = conn.cursor()     
        cursor.execute("SELECT id, nome_fantasia, senha_hash FROM hospitais WHERE cnpj = %s;", (cnpj,))
        hospital = cursor.fetchone()

        if not hospital or not check_password_hash(hospital[2], senha_pura):
            return jsonify({"erro": "CNPJ ou senha incorretos!"}), 401

        token_acesso = create_access_token(
            identity=str(hospital[0]), 
            additional_claims={"tipo": "hospital"}
        )

        return jsonify({
            "status": "sucesso",
            "mensagem": f"Bem-vindo(a) ao painel de gestão, {hospital[1]}!",
            "hospital_id": hospital[0],
            "tipo_acesso": "hospital",
            "token": token_acesso
        }), 200

    except Exception as e:
        return jsonify({'erro': f'Erro no login: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/api/hospitais/perfil', methods=["PUT"])
@jwt_required()
def editar_perfil_hospital():
    hospital_id = get_jwt_identity()
    cracha_completo = get_jwt()

    if cracha_completo.get('tipo') != 'hospital':
        return jsonify({"erro": "Acesso negado! Apenas o gestor do hospital pode editar este perfil."}), 403

    dados = request.json

    nome_fantasia = dados.get('nome_fantasia')
    email = dados.get('email') 
    foto_perfil = dados.get('foto_perfil')
    cnpj = dados.get('cnpj')

    if not nome_fantasia or not email or not cnpj:
        return jsonify({"erro": "Nome do hospital, CNPJ e e-mail são obrigatórios!"}), 400

    conn = obter_conexao()
    if not conn:
        return jsonify({"erro": "Falha na conexão com a base de dados."}), 500
    
    try:
        cursor = conn.cursor()
        
        cursor.execute("""
            UPDATE hospitais 
            SET nome_fantasia = %s, email = %s, foto_perfil = %s, cnpj = %s
            WHERE id = %s;
        """, (nome_fantasia, email, foto_perfil, cnpj, hospital_id))
        
        if cursor.rowcount == 0:
            return jsonify({"erro": "Hospital não encontrado."}), 404

        conn.commit()

        return jsonify({"status": "sucesso", "mensagem": "Perfil do hospital atualizado com sucesso!"}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({'erro': f'Erro ao atualizar o perfil. O CNPJ já pode estar em uso. Detalhes: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()


# ==============================================================================
# GESTÃO DE MÉDICOS
# ==============================================================================

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
            INSERT INTO medicos (nome_completo, crm, email, senha_hash)
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

@app.route('/api/login/medico', methods=["POST"])
def login_medico():
    dados = request.json

    crm = dados.get('crm')
    senha_bruta = dados.get('senha')

    if not crm or not senha_bruta:
        return jsonify({"erro": "CRM e senha são obrigatórios!"}), 400

    conn = obter_conexao()
    if not conn:
        return jsonify({"erro": "Falha na conexão com o banco de dados."}), 500

    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id, nome_completo, senha_hash FROM medicos WHERE crm = %s;", (crm,))
        medico = cursor.fetchone()

        if not medico or not check_password_hash(medico[2], senha_bruta):
            return jsonify({"erro": "CRM ou senha incorretos!"}), 401

        token_acesso = create_access_token(
            identity=str(medico[0]), 
            additional_claims={"tipo": "medico"}
        )

        return jsonify({
            "status": "sucesso",
            "mensagem": f"Bem-vindo(a) ao sistema, {medico[1]}!",
            "medico_id": medico[0],
            "tipo_acesso": "medico",
            "token": token_acesso 
        }), 200

    except Exception as e:
        return jsonify({'erro': f'Erro no login: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/api/medicos/perfil', methods=["PUT"])
@jwt_required()
def editar_perfil_medico():
    medico_id = get_jwt_identity()
    cracha_completo = get_jwt()

    if cracha_completo.get('tipo') != 'medico':
        return jsonify({"erro": "Acesso negado! Apenas médicos podem editar este perfil."}), 403

    dados = request.json

    nome_completo = dados.get('nome_completo')
    email = dados.get('email')
    foto_perfil = dados.get('foto_perfil')
    crm = dados.get('crm')

    if not nome_completo or not email or not crm:
        return jsonify({"erro": "Nome, CRM e e-mail são obrigatórios!"}), 400

    conn = obter_conexao()
    if not conn:
        return jsonify({"erro": "Falha na conexão com a base de dados."}), 500
    
    try:
        cursor = conn.cursor()
        
        cursor.execute("""
            UPDATE medicos 
            SET nome_completo = %s, email = %s, foto_perfil = %s, crm = %s
            WHERE id = %s;
        """, (nome_completo, email, foto_perfil, crm, medico_id))
        
        if cursor.rowcount == 0:
            return jsonify({"erro": "Médico não encontrado."}), 404

        conn.commit()

        return jsonify({"status": "sucesso", "mensagem": "Perfil e CRM atualizados com sucesso!"}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({'erro': f'Erro ao atualizar o perfil. O CRM já pode estar em uso. Detalhes: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()


# ==============================================================================
# GESTÃO DO SUPER ADMIN
# ==============================================================================

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
    
        token_acesso = create_access_token(
            identity=str(admin[0]), 
            additional_claims={"tipo": "admin"}
        )

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

@app.route('/api/admins', methods=["POST"])
@jwt_required()
def cadastrar_admin():
    usuario_id = get_jwt_identity()
    cracha_completo = get_jwt()

    if cracha_completo.get('tipo') != 'admin':
        return jsonify({"erro": "Acesso negado! Apenas o Super Admin pode cadastrar novos administradores."}), 403

    dados = request.json
    
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
        cursor.execute("""
            INSERT INTO admins (nome_completo, email, senha_hash)
            VALUES (%s, %s, %s) 
            RETURNING id;
        """, (nome_completo, email, senha_segura))
        
        novo_admin_id = cursor.fetchone()[0]
        conn.commit()

        return jsonify({"status": "sucesso", "mensagem": "Novo Super Admin cadastrado com sucesso!", "admin_id": novo_admin_id}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'erro': f'Erro ao cadastrar no banco: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/api/admins/perfil', methods=["PUT"])
@jwt_required()
def editar_perfil_admin():
    admin_id = get_jwt_identity()
    cracha_completo = get_jwt()

    if cracha_completo.get('tipo') != 'admin':
        return jsonify({"erro": "Acesso negado! Apenas administradores podem usar esta rota."}), 403

    dados = request.json
    nome_completo = dados.get('nome_completo')
    email = dados.get('email')

    if not nome_completo or not email:
        return jsonify({"erro": "Nome completo e e-mail são obrigatórios!"}), 400

    conn = obter_conexao()
    if not conn:
        return jsonify({"erro": "Falha na conexão com a base de dados."}), 500
    
    try:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE admins 
            SET nome_completo = %s, email = %s
            WHERE id = %s;
        """, (nome_completo, email, admin_id))
        
        if cursor.rowcount == 0:
            return jsonify({"erro": "Admin não encontrado."}), 404

        conn.commit()
        return jsonify({"status": "sucesso", "mensagem": "O seu perfil de Admin foi atualizado com sucesso!"}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({'erro': f'Erro ao atualizar o perfil. O e-mail já pode estar em uso. Detalhes: {str(e)}'}), 500
    finally:
        cursor.close()
        conn.close()


# ==============================================================================
# MOTOR DE RECUPERAÇÃO DE SENHA (OPÇÃO A COM JWT)
# ==============================================================================

@app.route('/api/recuperacao-senha/solicitar', methods=['POST'])
def solicitar_recuperacao():
    dados = request.json
    email = dados.get('email')

    if not email:
        return jsonify({"erro": "O e-mail é obrigatório!"}), 400

    conn = obter_conexao()
    if not conn:
        return jsonify({"erro": "Falha na conexão com a base de dados."}), 500

    try:
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 'medico' as tipo FROM medicos WHERE email = %s
            UNION
            SELECT 'hospital' as tipo FROM hospitais WHERE email = %s
            UNION
            SELECT 'admin' as tipo FROM admins WHERE email = %s;
        """, (email, email, email))
        
        usuario = cursor.fetchone()

        if not usuario:
            return jsonify({"status": "sucesso", "mensagem": "Se o e-mail existir na nossa base, um código foi enviado."}), 200

        codigo = str(random.randint(10000, 99999))
        agora = datetime.datetime.now()
        expiracao = agora + datetime.timedelta(minutes=15)

        cursor.execute("""
            INSERT INTO recuperacao_senha (email, codigo, data_expiracao)
            VALUES (%s, %s, %s);
        """, (email, codigo, expiracao))
        conn.commit()

        print("\n" + "="*50)
        print(f"📧 EMAIL SIMULADO PARA: {email}")
        print(f"🔑 CÓDIGO DE RECUPERAÇÃO LCP: {codigo}")
        print("="*50 + "\n")

        return jsonify({"status": "sucesso", "mensagem": "Se o e-mail existir na nossa base, um código foi enviado."}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({'erro': f'Erro ao gerar código: {str(e)}'}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/recuperacao-senha/validar-codigo', methods=['POST'])
def validar_codigo():
    dados = request.json
    email = dados.get('email')
    codigo = dados.get('codigo')

    if not email or not codigo:
        return jsonify({"erro": "E-mail e código são obrigatórios!"}), 400

    conn = obter_conexao()
    if not conn:
        return jsonify({"erro": "Falha na conexão com a base de dados."}), 500

    try:
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id FROM recuperacao_senha 
            WHERE email = %s AND codigo = %s AND utilizado = FALSE AND data_expiracao > NOW()
            ORDER BY data_criacao DESC LIMIT 1;
        """, (email, codigo))
        
        recuperacao = cursor.fetchone()

        if not recuperacao:
            return jsonify({"erro": "Código inválido, expirado ou já utilizado!"}), 400

        recuperacao_id = recuperacao[0]

        cursor.execute("UPDATE recuperacao_senha SET utilizado = TRUE WHERE id = %s", (recuperacao_id,))
        conn.commit()

        tempo_expiracao = datetime.timedelta(minutes=10)
        token_recuperacao = create_access_token(
            identity=email, 
            additional_claims={"tipo": "recuperacao"},
            expires_delta=tempo_expiracao
        )

        return jsonify({
            "status": "sucesso",
            "mensagem": "Código válido! Pode prosseguir para a redefinição de senha.",
            "token_recuperacao": token_recuperacao
        }), 200

    except Exception as e:
        conn.rollback()
        return jsonify({'erro': f'Erro ao validar código: {str(e)}'}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/recuperacao-senha/redefinir', methods=['PUT'])
@jwt_required()
def redefinir_senha_limpo():
    cracha = get_jwt()
    
    if cracha.get('tipo') != 'recuperacao':
        return jsonify({"erro": "Acesso negado! Token inválido para redefinição de senha."}), 403

    email_alvo = get_jwt_identity() 
    
    dados = request.json
    nova_senha = dados.get('nova_senha')

    if not nova_senha:
        return jsonify({"erro": "A nova senha é obrigatória!"}), 400

    conn = obter_conexao()
    if not conn:
        return jsonify({"erro": "Falha na conexão com a base de dados."}), 500

    try:
        cursor = conn.cursor()
        senha_segura = generate_password_hash(nova_senha)

        cursor.execute("UPDATE medicos SET senha_hash = %s WHERE email = %s", (senha_segura, email_alvo))
        cursor.execute("UPDATE hospitais SET senha_hash = %s WHERE email = %s", (senha_segura, email_alvo))
        cursor.execute("UPDATE admins SET senha_hash = %s WHERE email = %s", (senha_segura, email_alvo))

        conn.commit()

        return jsonify({
            "status": "sucesso",
            "mensagem": "Senha redefinida com sucesso! Já pode fazer o login."
        }), 200

    except Exception as e:
        conn.rollback()
        return jsonify({'erro': f'Erro ao redefinir senha: {str(e)}'}), 500
    finally:
        cursor.close()
        conn.close()

# ==============================================================================
# MOTOR DE VÍNCULOS (HOSPITAL <-> MÉDICO)
# ==============================================================================

@app.route('/api/vinculos/convidar', methods=['POST'])
@jwt_required()
def convidar_medico():
    cracha = get_jwt()
    hospital_id = get_jwt_identity()

    if cracha.get('tipo') != 'hospital':
        return jsonify({"erro": "Acesso negado! Apenas hospitais podem enviar convites."}), 403

    dados = request.json
    email_medico = dados.get('email_medico')

    if not email_medico:
        return jsonify({"erro": "O e-mail do médico é obrigatório para enviar o convite!"}), 400

    conn = obter_conexao()
    if not conn:
        return jsonify({"erro": "Falha na conexão com a base de dados."}), 500

    try:
        cursor = conn.cursor()
        cursor.execute("SELECT id, nome_completo FROM medicos WHERE email = %s;", (email_medico,))
        medico = cursor.fetchone()

        if not medico:
            return jsonify({"erro": "Nenhum médico encontrado com este e-mail no sistema."}), 404
            
        medico_id = medico[0]
        nome_medico = medico[1]

        cursor.execute("""
            SELECT status FROM vinculos_hospital_medico 
            WHERE hospital_id = %s AND medico_id = %s;
        """, (hospital_id, medico_id))
        
        vinculo_existente = cursor.fetchone()

        if vinculo_existente:
            status_atual = vinculo_existente[0]
            if status_atual == 'Pendente':
                print("\n" + "="*50)
                print(f"📧 [REENVIO] EMAIL SIMULADO PARA: {email_medico}")
                print(f"🏥 Olá Dr(a) {nome_medico}, o Hospital (ID: {hospital_id}) reenviou o convite para você!")
                print("="*50 + "\n")
                return jsonify({"status": "sucesso", "mensagem": f"O convite já estava pendente e foi reenviado com sucesso!"}), 200
            elif status_atual == 'Ativo':
                return jsonify({"erro": f"O Dr(a). {nome_medico} já faz parte da sua equipe clínica."}), 400

        cursor.execute("""
            INSERT INTO vinculos_hospital_medico (hospital_id, medico_id)
            VALUES (%s, %s);
        """, (hospital_id, medico_id))
        
        conn.commit()

        print("\n" + "="*50)
        print(f"📧 [NOVO] EMAIL SIMULADO PARA: {email_medico}")
        print(f"🏥 Olá Dr(a) {nome_medico}, o Hospital (ID: {hospital_id}) acabou de convidar você!")
        print("="*50 + "\n")

        return jsonify({"status": "sucesso", "mensagem": f"Convite enviado com sucesso para o Dr(a). {nome_medico}!"}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'erro': f'Erro ao enviar convite: {str(e)}'}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/vinculos/aceitar', methods=['PUT'])
@jwt_required()
def aceitar_convite():
    cracha = get_jwt()
    medico_id = get_jwt_identity()

    if cracha.get('tipo') != 'medico':
        return jsonify({"erro": "Acesso negado! Apenas médicos podem aceitar convites."}), 403

    dados = request.json
    hospital_id = dados.get('hospital_id')

    if not hospital_id:
        return jsonify({"erro": "O ID do hospital é obrigatório!"}), 400

    conn = obter_conexao()
    if not conn:
        return jsonify({"erro": "Falha na conexão com a base de dados."}), 500

    try:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE vinculos_hospital_medico 
            SET status = 'Ativo' 
            WHERE medico_id = %s AND hospital_id = %s AND status = 'Pendente';
        """, (medico_id, hospital_id))
        
        if cursor.rowcount == 0:
            return jsonify({"erro": "Convite não encontrado, já aceito ou rejeitado."}), 404
            
        conn.commit()

        return jsonify({"status": "sucesso", "mensagem": "Convite aceito com sucesso! Você agora faz parte da equipe deste hospital."}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({'erro': f'Erro ao aceitar o convite: {str(e)}'}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/vinculos/rejeitar', methods=['DELETE'])
@jwt_required()
def rejeitar_convite():
    cracha = get_jwt()
    medico_id = get_jwt_identity()

    if cracha.get('tipo') != 'medico':
        return jsonify({"erro": "Acesso negado! Apenas médicos podem rejeitar convites."}), 403

    dados = request.json
    hospital_id = dados.get('hospital_id')

    if not hospital_id:
        return jsonify({"erro": "O ID do hospital é obrigatório para rejeitar!"}), 400

    conn = obter_conexao()
    if not conn:
        return jsonify({"erro": "Falha na conexão com a base de dados."}), 500

    try:
        cursor = conn.cursor()
        cursor.execute("""
            DELETE FROM vinculos_hospital_medico 
            WHERE medico_id = %s AND hospital_id = %s AND status = 'Pendente';
        """, (medico_id, hospital_id))
        
        if cursor.rowcount == 0:
            return jsonify({"erro": "Convite não encontrado ou você já trabalha neste hospital."}), 404
            
        conn.commit()

        return jsonify({"status": "sucesso", "mensagem": "Convite rejeitado e removido."}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({'erro': f'Erro ao rejeitar o convite: {str(e)}'}), 500
    finally:
        cursor.close()
        conn.close()

# ==============================================================================
# ROTAS DE LEITURA (LISTAGEM DE VÍNCULOS)
# ==============================================================================

@app.route('/api/hospitais/vinculos', methods=['GET'])
@jwt_required()
def listar_medicos_do_hospital():
    cracha = get_jwt()
    hospital_id = get_jwt_identity()

    if cracha.get('tipo') != 'hospital':
        return jsonify({"erro": "Acesso negado."}), 403

    conn = obter_conexao()
    if not conn:
        return jsonify({"erro": "Falha na conexão."}), 500

    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT m.id, m.nome_completo, m.crm, m.email, v.status, v.data_vinculo
            FROM vinculos_hospital_medico v
            JOIN medicos m ON v.medico_id = m.id
            WHERE v.hospital_id = %s
            ORDER BY v.status DESC, m.nome_completo ASC;
        """, (hospital_id,))
        
        resultado = cursor.fetchall()
        
        lista_equipe = []
        for linha in resultado:
            lista_equipe.append({
                "medico_id": linha[0],
                "nome": linha[1],
                "crm": linha[2],
                "email": linha[3],
                "status": linha[4],
                "desde": linha[5]
            })

        return jsonify(lista_equipe), 200

    except Exception as e:
        return jsonify({'erro': f'Erro ao listar equipe: {str(e)}'}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/medicos/vinculos', methods=['GET'])
@jwt_required()
def listar_hospitais_do_medico():
    cracha = get_jwt()
    medico_id = get_jwt_identity()

    if cracha.get('tipo') != 'medico':
        return jsonify({"erro": "Acesso negado."}), 403

    conn = obter_conexao()
    if not conn:
        return jsonify({"erro": "Falha na conexão."}), 500

    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT h.id, h.nome_fantasia, h.cnpj, v.status, v.data_vinculo
            FROM vinculos_hospital_medico v
            JOIN hospitais h ON v.hospital_id = h.id
            WHERE v.medico_id = %s
            ORDER BY v.status DESC;
        """, (medico_id,))
        
        resultado = cursor.fetchall()
        
        lista_hospitais = []
        for linha in resultado:
            lista_hospitais.append({
                "hospital_id": linha[0],
                "nome_hospital": linha[1],
                "cnpj": linha[2],
                "status": linha[3], 
                "data": linha[4] 
            })

        return jsonify(lista_hospitais), 200

    except Exception as e:
        return jsonify({'erro': f'Erro ao listar hospitais: {str(e)}'}), 500
    finally:
        cursor.close()
        conn.close()

# ==============================================================================
# MOTOR DE INTELIGÊNCIA (PREDIÇÃO + AUTO-CADASTRO)
# ==============================================================================

@app.route('/api/predicoes/analisar', methods=['POST'])
@jwt_required()
def realizar_predicao():
    cracha = get_jwt()
    medico_id = get_jwt_identity()

    if cracha.get('tipo') != 'medico':
        return jsonify({"erro": "Apenas médicos podem realizar diagnósticos."}), 403

    dados = request.json
    
    paciente_id = dados.get('paciente_id') 
    hospital_id = dados.get('hospital_id')
    nome_paciente_input = dados.get('nome_paciente')
    data_nascimento = dados.get('data_nascimento')
    dados_clinicos = dados.get('dados_clinicos')
    observacao = dados.get('observacao', '') # GAP PREENCHIDO

    if not all([hospital_id, nome_paciente_input, dados_clinicos]):
        return jsonify({"erro": "Dados incompletos! Hospital, nome e dados clínicos são obrigatórios."}), 400

    conn = obter_conexao()
    if not conn:
        return jsonify({"erro": "Erro de conexão."}), 500

    try:
        cursor = conn.cursor()

        # PASSO 1: DEFINIÇÃO DO PACIENTE (VALIDAR ID ou CRIAR NOVO)
        id_final_paciente = None
        msg_paciente = ""

        if paciente_id:
            cursor.execute("""
                SELECT nome_completo, data_nascimento FROM pacientes 
                WHERE id = %s AND hospital_id = %s;
            """, (paciente_id, hospital_id))
            
            paciente_banco = cursor.fetchone()

            if not paciente_banco:
                return jsonify({"erro": f"Paciente com ID {paciente_id} não encontrado neste hospital."}), 404
            
            nome_banco = paciente_banco[0]
            
            if nome_paciente_input.strip().lower() != nome_banco.strip().lower():
                return jsonify({
                    "erro": "Conflito de Identidade!",
                    "detalhes": f"O ID {paciente_id} pertence a '{nome_banco}', mas você enviou o nome '{nome_paciente_input}'."
                }), 409 

            id_final_paciente = paciente_id
            msg_paciente = "Paciente identificado e validado pelo ID."

        else:
            if not data_nascimento:
                 return jsonify({"erro": "Para novos pacientes, a data de nascimento é obrigatória!"}), 400

            cursor.execute("""
                INSERT INTO pacientes (hospital_id, nome_completo, data_nascimento)
                VALUES (%s, %s, %s)
                RETURNING id;
            """, (hospital_id, nome_paciente_input, data_nascimento))
            
            id_final_paciente = cursor.fetchone()[0]
            msg_paciente = "Novo perfil de paciente criado com sucesso."


        # PASSO 2: SIMULAÇÃO DA IA
        fumante = dados_clinicos.get('fumante', False)
        idade = dados_clinicos.get('idade', 0)
        
        probabilidade = 0.0
        if fumante: probabilidade += 40.0
        if idade > 60: probabilidade += 30.0
        
        probabilidade += random.uniform(0, 20)
        probabilidade = min(probabilidade, 99.9)

        diagnostico = "Alto Risco" if probabilidade > 50 else "Baixo Risco"

        # PASSO 3: SALVAR A PREDIÇÃO (COM OBSERVAÇÃO)
        dados_clinicos_json = json.dumps(dados_clinicos)

        cursor.execute("""
            INSERT INTO predicao 
            (paciente_id, medico_id, hospital_id, dados_clinicos, probabilidade_risco, diagnostico_final, observacao)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id;
        """, (id_final_paciente, medico_id, hospital_id, dados_clinicos_json, probabilidade, diagnostico, observacao))
        
        predicao_id = cursor.fetchone()[0]
        conn.commit()

        return jsonify({
            "status": "sucesso",
            "mensagem_sistema": f"Análise concluída. {msg_paciente}",
            "resultado": {
                "predicao_id": predicao_id,
                "paciente_id": id_final_paciente,
                "paciente_nome": nome_paciente_input,
                "diagnostico": diagnostico,
                "probabilidade": round(probabilidade, 2)
            }
        }), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'erro': f'Erro no processamento: {str(e)}'}), 500
    finally:
        cursor.close()
        conn.close()

# ==============================================================================
# ROTAS DE LEITURA (PACIENTES, HISTÓRICO E DETALHES)
# ==============================================================================

# Rota A: Listar pacientes (COM SEGURANÇA LGPD PARA O ADMIN)
@app.route('/api/pacientes/hospital/<int:hospital_id>', methods=['GET'])
@jwt_required()
def listar_pacientes_hospital(hospital_id):
    cracha = get_jwt()
    usuario_id = get_jwt_identity()
    tipo_usuario = cracha.get('tipo')

    conn = obter_conexao()
    if not conn: return jsonify({"erro": "Erro de conexão"}), 500

    try:
        cursor = conn.cursor()

        # --- CAMADA DE SEGURANÇA E PERMISSÃO ---
        
        # 1. HOSPITAL: Só vê o seu próprio
        if tipo_usuario == 'hospital':
            if int(usuario_id) != hospital_id:
                return jsonify({"erro": "Alerta de Segurança: Você não pode acessar outro hospital!"}), 403

        # 2. MÉDICO: Só vê se tiver vínculo
        elif tipo_usuario == 'medico':
            cursor.execute("""
                SELECT 1 FROM vinculos_hospital_medico 
                WHERE medico_id = %s AND hospital_id = %s AND status = 'Ativo';
            """, (usuario_id, hospital_id))
            if not cursor.fetchone():
                return jsonify({"erro": "Acesso negado! Você não trabalha neste hospital."}), 403
        
        # 3. ADMIN: Pode entrar, mas a gente vai "vendar" os olhos dele na hora de entregar os dados
        elif tipo_usuario == 'admin':
            pass # O Admin passa direto aqui, mas é filtrado lá embaixo
        
        else:
            return jsonify({"erro": "Tipo de usuário não autorizado."}), 403

        # --- BUSCA DOS DADOS ---
        
        cursor.execute("""
            SELECT id, nome_completo, data_nascimento 
            FROM pacientes 
            WHERE hospital_id = %s
            ORDER BY id DESC; 
        """, (hospital_id,))
        
        pacientes = cursor.fetchall()
        
        lista = []
        for p in pacientes:
            # LÓGICA DE ANONIMIZAÇÃO
            nome_final = p[1]
            nascimento_final = str(p[2])

            if tipo_usuario == 'admin':
                nome_final = "ANÔNIMO (LGPD)"
                nascimento_final = "**/**/****"

            lista.append({
                "id": p[0],
                "nome": nome_final,
                "data_nascimento": nascimento_final
            })
            
        return jsonify(lista), 200

    except Exception as e:
        return jsonify({'erro': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/pacientes/<int:paciente_id>/historico', methods=['GET'])
@jwt_required()
def historico_paciente(paciente_id):
    cracha = get_jwt()
    medico_id = get_jwt_identity()

    if cracha.get('tipo') != 'medico':
         return jsonify({"erro": "Apenas médicos podem acessar históricos."}), 403
    
    conn = obter_conexao()
    if not conn: return jsonify({"erro": "Erro de conexão"}), 500

    try:
        cursor = conn.cursor()

        cursor.execute("""
            SELECT 
                pr.id, pr.data_predicao, pr.diagnostico_final, pr.probabilidade_risco
            FROM predicao pr
            JOIN pacientes p ON pr.paciente_id = p.id
            JOIN vinculos_hospital_medico v ON p.hospital_id = v.hospital_id
            WHERE 
                pr.paciente_id = %s 
                AND v.medico_id = %s 
                AND v.status = 'Ativo'
            ORDER BY pr.data_predicao DESC;
        """, (paciente_id, medico_id))
        
        historico = cursor.fetchall()
        
        lista_historico = []
        for h in historico:
            lista_historico.append({
                "predicao_id": h[0],
                "data": str(h[1]),
                "diagnostico": h[2],
                "risco": float(h[3])
            })
            
        return jsonify(lista_historico), 200

    except Exception as e:
        return jsonify({'erro': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# NOVA ROTA: Ver Detalhes de UMA Predição (Para "Saiba Mais" e PDF)
@app.route('/api/predicoes/<int:predicao_id>/detalhes', methods=['GET'])
@jwt_required()
def detalhes_predicao(predicao_id):
    cracha = get_jwt()
    tipo_usuario = cracha.get('tipo')
    
    conn = obter_conexao()
    if not conn: return jsonify({"erro": "Erro de conexão"}), 500

    try:
        cursor = conn.cursor()

        cursor.execute("""
            SELECT 
                pr.id, pr.data_predicao, pr.diagnostico_final, pr.probabilidade_risco, 
                pr.observacao, pr.dados_clinicos,
                p.nome_completo, p.data_nascimento, p.id as paciente_id,
                m.nome_completo as nome_medico, m.crm,
                h.nome_fantasia as nome_hospital
            FROM predicao pr
            JOIN pacientes p ON pr.paciente_id = p.id
            JOIN medicos m ON pr.medico_id = m.id
            JOIN hospitais h ON pr.hospital_id = h.id
            WHERE pr.id = %s
        """, (predicao_id,))
        
        row = cursor.fetchone()
        if not row: return jsonify({"erro": "Predição não encontrada."}), 404

        detalhes = {
            "predicao_id": row[0],
            "data": str(row[1]),
            "diagnostico": row[2],
            "risco": float(row[3]),
            "observacao": row[4],
            "dados_clinicos": row[5],
            "paciente": {
                "id": row[8],
                "nome": row[6],
                "nascimento": str(row[7])
            },
            "medico": {
                "nome": row[9],
                "crm": row[10]
            },
            "hospital": {
                "nome": row[11]
            }
        }

        # --- REGRA DE OURO: ANONIMIZAÇÃO DO ADMIN (LGPD) ---
        if tipo_usuario == 'admin':
            detalhes['paciente']['nome'] = "ANÔNIMO (LGPD)"
            detalhes['paciente']['nascimento'] = "**/**/****"
        
        return jsonify(detalhes), 200

    except Exception as e:
        return jsonify({'erro': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# ==============================================================================
# DASHBOARDS E KPIs (DADOS PARA AS TELAS INICIAIS)
# ==============================================================================

@app.route('/api/dashboard/resumo', methods=['GET'])
@jwt_required()
def dashboard_resumo():
    cracha = get_jwt()
    usuario_id = get_jwt_identity()
    tipo = cracha.get('tipo')

    conn = obter_conexao()
    if not conn: return jsonify({"erro": "Erro de conexão"}), 500
    cursor = conn.cursor()

    try:
        dados = {}

        if tipo == 'admin':
            cursor.execute("SELECT COUNT(*) FROM hospitais WHERE status = 'Ativo'")
            dados['total_hospitais'] = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM medicos")
            dados['total_medicos'] = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM pacientes")
            dados['total_pacientes'] = cursor.fetchone()[0]
            
            cursor.execute("""
                SELECT COUNT(*) FROM predicao 
                WHERE date_part('month', data_predicao) = date_part('month', CURRENT_DATE)
                AND date_part('year', data_predicao) = date_part('year', CURRENT_DATE);
            """)
            dados['avaliacoes_mes'] = cursor.fetchone()[0]

        elif tipo == 'hospital':
            cursor.execute("SELECT COUNT(*) FROM vinculos_hospital_medico WHERE hospital_id = %s AND status = 'Ativo'", (usuario_id,))
            dados['medicos_ativos'] = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM pacientes WHERE hospital_id = %s", (usuario_id,))
            dados['total_pacientes'] = cursor.fetchone()[0]
            
            cursor.execute("""
                SELECT 
                    COUNT(*) FILTER (WHERE date_part('month', data_predicao) = date_part('month', CURRENT_DATE)),
                    COUNT(*) FILTER (WHERE diagnostico_final = 'Alto Risco')
                FROM predicao WHERE hospital_id = %s
            """, (usuario_id,))
            res = cursor.fetchone()
            dados['avaliacoes_mes'] = res[0]
            dados['pacientes_alto_risco'] = res[1]

        elif tipo == 'medico':
            cursor.execute("SELECT COUNT(*) FROM vinculos_hospital_medico WHERE medico_id = %s AND status = 'Ativo'", (usuario_id,))
            dados['meus_hospitais'] = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(DISTINCT paciente_id) FROM predicao WHERE medico_id = %s", (usuario_id,))
            dados['meus_pacientes'] = cursor.fetchone()[0]
            
            cursor.execute("""
                SELECT COUNT(*) FROM predicao 
                WHERE medico_id = %s 
                AND date_part('month', data_predicao) = date_part('month', CURRENT_DATE)
            """, (usuario_id,))
            dados['minhas_avaliacoes_mes'] = cursor.fetchone()[0]

        return jsonify(dados), 200

    except Exception as e:
        return jsonify({'erro': str(e)}), 500
    finally:
        cursor.close()
        conn.close()


if __name__ == '__main__':
    app.run(debug=True, port=5000)