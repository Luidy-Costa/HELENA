from app.utils.database import obter_conexao

def listar_admins():
    conn = obter_conexao()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, nome_completo, email, senha_hash FROM admins")
        admins = cursor.fetchall()
        
        print(f"\n=== ENCONTRADOS {len(admins)} ADMINISTRADORES NO BANCO ===")
        for a in admins:
            print(f"ID: {a[0]} | Nome: {a[1]} | E-mail: {a[2]}")
            print(f"Hash salva: {a[3][:30]}...\n")
            
    except Exception as e:
        print("\n❌ Erro ao consultar banco:", e)
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    listar_admins()