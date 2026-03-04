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