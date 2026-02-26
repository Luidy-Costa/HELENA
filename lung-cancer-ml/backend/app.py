from flask import Flask, jsonify

# Inicializa o servidor Flask
app = Flask(__name__)

# Rota de teste (O "Batimento Cardíaco" do sistema)
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "sucesso",
        "mensagem": "Servidor do LungCancerPrediction rodando 100%!"
    }), 200

# Trava de segurança para rodar o servidor
if __name__ == '__main__':
    # O debug=True faz o servidor reiniciar sozinho sempre que você salvar o código!
    app.run(debug=True, port=5000)