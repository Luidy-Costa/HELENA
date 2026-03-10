from app.utils.database import obter_conexao
import json

class PredicaoModel:
    def criar(self, paciente_id, medico_id, hospital_id, dados_clinicos, risco, resultado):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            # Converte o dicionário de sintomas para JSON string para o banco
            dados_json = json.dumps(dados_clinicos)

            query = """
                INSERT INTO predicao
                (paciente_id, medico_id, hospital_id, dados_clinicos, probabilidade_risco, diagnostico_final)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id;
            """
            cursor.execute(query, (
                paciente_id, 
                medico_id, 
                hospital_id, 
                dados_json, 
                risco, 
                resultado
            ))
            
            novo_id = cursor.fetchone()[0]
            conn.commit()
            return novo_id
        finally:
            cursor.close()
            conn.close()

    def buscar_por_id_completo(self, predicao_id):
        """
        Busca os dados da predição fazendo JOIN com Paciente e Médico
        para sair os nomes bonitinhos no PDF.
        """
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            query = """
                SELECT 
                    pr.id,
                    pac.nome_completo as paciente,
                    pac.data_nascimento,
                    med.nome_completo as medico,
                    med.crm,
                    hosp.nome_fantasia as hospital,
                    pr.probabilidade_risco,
                    pr.diagnostico_final,
                    pr.data_predicao,
                    pr.dados_clinicos
                FROM predicao pr
                JOIN pacientes pac ON pr.paciente_id = pac.id
                JOIN medicos med ON pr.medico_id = med.id
                JOIN hospitais hosp ON pr.hospital_id = hosp.id
                WHERE pr.id = %s;
            """
            cursor.execute(query, (predicao_id,))
            res = cursor.fetchone()
            
            if not res:
                return None
            
            # Retorna um dicionário fácil de usar
            return {
                "id": res[0],
                "paciente_nome": res[1],
                "paciente_nasc": str(res[2]),
                "medico_nome": res[3],
                "medico_crm": res[4],
                "hospital_nome": res[5],
                "probabilidade": float(res[6]) if res[6] is not None else 0.0, # <-- A MÁGICA AQUI (Força float)
                "resultado": res[7],
                "data": str(res[8]),
                "sintomas": res[9]
            }
        finally:
            cursor.close()
            conn.close()

    def listar_historico_medico(self, medico_id):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            # Busca todas as predições do médico, trazendo o nome do paciente e do hospital
            query = """
                SELECT pr.id, p.nome, p.id AS paciente_id, h.nome_fantasia, 
                       pr.data, pr.probabilidade, pr.resultado
                FROM predicao pr
                JOIN pacientes p ON pr.paciente_id = p.id
                JOIN hospitais h ON pr.hospital_id = h.id
                WHERE pr.medico_id = %s
                ORDER BY pr.data DESC;
            """
            cursor.execute(query, (medico_id,))
            resultados = cursor.fetchall()
            
            historico = []
            for r in resultados:
                historico.append({
                    "id_predicao": r[0],
                    "paciente_nome": r[1],
                    "paciente_id": r[2],
                    "hospital_nome": r[3],
                    "data": str(r[4]),
                    "probabilidade": float(r[5]) if r[5] is not None else 0.0,
                    "resultado": r[6]
                })
            return historico
        finally:
            cursor.close()
            conn.close()

    def listar_por_paciente(self, paciente_id):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            # CORREÇÃO: Usando os nomes exatos das tabelas e colunas do schema.sql
            query = """
                SELECT pr.id, m.nome_completo as medico_nome, pr.data_predicao, h.nome_fantasia as hospital_nome,
                       pr.probabilidade_risco, pr.diagnostico_final
                FROM predicao pr
                JOIN medicos m ON pr.medico_id = m.id
                JOIN hospitais h ON pr.hospital_id = h.id
                WHERE pr.paciente_id = %s
                ORDER BY pr.data_predicao DESC;
            """
            cursor.execute(query, (paciente_id,))
            resultados = cursor.fetchall()
            
            lista = []
            for r in resultados:
                lista.append({
                    "id": r[0],
                    "medico": r[1],
                    "data": str(r[2]),
                    "hospital": r[3],
                    "porcentagem": f"{float(r[4])}%" if r[4] is not None else "0%",
                    "risco": r[5]
                })
            return lista
        finally:
            cursor.close()
            conn.close()