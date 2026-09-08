from app import create_app

app = create_app()

if __name__ == '__main__':
    # O uso do host='0.0.0.0' permite que a API seja consumida por outros dispositivos na mesma rede local
    app.run(debug=True, host='0.0.0.0', port=5000)