import os
import datetime
from flask import Flask
from flask_cors import CORS  
from flask_jwt_extended import JWTManager
from app.services.email_service import mail

def create_app():
    app = Flask(__name__)

    # Libera a comunicação cruzada com o frontend (React/Vite)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # --- 1. CONFIGURAÇÕES DE SEGURANÇA (Conformidade com RNF02) ---
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET', 'Carimbo_super_secreto_do_Luidy')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(hours=1) 
    
    # --- 2. CONFIGURAÇÕES SMTP (Integração de E-mail) ---
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USER', 'lluidycosta2024@gmail.com')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASS', 'cjcn jdwv lrzc lnuw') 

    # Inicialização das Extensões
    jwt = JWTManager(app)
    mail.init_app(app)

    # --- 3. REGISTRO DAS ROTAS (BLUEPRINTS) ---
    from app.controllers.auth_controller import auth_bp
    from app.controllers.paciente_controller import paciente_bp
    from app.controllers.predicao_controller import predicao_bp
    from app.controllers.dashboard_controller import dashboard_bp
    from app.controllers.admin_controller import admin_bp
    from app.controllers.vinculo_controller import vinculo_bp
    from app.controllers.senha_controller import senha_bp
    from app.controllers.hospital_controller import hospital_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(paciente_bp)
    app.register_blueprint(predicao_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(vinculo_bp)
    app.register_blueprint(senha_bp)
    app.register_blueprint(hospital_bp)

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return {
            "status": "sucesso", 
            "sistema": "HELENA", 
            "mensagem": "API RESTful operando com integrações de SMTP ativas."
        }

    return app