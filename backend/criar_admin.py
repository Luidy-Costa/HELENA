from werkzeug.security import generate_password_hash
from app.utils.database import obter_conexao

def criar_admin_backdoor():
    # Dados de acesso provisórios
    nome = "Administrador Master"
    email = "nwmq2019@gmail.com"
    senha = "123" 
    
    # Gera a hash idêntica à que o Flask espera (scrypt)
    senha_criptografada = generate_password_hash(senha)

    conn = obter_conexao()
    cursor = conn.cursor()
    
    try:
        # CORREÇÃO AQUI: Usando nome_completo e senha_hash conforme o seu schema
        cursor.execute("""
            INSERT INTO admins (nome_completo, email, senha_hash) 
            VALUES (%s, %s, %s)
        """, (nome, email, senha_criptografada))
        
        conn.commit()
        print("\n✅ Conta de Administrador injetada com sucesso!")
        print(f"📧 E-mail: {email}")
        print(f"🔑 Senha: {senha}")
        print("Agora você já pode fazer login na tela do frontend.\n")
        
    except Exception as e:
        conn.rollback()
        print("\n❌ Erro ao inserir no banco de dados:", e)
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    criar_admin_backdoor()