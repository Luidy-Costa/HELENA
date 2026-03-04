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
                "probabilidade": res[6],
                "resultado": res[7],
                "data": str(res[8]),
                "sintomas": res[9] # Isso é um JSON
            }
        finally:
            cursor.close()
            conn.close()