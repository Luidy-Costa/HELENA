from app.services.paciente_service import PacienteService
from app.models.predicao_model import PredicaoModel
from app.services.ai_service import AIService  # <--- 1. IMPORTAÇÃO NOVA

class PredicaoService:
    def __init__(self):
        self.paciente_service = PacienteService()
        self.predicao_model = PredicaoModel()
        self.ai_engine = AIService() # <--- 2. LIGA O MOTOR DA IA

    def registrar_predicao(self, dados_completo, medico_id):
        # 1. Separa os dados
        dados_paciente = dados_completo['paciente']
        sintomas = dados_completo['sintomas']
        
        # 2. Garante o Paciente (Obtém ou Cria)
        paciente_id = self.paciente_service.obter_ou_criar(dados_paciente, medico_id)
        
        # 3. A MÁGICA REAL ACONTECE AQUI 🧠✨
        # Antes estava: probabilidade = 85.5
        # Agora:
        probabilidade, resultado_texto = self.ai_engine.prever_risco(sintomas)
        
        # 4. Salva o resultado REAL no Banco
        novo_id_predicao = self.predicao_model.criar(
            paciente_id, 
            medico_id, 
            dados_paciente['hospital_id'], 
            sintomas, 
            probabilidade, 
            resultado_texto
        )
        
        return {
            "predicao_id": novo_id_predicao,
            "paciente_id": paciente_id,
            "resultado": resultado_texto,  # Ex: "Baixo Risco"
            "probabilidade": f"{probabilidade}%" # Ex: "12.5%"
        }