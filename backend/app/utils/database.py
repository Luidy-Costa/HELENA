import os
import psycopg2

def obter_conexao():
    """
    Estabelece conexão com o banco de dados HELENA_DB.
    Utiliza variáveis de ambiente para flexibilidade entre ambientes de desenvolvimento e produção.
    """
    try:
        conn = psycopg2.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            database=os.getenv('DB_NAME', 'HELENA_DB'),
            user=os.getenv('DB_USER', 'admin'),        
            password=os.getenv('DB_PASSWORD', 'adminpassword') 
        )
        return conn
    except Exception as e:
        print(f"[ERRO CRÍTICO] Falha na conexão com o banco HELENA_DB: {e}")
        return None