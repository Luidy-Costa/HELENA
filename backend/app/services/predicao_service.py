from app.services.paciente_service import PacienteService
from app.models.predicao_model import PredicaoModel
from app.services.ai_service import AIService 

class PredicaoService:
    def __init__(self):
        self.paciente_service = PacienteService()
        self.predicao_model = PredicaoModel()
        self.ai_engine = AIService() 

    def registrar_predicao(self, dados_completo, medico_id):
        # 1. Separação de responsabilidades
        dados_paciente = dados_completo['paciente']
        sintomas = dados_completo['sintomas']
        hospital_id = dados_paciente['hospital_id']
        
        # 2. Segurança e Multi-Tenancy (Garante o paciente isolado por hospital)
        paciente_id = self.paciente_service.obter_ou_criar(dados_paciente, medico_id)
        
        # 3. Processamento no Motor Preditivo
        probabilidade, resultado_texto = self.ai_engine.prever_risco(sintomas)
        
        # 4. Considação do Laudo Imutável (JSONB nativo)
        novo_id_predicao = self.predicao_model.criar(
            paciente_id=paciente_id, 
            medico_id=medico_id, 
            hospital_id=hospital_id, 
            dados_clinicos=sintomas, 
            probabilidade=probabilidade, 
            diagnostico=resultado_texto
        )
        
        return {
            "predicao_id": novo_id_predicao,
            "paciente_id": paciente_id,
            "resultado": resultado_texto,  
            "probabilidade": probabilidade 
        }