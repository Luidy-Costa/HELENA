from app import create_app
app = create_app()
with app.app_context():
    from app.extensions import db
    from app.models.admin_model import Admin
    from werkzeug.security import generate_password_hash
    
    if not Admin.query.filter_by(email='admin@helena.com').first():
        novo = Admin(
            nome_completo='Admin Master',
            email='admin@helena.com',
            senha_hash=generate_password_hash('123456')
        )
        db.session.add(novo)
        db.session.commit()
        print('Admin criado com sucesso!')
    else:
        print('Admin já existe no banco!')