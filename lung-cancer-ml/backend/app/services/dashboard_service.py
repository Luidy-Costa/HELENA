from app.utils.database import obter_conexao

class DashboardService:
    # --- DASHBOARD MÉDICO ---
    def obter_estatisticas_medico(self, medico_id):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            # 1. Total de Predições
            cursor.execute("SELECT COUNT(*) FROM predicao WHERE medico_id = %s;", (medico_id,))
            total_predicoes = cursor.fetchone()[0]

            # 2. Casos de Alto Risco
            cursor.execute("""
                SELECT COUNT(*) FROM predicao 
                WHERE medico_id = %s AND diagnostico_final = 'Alto Risco';
            """, (medico_id,))
            alto_risco = cursor.fetchone()[0]

            # 3. Pacientes Únicos
            cursor.execute("""
                SELECT COUNT(DISTINCT paciente_id) FROM predicao 
                WHERE medico_id = %s;
            """, (medico_id,))
            pacientes_unicos = cursor.fetchone()[0]

            # 4. Taxa de Risco
            taxa = 0
            if total_predicoes > 0:
                taxa = round((alto_risco / total_predicoes) * 100, 1)

            return {
                "total_predicoes": total_predicoes,
                "pacientes_atendidos": pacientes_unicos,
                "casos_graves": alto_risco,
                "taxa_risco": f"{taxa}%"
            }
        finally:
            cursor.close()
            conn.close()

    def obter_hospitais_do_medico(self, medico_id):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            # CORREÇÃO: Usando o nome exato da tabela 'vinculos_hospital_medico'
            query = """
                SELECT 
                    h.id, 
                    h.nome_fantasia,
                    (SELECT COUNT(*) FROM vinculos_hospital_medico v2 WHERE v2.hospital_id = h.id AND v2.status = 'Ativo') as total_medicos,
                    (SELECT COUNT(*) FROM pacientes p WHERE p.hospital_id = h.id) as total_pacientes,
                    v.status
                FROM hospitais h
                JOIN vinculos_hospital_medico v ON h.id = v.hospital_id
                WHERE v.medico_id = %s AND v.status = 'Ativo';
            """
            cursor.execute(query, (medico_id,))
            resultados = cursor.fetchall()
            
            lista = []
            for r in resultados:
                lista.append({
                    "id": r[0],
                    "nome": r[1],
                    "medicos": r[2],
                    "pacientes": r[3],
                    "status": r[4]
                })
            return lista
        finally:
            cursor.close()
            conn.close()

    # --- DASHBOARD HOSPITAL ---
    def obter_estatisticas_hospital(self, hospital_id):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            # Médicos Ativos (Vínculos)
            cursor.execute("SELECT COUNT(*) FROM vinculos_hospital_medico WHERE hospital_id = %s;", (hospital_id,))
            medicos_ativos = cursor.fetchone()[0]

            # Total Pacientes
            cursor.execute("SELECT COUNT(*) FROM pacientes WHERE hospital_id = %s;", (hospital_id,))
            total_pacientes = cursor.fetchone()[0]

            # Avaliações do Mês (Simplificado: Total Geral por enquanto)
            cursor.execute("SELECT COUNT(*) FROM predicao WHERE hospital_id = %s;", (hospital_id,))
            total_avaliacoes = cursor.fetchone()[0]

            # Alto Risco
            cursor.execute("""
                SELECT COUNT(*) FROM predicao 
                WHERE hospital_id = %s AND diagnostico_final = 'Alto Risco';
            """, (hospital_id,))
            alto_risco = cursor.fetchone()[0]

            return {
                "medicos_ativos": medicos_ativos,
                "total_pacientes": total_pacientes,
                "avaliacoes_mes": total_avaliacoes,
                "pacientes_risco": alto_risco
            }
        finally:
            cursor.close()
            conn.close()

    # --- DASHBOARD ADMIN (GLOBAL) ---
    def obter_estatisticas_admin(self):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            # Conta tudo do sistema inteiro
            cursor.execute("SELECT COUNT(*) FROM hospitais;")
            total_hospitais = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM medicos;")
            total_medicos = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM pacientes;")
            total_pacientes = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM predicao;")
            total_predicoes = cursor.fetchone()[0]

            return {
                "total_hospitais": total_hospitais,
                "total_medicos": total_medicos,
                "total_pacientes_geral": total_pacientes,
                "total_predicoes_geral": total_predicoes
            }
        finally:
            cursor.close()
            conn.close()

    def obter_estatisticas_hospital_simples(self, hospital_id):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            # 1. Conta o total de pacientes vinculados a este hospital
            cursor.execute("SELECT COUNT(*) FROM pacientes WHERE hospital_id = %s;", (hospital_id,))
            total_pacientes = cursor.fetchone()[0]

            # 2. Conta o total de avaliações feitas neste hospital
            cursor.execute("SELECT COUNT(*) FROM predicao WHERE hospital_id = %s;", (hospital_id,))
            avaliacoes_mes = cursor.fetchone()[0]

            # 3. Conta quantas deram 'Alto Risco' neste hospital
            cursor.execute("SELECT COUNT(*) FROM predicao WHERE hospital_id = %s AND diagnostico_final = 'Alto Risco';", (hospital_id,))
            alto_risco = cursor.fetchone()[0]
            
            # 4. Médicos Ativos (Opcional, pois o React já conta, mas enviamos por garantia)
            cursor.execute("SELECT COUNT(*) FROM vinculos_hospital_medico WHERE hospital_id = %s AND status = 'Ativo';", (hospital_id,))
            medicos_ativos = cursor.fetchone()[0]

            # Envia o pacote JSON com os nomes EXATOS que o React do Hospital espera
            return {
                "medicos_ativos": medicos_ativos,
                "total_pacientes": total_pacientes,
                "avaliacoes_mes": avaliacoes_mes,
                "alto_risco": alto_risco
            }
        finally:
            cursor.close()
            conn.close()