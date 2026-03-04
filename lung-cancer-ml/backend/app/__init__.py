from flask import Flask
from flask_jwt_extended import JWTManager
from app.services.email_service import mail # <--- IMPORTANTE: Importar o carteiro
import datetime

def create_app():
    app = Flask(__name__)

    # --- 1. CONFIGURAÇÕES DE SEGURANÇA ---
    app.config['JWT_SECRET_KEY'] = 'Carimbo_super_secreto_do_Luidy'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(hours=12)
    
    # --- 2. CONFIGURAÇÕES DO GMAIL (AQUI QUE VOCÊ MEXE!) ---
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    
    # 👇👇👇 COLOQUE SEUS DADOS NAS DUAS LINHAS ABAIXO 👇👇👇
    app.config['MAIL_USERNAME'] = 'lluidycosta2024@gmail.com' 
    app.config['MAIL_PASSWORD'] = 'cjcn jdwv lrzc lnuw' 
    # 👆👆👆 ------------------------------------------- 👆👆👆

    # Inicializa as ferramentas
    jwt = JWTManager(app)
    mail.init_app(app) # <--- Liga o motor de envio de e-mail

    # --- 3. REGISTRO DAS ROTAS (BLUEPRINTS) ---
    
    # Autenticação
    from app.controllers.auth_controller import auth_bp
    app.register_blueprint(auth_bp)

    # Pacientes
    from app.controllers.paciente_controller import paciente_bp
    app.register_blueprint(paciente_bp)

    # Predições
    from app.controllers.predicao_controller import predicao_bp
    app.register_blueprint(predicao_bp)
    
    # Dashboard
    from app.controllers.dashboard_controller import dashboard_bp
    app.register_blueprint(dashboard_bp)

    # Admin
    from app.controllers.admin_controller import admin_bp
    app.register_blueprint(admin_bp)

    # Vínculos (Convites)
    from app.controllers.vinculo_controller import vinculo_bp
    app.register_blueprint(vinculo_bp)

    from app.controllers.senha_controller import senha_bp
    app.register_blueprint(senha_bp)

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return {"status": "sucesso", "mensagem": "Servidor MVC rodando com E-mail!"}

    return app