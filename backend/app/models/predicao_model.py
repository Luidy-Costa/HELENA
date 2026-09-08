import json
from app.utils.database import obter_conexao

class PredicaoModel:
    def criar(self, paciente_id, medico_id, hospital_id, dados_clinicos, probabilidade, diagnostico):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            # Converte o dicionário Python para string JSONB antes de gravar
            json_dados = json.dumps(dados_clinicos)
            
            cursor.execute("""
                INSERT INTO predicao 
                (paciente_id, medico_id, hospital_id, dados_clinicos, probabilidade_risco, diagnostico_final)
                VALUES (%s, %s, %s, %s, %s, %s) RETURNING id;
            """, (paciente_id, medico_id, hospital_id, json_dados, probabilidade, diagnostico))
            
            novo_id = cursor.fetchone()[0]
            conn.commit()
            return novo_id
        finally:
            cursor.close()
            conn.close()

    def buscar_por_id_completo(self, predicao_id):
        """
        Faz um JOIN massivo para pegar tudo que o PDFService precisa em 1 única consulta.
        """
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            query = """
                SELECT 
                    pr.id, pr.probabilidade_risco, pr.diagnostico_final, pr.dados_clinicos, pr.data_predicao,
                    p.nome_completo AS paciente_nome, p.data_nascimento AS paciente_nasc,
                    m.nome_completo AS medico_nome, m.crm AS medico_crm,
                    h.nome_fantasia AS hospital_nome
                FROM predicao pr
                JOIN pacientes p ON pr.paciente_id = p.id
                JOIN medicos m ON pr.medico_id = m.id
                JOIN hospitais h ON pr.hospital_id = h.id
                WHERE pr.id = %s;
            """
            cursor.execute(query, (predicao_id,))
            resultado = cursor.fetchone()
            
            if not resultado:
                return None
                
            # Formata os dados no formato exato que o PDFService espera
            return {
                "id": resultado[0],
                "probabilidade": float(resultado[1]),
                "resultado": resultado[2],
                "sintomas": resultado[3], 
                "data": resultado[4].strftime("%d/%m/%Y %H:%M:%S"),
                "paciente_nome": resultado[5],
                "paciente_nasc": resultado[6].strftime("%d/%m/%Y"),
                "medico_nome": resultado[7],
                "medico_crm": resultado[8],
                "hospital_nome": resultado[9]
            }
        finally:
            cursor.close()
            conn.close()

    def listar_historico_medico(self, medico_id):
        conn = obter_conexao()
        cursor = conn.cursor()
        try:
            # CORREÇÃO: Ajustado para p.nome_completo e pr.data_predicao conforme o Schema
            query = """
                SELECT pr.id, p.nome_completo, p.id AS paciente_id, h.nome_fantasia, 
                       pr.data_predicao, pr.probabilidade_risco, pr.diagnostico_final
                FROM predicao pr
                JOIN pacientes p ON pr.paciente_id = p.id
                JOIN hospitais h ON pr.hospital_id = h.id
                WHERE pr.medico_id = %s
                ORDER BY pr.data_predicao DESC;
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
                    "data": r[4].strftime("%d/%m/%Y %H:%M"),
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
                    "data": r[2].strftime("%d/%m/%Y %H:%M"),
                    "hospital": r[3],
                    "porcentagem": f"{float(r[4])}%" if r[4] is not None else "0%",
                    "risco": r[5]
                })
            return lista
        finally:
            cursor.close()
            conn.close()