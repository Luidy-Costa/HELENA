from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from app.models.usuario_model import UsuarioModel

class AuthService:
    def __init__(self):
        self.model = UsuarioModel()

    def obter_perfil(self, usuario_id, tipo_usuario):
        if tipo_usuario == 'medico':
            dados = self.model.buscar_medico_por_id(usuario_id)
            if dados:
                return {
                    "id": dados[0], "nome": dados[1], "crm": dados[2], 
                    "email": dados[3], "foto": dados[4], "ativo": dados[5]
                }
        elif tipo_usuario == 'hospital':
            dados = self.model.buscar_hospital_por_id(usuario_id)
            if dados:
                return {
                    "id": dados[0], "nome_fantasia": dados[1], "cnpj": dados[2],
                    "email": dados[3], "foto": dados[4], "ativo": dados[5]
                }
        elif tipo_usuario == 'admin':
            dados = self.model.buscar_admin_por_id(usuario_id)
            if dados:
                return {
                    "id": dados[0], "nome": dados[1], "email": dados[2], "foto": dados[3]
                }
        return None

    def atualizar_perfil(self, usuario_id, tipo_usuario, dados):
        if tipo_usuario == 'medico':
            return self.model.atualizar_medico(
                usuario_id, dados.get('nome'), dados.get('email'), 
                dados.get('foto'), dados.get('crm')
            )
        elif tipo_usuario == 'hospital':
            return self.model.atualizar_hospital(
                usuario_id, dados.get('nome_fantasia'), dados.get('email'), 
                dados.get('foto'), dados.get('cnpj')
            )
        elif tipo_usuario == 'admin':
            return self.model.atualizar_admin(
                usuario_id, dados.get('nome'), dados.get('email')
            )
        return False

    # --- HOSPITAL ---
    def registrar_hospital(self, dados):
        senha_hash = generate_password_hash(dados.get('senha'))
        return self.model.criar_hospital(
            dados['nome_fantasia'], 
            dados['cnpj'], 
            dados['email'], 
            senha_hash
        )

    def login_hospital(self, cnpj, senha_pura):
        hospital = self.model.buscar_hospital_por_cnpj(cnpj)
        
        if not hospital or not check_password_hash(hospital[2], senha_pura):
            return {"erro": "CNPJ ou senha incorretos", "status": 401}
            
        if not hospital[4]: # Validação da trava de Soft Delete
            return {"erro": "Conta inativada. Entre em contato com a administração geral.", "status": 403}

        token = create_access_token(identity=str(hospital[0]), additional_claims={"tipo": "hospital"})
        return {"token": token, "nome": hospital[1], "id": hospital[0], "status": 200}

    # --- MÉDICO ---
    def registrar_medico(self, dados):
        senha_hash = generate_password_hash(dados.get('senha'))
        return self.model.criar_medico(
            dados['nome'], 
            dados['crm'], 
            dados['email'], 
            senha_hash
        )

    def login_medico(self, crm, senha_pura):
        medico = self.model.buscar_medico_por_crm(crm)
        
        if not medico or not check_password_hash(medico[2], senha_pura):
            return {"erro": "CRM ou senha incorretos", "status": 401}
            
        if not medico[4]: # Validação da trava de Soft Delete
            return {"erro": "Seu acesso foi revogado pela instituição de saúde.", "status": 403}

        token = create_access_token(identity=str(medico[0]), additional_claims={"tipo": "medico"})
        return {"token": token, "nome": medico[1], "id": medico[0], "status": 200}

    # --- ADMIN ---
    def registrar_admin(self, dados):
        senha_hash = generate_password_hash(dados.get('senha'))
        return self.model.criar_admin(
            dados['nome_completo'], 
            dados['email'], 
            senha_hash
        )

    def login_admin(self, email, senha_pura):
        admin = self.model.buscar_admin_por_email(email)
        if not admin or not check_password_hash(admin[2], senha_pura):
            return {"erro": "Credenciais inválidas", "status": 401}
            
        token = create_access_token(identity=str(admin[0]), additional_claims={"tipo": "admin"})
        return {"token": token, "nome": admin[1], "id": admin[0], "status": 200}