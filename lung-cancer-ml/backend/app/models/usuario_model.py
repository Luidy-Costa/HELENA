from app.utils.database import obter_conexao

class UsuarioModel:
    # ==========================
    # HOSPITAL
    # ==========================
    def criar_hospital(self, nome, cnpj, email, senha_hash):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            cursor.execute("""
                INSERT INTO hospitais (nome_fantasia, cnpj, email, senha_hash)
                VALUES (%s, %s, %s, %s) RETURNING id;
            """, (nome, cnpj, email, senha_hash))
            id_novo = cursor.fetchone()[0]
            conn.commit()
            return id_novo
        finally:
            cursor.close()
            conn.close()

    def buscar_hospital_por_cnpj(self, cnpj):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT id, nome_fantasia, senha_hash, email FROM hospitais WHERE cnpj = %s;", (cnpj,))
            return cursor.fetchone()
        finally:
            cursor.close()
            conn.close()

    # [NOVO]
    def buscar_hospital_por_id(self, id):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            # Retorna: id, nome, cnpj, email, foto, ativo
            cursor.execute("""
                SELECT id, nome_fantasia, cnpj, email, foto_perfil, ativo 
                FROM hospitais WHERE id = %s;
            """, (id,))
            return cursor.fetchone()
        finally:
            cursor.close()
            conn.close()

    # [NOVO]
    def listar_todos_hospitais(self):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            cursor.execute("""
                SELECT id, nome_fantasia, cnpj, email, ativo, data_cadastro 
                FROM hospitais ORDER BY data_cadastro DESC;
            """)
            return cursor.fetchall()
        finally:
            cursor.close()
            conn.close()

    def atualizar_hospital(self, hospital_id, nome, email, foto, cnpj):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            cursor.execute("""
                UPDATE hospitais SET nome_fantasia = %s, email = %s, foto_perfil = %s, cnpj = %s
                WHERE id = %s;
            """, (nome, email, foto, cnpj, hospital_id))
            conn.commit()
            return cursor.rowcount > 0
        finally:
            cursor.close()
            conn.close()

    # ==========================
    # MÉDICO
    # ==========================
    def criar_medico(self, nome, crm, email, senha_hash):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            cursor.execute("""
                INSERT INTO medicos (nome_completo, crm, email, senha_hash)
                VALUES (%s, %s, %s, %s) RETURNING id;
            """, (nome, crm, email, senha_hash))
            id_novo = cursor.fetchone()[0]
            conn.commit()
            return id_novo
        finally:
            cursor.close()
            conn.close()

    def buscar_medico_por_crm(self, crm):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT id, nome_completo, senha_hash, email FROM medicos WHERE crm = %s;", (crm,))
            return cursor.fetchone()
        finally:
            cursor.close()
            conn.close()
    
    def buscar_medico_por_email(self, email):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            cursor.execute("""
                SELECT id, nome_completo, crm, email 
                FROM medicos 
                WHERE email = %s;
            """, (email,))
            return cursor.fetchone()
        finally:
            cursor.close()
            conn.close()

   
    def buscar_medico_por_id(self, id):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
           
            cursor.execute("""
                SELECT id, nome_completo, crm, email, foto_perfil, ativo 
                FROM medicos WHERE id = %s;
            """, (id,))
            return cursor.fetchone()
        finally:
            cursor.close()
            conn.close()
 
    def listar_medicos_por_hospital(self, hospital_id):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            query = """
                SELECT m.id, m.nome_completo, m.crm, m.email, m.ativo
                FROM medicos m
                JOIN vinculos_hospital_medico v ON m.id = v.medico_id
                WHERE v.hospital_id = %s;
            """
            cursor.execute(query, (hospital_id,))
            return cursor.fetchall()
        finally:
            cursor.close()
            conn.close()

    def atualizar_medico(self, medico_id, nome, email, foto, crm):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            cursor.execute("""
                UPDATE medicos SET nome_completo = %s, email = %s, foto_perfil = %s, crm = %s
                WHERE id = %s;
            """, (nome, email, foto, crm, medico_id))
            conn.commit()
            return cursor.rowcount > 0
        finally:
            cursor.close()
            conn.close()

    # ==========================
    # ADMIN
    # ==========================
    def criar_admin(self, nome, email, senha_hash):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            cursor.execute("""
                INSERT INTO admins (nome_completo, email, senha_hash)
                VALUES (%s, %s, %s) RETURNING id;
            """, (nome, email, senha_hash))
            id_novo = cursor.fetchone()[0]
            conn.commit()
            return id_novo
        finally:
            cursor.close()
            conn.close()

    def buscar_admin_por_email(self, email):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT id, nome_completo, senha_hash FROM admins WHERE email = %s;", (email,))
            return cursor.fetchone()
        finally:
            cursor.close()
            conn.close()

    # [NOVO]
    def buscar_admin_por_id(self, id):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT id, nome_completo, email, foto_perfil FROM admins WHERE id = %s;", (id,))
            return cursor.fetchone()
        finally:
            cursor.close()
            conn.close()

    def atualizar_admin(self, admin_id, nome, email):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            cursor.execute("""
                UPDATE admins SET nome_completo = %s, email = %s WHERE id = %s;
            """, (nome, email, admin_id))
            conn.commit()
            return cursor.rowcount > 0
        finally:
            cursor.close()
            conn.close()

    # ==========================
    # SEGURANÇA (Vinculos)
    # ==========================
    def verificar_vinculo(self, medico_id, hospital_id):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            cursor.execute("""
                SELECT 1 FROM vinculos_hospital_medico 
                WHERE medico_id = %s AND hospital_id = %s;
            """, (medico_id, hospital_id))
            return cursor.fetchone() is not None
        finally:
            cursor.close()
            conn.close()

    # ==========================
    # GESTÃO DE VÍNCULOS (NOVO)
    # ==========================
    def criar_vinculo_pendente(self, hospital_id, medico_id):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            # Verifica se já existe vínculo (Pendente ou Ativo)
            cursor.execute("""
                SELECT id FROM vinculos_hospital_medico 
                WHERE hospital_id = %s AND medico_id = %s;
            """, (hospital_id, medico_id))
            
            if cursor.fetchone():
                return False # Já existe, não cria de novo

            cursor.execute("""
                INSERT INTO vinculos_hospital_medico (hospital_id, medico_id, status)
                VALUES (%s, %s, 'Pendente');
            """, (hospital_id, medico_id))
            conn.commit()
            return True
        finally:
            cursor.close()
            conn.close()

    def listar_convites_medico(self, medico_id):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            # Traz o nome do hospital e o ID do vínculo
            query = """
                SELECT v.id, h.nome_fantasia, v.data_vinculo, h.email
                FROM vinculos_hospital_medico v
                JOIN hospitais h ON v.hospital_id = h.id
                WHERE v.medico_id = %s AND v.status = 'Pendente';
            """
            cursor.execute(query, (medico_id,))
            return cursor.fetchall()
        finally:
            cursor.close()
            conn.close()

    def responder_convite(self, vinculo_id, novo_status):
        # novo_status deve ser 'Ativo' ou 'Rejeitado'
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            cursor.execute("""
                UPDATE vinculos_hospital_medico 
                SET status = %s 
                WHERE id = %s;
            """, (novo_status, vinculo_id))
            conn.commit()
            return cursor.rowcount > 0
        finally:
            cursor.close()
            conn.close()
            
    def buscar_email_medico(self, medico_id):
        # Utilitário para pegar o email para enviar o convite
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT email FROM medicos WHERE id = %s;", (medico_id,))
            res = cursor.fetchone()
            return res[0] if res else None
        finally:
            cursor.close()
            conn.close()

# ==========================
# RECUPERAÇÃO DE SENHA (NOVO)
# ==========================
    def salvar_codigo_recuperacao(self, email, codigo):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            # 1. Invalida códigos anteriores deste email (opcional, mas bom pra limpeza)
            cursor.execute("UPDATE recuperacao_senha SET utilizado = TRUE WHERE email = %s;", (email,))
            
            # 2. Cria o novo código (Válido por 15 minutos)
            cursor.execute("""
                INSERT INTO recuperacao_senha (email, codigo, data_expiracao)
                VALUES (%s, %s, NOW() + INTERVAL '15 minutes');
            """, (email, codigo))
            conn.commit()
            return True
        finally:
            cursor.close()
            conn.close()

    def validar_codigo_recuperacao(self, email, codigo):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            cursor.execute("""
                SELECT id FROM recuperacao_senha 
                WHERE email = %s 
                AND codigo = %s 
                AND utilizado = FALSE 
                AND data_expiracao > NOW();
            """, (email, codigo))
            return cursor.fetchone() # Retorna algo se for válido
        finally:
            cursor.close()
            conn.close()

    def redefinir_senha_geral(self, email, nova_senha_hash):
        """
        Tenta atualizar a senha nas 3 tabelas de usuários.
        """
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            afetados = 0
            # 1. Tenta Médico
            cursor.execute("UPDATE medicos SET senha_hash = %s WHERE email = %s;", (nova_senha_hash, email))
            afetados += cursor.rowcount
            
            # 2. Tenta Hospital
            cursor.execute("UPDATE hospitais SET senha_hash = %s WHERE email = %s;", (nova_senha_hash, email))
            afetados += cursor.rowcount
            
            # 3. Tenta Admin
            cursor.execute("UPDATE admins SET senha_hash = %s WHERE email = %s;", (nova_senha_hash, email))
            afetados += cursor.rowcount
            
            # 4. Queima o código usado
            cursor.execute("UPDATE recuperacao_senha SET utilizado = TRUE WHERE email = %s;", (email,))
            
            conn.commit()
            return afetados > 0 # Retorna True se mudou a senha de alguém
        finally:
            cursor.close()
            conn.close()