from flask_mail import Mail, Message
from flask import current_app

mail = Mail() 

class EmailService:
    def enviar_convite_vinculo(self, email_medico, nome_hospital, link_aceite):
        """
        Envia e-mail com botão de ação direta.
        """
        assunto = f"Convite: Junte-se ao {nome_hospital}"
        
        # HTML do e-mail
        corpo_html = f"""
        <h2>Olá!</h2>
        <p>O hospital <strong>{nome_hospital}</strong> convidou você para a equipe.</p>
        
        <p>Clique no botão abaixo para aceitar imediatamente:</p>
        
        <a href="{link_aceite}" style="
            background-color: #28a745; 
            color: white; 
            padding: 10px 20px; 
            text-decoration: none; 
            border-radius: 5px; 
            font-weight: bold;">
            ACEITAR CONVITE AGORA
        </a>
        
        <p><small>Se você não reconhece este convite, apenas ignore.</small></p>
        """
        
        remetente = current_app.config.get('MAIL_USERNAME')
        
        msg = Message(
            subject=assunto,
            recipients=[email_medico],
            html=corpo_html, # Usamos html em vez de body
            sender=remetente
        )

        try:
            mail.send(msg)
            print(f"📧 [Email] Link enviado para {email_medico}")
            return True
        except Exception as e:
            print(f"❌ [Email] Erro: {str(e)}")
            return False
    def enviar_codigo_recuperacao(self, email_destino, codigo):
        assunto = "Seu Código de Recuperação - Lung Cancer AI"
        
        corpo_html = f"""
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
            <h2>Recuperação de Senha</h2>
            <p>Você solicitou a redefinição de sua senha.</p>
            <p>Use o código abaixo para prosseguir:</p>
            
            <h1 style="color: #007bff; letter-spacing: 5px; font-size: 40px;">{codigo}</h1>
            
            <p><small>Este código expira em 15 minutos.</small></p>
            <p>Se você não solicitou isso, ignore este e-mail.</p>
        </div>
        """
        
        msg = Message(
            subject=assunto,
            recipients=[email_destino],
            html=corpo_html,
            sender=current_app.config.get('MAIL_USERNAME')
        )

        try:
            mail.send(msg)
            print(f"📧 [Email] Código {codigo} enviado para {email_destino}")
            return True
        except Exception as e:
            print(f"❌ [Email] Erro ao enviar código: {str(e)}")
            return False