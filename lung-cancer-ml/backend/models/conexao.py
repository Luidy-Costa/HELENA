import psycopg2
from psycopg2 import Error

DB_HOST = "localhost"
DB_NAME = "postgres"  
DB_USER = "postgres" 
DB_PASS = "123456"  
DB_PORT = "5432"

def obter_conexao():
    try:
        conexao = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
            port=DB_PORT
        )
        return conexao
    except Error as e:
        print(f"❌ Erro ao conectar ao PostgreSQL: {e}")
        return None


if __name__ == "__main__":
    print("Iniciando teste de conexão...")
    conn = obter_conexao()
    
    if conn:
        print("✅ Sucesso absoluto, Luidy! O Python entrou no PostgreSQL!")
        conn.close()
        print("Conexão encerrada com segurança.")