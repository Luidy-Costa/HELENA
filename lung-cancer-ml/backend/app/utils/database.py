import os
import psycopg2

def obter_conexao():
    """
    Conecta no banco 'Lung_Cancer_Prediction_DB'.
    """
    try:
        conn = psycopg2.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            database='Lung_Cancer_Prediction_DB', # <--- SEU BANCO NOVO AQUI
            user=os.getenv('DB_USER', 'postgres'),
            password=os.getenv('DB_PASSWORD', '123456') # <--- SUA SENHA DO POSTGRES
        )
        return conn
    except Exception as e:
        print(f"Erro CRÍTICO ao conectar ao banco: {e}")
        return None