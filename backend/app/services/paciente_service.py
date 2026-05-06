from app.models.paciente_model import PacienteModel
from app.models.usuario_model import UsuarioModel

class PacienteService:
    def __init__(self):
        self.model = PacienteModel()
        self.usuario_model = UsuarioModel()

    def obter_ou_criar(self, dados_paciente, medico_id):
        hospital_id = dados_paciente.get('hospital_id')

        # 1. Segurança: Médico trabalha nesse hospital?
        if not self.usuario_model.verificar_vinculo(medico_id, hospital_id):
             raise Exception(f"Erro: Médico sem permissão no hospital {hospital_id}")

        # 2. Busca se já existe
        paciente_existente = self.model.buscar_por_dados(
            dados_paciente['nome'], 
            dados_paciente['data_nascimento'], 
            hospital_id
        )

        if paciente_existente:
            return paciente_existente[0]
        
        # 3. Se não existe, cria um novo
        return self.model.criar(dados_paciente)

    def listar(self, usuario_id, tipo_usuario):
        # Simplificação: Por enquanto lista por hospital vinculado ou direto pelo ID do hospital
        # Se for médico, precisaria descobrir qual hospital ele quer ver, mas vamos manter simples
        # Assumindo que o usuario_id seja o ID do Hospital para facilitar o teste
        if tipo_usuario == 'hospital':
            return self.model.listar_por_hospital(usuario_id)
        return []

    # [NOVO] Método de Atualizar
    def atualizar_paciente(self, paciente_id, dados_novos):
        # Aqui poderíamos adicionar validação se o médico tem permissão, etc.
        return self.model.atualizar(
            paciente_id, 
            dados_novos['nome'], 
            dados_novos['data_nascimento']
        )