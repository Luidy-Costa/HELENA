from app.utils.database import obter_conexao

class PacienteModel:
    def criar(self, dados):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            cursor.execute("""
                INSERT INTO pacientes (hospital_id, nome_completo, data_nascimento)
                VALUES (%s, %s, %s) RETURNING id;
            """, (dados['hospital_id'], dados['nome'], dados['data_nascimento']))
            novo_id = cursor.fetchone()[0]
            conn.commit()
            return novo_id
        finally:
            cursor.close()
            conn.close()

    def listar_por_hospital(self, hospital_id):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            cursor.execute("""
                SELECT id, nome_completo, data_nascimento, data_cadastro 
                FROM pacientes WHERE hospital_id = %s ORDER BY nome_completo;
            """, (hospital_id,))
            return cursor.fetchall()
        finally:
            cursor.close()
            conn.close()

    def buscar_por_id(self, id):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT * FROM pacientes WHERE id = %s;", (id,))
            return cursor.fetchone()
        finally:
            cursor.close()
            conn.close()

    def buscar_por_dados(self, nome, data_nascimento, hospital_id):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            query = """
                SELECT id FROM pacientes 
                WHERE nome_completo = %s 
                AND data_nascimento = %s 
                AND hospital_id = %s;
            """
            cursor.execute(query, (nome, data_nascimento, hospital_id))
            return cursor.fetchone() 
        finally:
            cursor.close()
            conn.close()

    # [NOVO] Função de Atualizar
    def atualizar(self, paciente_id, nome, data_nascimento):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            cursor.execute("""
                UPDATE pacientes 
                SET nome_completo = %s, data_nascimento = %s 
                WHERE id = %s;
            """, (nome, data_nascimento, paciente_id))
            conn.commit()
            return cursor.rowcount > 0
        finally:
            cursor.close()
            conn.close()