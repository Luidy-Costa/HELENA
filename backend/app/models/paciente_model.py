from app.utils.database import obter_conexao

class PacienteModel:
    def criar(self, dados):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            # Já nasce com ativo = TRUE (Soft Delete)
            cursor.execute("""
                INSERT INTO pacientes (hospital_id, nome_completo, data_nascimento, ativo)
                VALUES (%s, %s, %s, TRUE) RETURNING id;
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
            # Lista APENAS os pacientes ativos
            cursor.execute("""
                SELECT id, nome_completo, data_nascimento, data_cadastro 
                FROM pacientes 
                WHERE hospital_id = %s AND ativo = TRUE
                ORDER BY nome_completo;
            """, (hospital_id,))
            return cursor.fetchall()
        finally:
            cursor.close()
            conn.close()

    def buscar_por_id(self, id):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT * FROM pacientes WHERE id = %s AND ativo = TRUE;", (id,))
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
                AND hospital_id = %s 
                AND ativo = TRUE;
            """
            cursor.execute(query, (nome, data_nascimento, hospital_id))
            return cursor.fetchone() 
        finally:
            cursor.close()
            conn.close()

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

    # --- REGRAS DE INTEGRIDADE (LGPD e CFM) ---

    def inativar(self, paciente_id):
        """RI-2: Soft Delete (Inativa o paciente sem apagar o histórico de laudos)"""
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            cursor.execute("UPDATE pacientes SET ativo = FALSE WHERE id = %s;", (paciente_id,))
            conn.commit()
            return cursor.rowcount > 0
        finally:
            cursor.close()
            conn.close()

    def excluir_fisicamente(self, paciente_id):
        """RI-3: Hard Delete Excepcional (Apenas se criado por engano)"""
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            cursor.execute("DELETE FROM pacientes WHERE id = %s;", (paciente_id,))
            conn.commit()
            return cursor.rowcount > 0
        finally:
            cursor.close()
            conn.close()