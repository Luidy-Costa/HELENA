from flask import Flask, jsonify, request
from werkzeug.security import generate_password_hash
import os, sys

#ensinando ao python o caminho paraa pasta models, onde esta a conexão com o banco
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__),"models")))
from conexao import obter_conexao

#iniciando o servidor flask
app = Flask(__name__)

#criando a rota de aferição do servidor
@app.route('/api/health', methods=['GET'])
def health_check():
     return jsonify({
          'status':"sucesso",
          "mensagem":"O servidor do Lung Cancer Prediction esta rodando com sucesso"
     }),200

#rota de cadastro do hospital
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

if __name__ == '__main__':
    app.run(debug=True, port=5000)