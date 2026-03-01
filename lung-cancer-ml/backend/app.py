#importando as bibliotecas 
from flask import Flask, jsonify, request
from werkzeug.security import generate_password_hash,check_password_hash
import os, sys

#ensinando a rota para a pasta models onde tem o arquivo "conexao" com a função que conecta o banco de dados
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__),"models")))
from conexao import obter_conexao

#iniciando o servidor 
app = Flask(__name__)

#uma rota de aferição do servidor, para ver se ele esta realmente ligado
@app.route('/api/health', methods=['GET'])
def health_check():
     return jsonify({
          'status':"sucesso",
          "mensagem":"O servidor do Lung Cancer Prediction esta rodando com sucesso"
     }),200

#Rota de Cadastro das contas dos hospitais
@app.route('/api/hospitais', methods=["POST"])
def cadastrar_hospital():
    #requisitando o json para o front
    dados = request.json

    cnpj = dados.get('cnpj')
    nome_fantasia = dados.get('nome_fantasia')
    email = dados.get('email_recuperacao')
    senha_bruta = dados.get("senha")

    #excessão para caso de alguma informação obrigatoria do cadastro do hospital faltar
    if not nome_fantasia or not cnpj or not email or not senha_bruta:
        #400 (bad request/má requisição) erro do cliente em algum preenchimento 
        return jsonify({"erro": "Todos os campos são obrigatórios!"}), 400
     
    #pegando a senha_bruta e pura do cliente e tranformando em uma senha hash
    #hash é uma forma de tranasformar a senha do usuario em uma sequencia de caracteres que não pode ser desfeita, assim sera salvo no banco como senha hash, fazendo com que em caso de vazamento de dados não poderão fazer nada com a informação vazada, alem de que nem os desenvolvedores e nem qualquer outras pessoa possa saber essa senha alem do proprio cliente
    senha_segura = generate_password_hash(senha_bruta)

    #abrindo a conexao com o banco
    conn = obter_conexao()
    if not conn:
        #500 (InternalServer Erro) erro interno do servidor, O problema é interno do sistema e não no cliente
        return jsonify({"erro": "Falha na conexão com o banco de dados."}), 500
    
    try:
        #Adicionando as informações ao banco
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO hospitais (nome_fantasia, cnpj, email_recuperacao, senha_hash)
            VALUES (%s, %s, %s, %s) 
            RETURNING id;
        """, (nome_fantasia, cnpj, email, senha_segura))
        
        #capturando a resposta da requisição ao banco, neste caso o id
        hospital_id = cursor.fetchone()[0]

        #salvando alterações do banco
        conn.commit()

        #201 (Created) entidade salva com sucesso
        return jsonify({
            "status": "sucesso",
            "mensagem": "Hospital cadastrado com perfeição!",
            "hospital_id": hospital_id
        }), 201

    #em caso de erro em qualquer coisa o except vai agir e vai usar o comando rollback, para desfazer qualquer mudança feita durante essa tentativa
    except Exception as e:
        conn.rollback()
        return jsonify({'erro': f'Erro ao cadastrar no banco: {str(e)}'}), 500

    #quando terminar tudo dando certo ou não ele vai fechar a conexão com o banco
    finally:
        cursor.close()
        conn.close()

# Rota de Login do Hospital
@app.route('/api/login/hospital', methods=["POST"])
def login_hospital():
    dados = request.json

   
    email = dados.get('email')
    senha_pura = dados.get('senha')

    if not email or not senha_pura:
        return jsonify({"erro": "Email e senha são obrigatórios!"}), 400

    conn = obter_conexao()
    if not conn:
        return jsonify({"erro": "Falha na conexão com o banco de dados."}), 500

    try:
        cursor = conn.cursor()
        
       
        cursor.execute("SELECT id, nome_fantasia, senha_hash FROM hospitais WHERE email_recuperacao = %s;", (email,))
        hospital = cursor.fetchone()

        
        if not hospital or not check_password_hash(hospital[2], senha_pura):
            return jsonify({"erro": "Email ou senha incorretos!"}), 401

        
        return jsonify({
            "status": "sucesso",
            "mensagem": f"Bem-vindo(a) ao painel de gestão, {hospital[1]}!",
            "hospital_id": hospital[0]
        }), 200

    except Exception as e:
        return jsonify({'erro': f'Erro no login: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

#rota de cadastro do médico
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

    email = dados.get('email')
    senha_bruta = dados.get('senha')

    #verificando se o medico preencheu todos os campos
    if not email or not senha_bruta:
        return jsonify({"erro": "Email e senha são obrigatórios!"}), 400

    conn = obter_conexao()
    if not conn:
        return jsonify({"erro": "Falha na conexão com o banco de dados."}), 500

    try:
        cursor = conn.cursor()
        
        #indo ao banco e pegando o nome, id e senha hash do medico que tem o email indicado anteriormente
        cursor.execute("SELECT id, nome_completo, senha_hash FROM medicos WHERE email_recuperacao = %s;", (email,))

        #capturando resposta do banco, nesse caso um array com 3 valores
        medico = cursor.fetchone()

        #comparando o hash da senha oferecida com o hash da senha salva
        if not medico or not check_password_hash(medico[2], senha_bruta):
            #401 (nUnauthorized) não autorizado, credenciais erradas
            return jsonify({"erro": "Email ou senha incorretos!"}), 401

        #200 (OK) resposta padrão pra "deu tudo certo"
        return jsonify({
            "status": "sucesso",
            "mensagem": f"Bem-vindo(a) ao sistema, {medico[1]}!",
            "medico_id": medico[0]
        }), 200

    except Exception as e:
        return jsonify({'erro': f'Erro no login: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

#ligando o servidor
#não coloque nada abaixo desse comando, não ira rodar, o sistema vai ate aqui ate que ele seja encerrado
if __name__ == '__main__':
    #para o servidor reiniciar todas vez que for feita uma alteração no codigo e salva
    app.run(debug=True, port=5000)

