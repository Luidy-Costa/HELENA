from fpdf import FPDF
import os

class PDFService(FPDF):
    def header(self):
        # Cabeçalho do PDF
        self.set_font('Arial', 'B', 15)
        self.cell(0, 10, 'Sistema Lung Cancer AI - Laudo Médico', 0, 1, 'C')
        self.ln(5) # Pula linha

    def footer(self):
        # Rodapé
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Página {self.page_no()}', 0, 0, 'C')

    def gerar_laudo(self, dados):
        self.add_page()
        self.set_font('Arial', '', 12)
        
        # --- 1. Informações Gerais ---
        self.set_fill_color(200, 220, 255) # Azulzinho claro
        self.cell(0, 10, 'Informações do Atendimento', 0, 1, 'L', fill=True)
        self.ln(2)
        
        self.cell(0, 8, f"Hospital: {dados['hospital_nome']}", 0, 1)
        self.cell(0, 8, f"Médico Responsável: {dados['medico_nome']} (CRM: {dados['medico_crm']})", 0, 1)
        self.cell(0, 8, f"Data da Predição: {dados['data']}", 0, 1)
        self.ln(5)

        # --- 2. Dados do Paciente ---
        self.cell(0, 10, 'Dados do Paciente', 0, 1, 'L', fill=True)
        self.ln(2)
        self.cell(0, 8, f"Nome: {dados['paciente_nome']}", 0, 1)
        self.cell(0, 8, f"Data Nascimento: {dados['paciente_nasc']}", 0, 1)
        self.ln(5)

        # --- 3. Resultado da IA ---
        self.cell(0, 10, 'Resultado da Análise (IA)', 0, 1, 'L', fill=True)
        self.ln(5)
        
        # Destaque do Resultado
        self.set_font('Arial', 'B', 16)
        if "Alto" in dados['resultado']:
            self.set_text_color(200, 0, 0) # Vermelho
        else:
            self.set_text_color(0, 128, 0) # Verde
            
        self.cell(0, 10, f"DIAGNÓSTICO: {dados['resultado']}", 0, 1, 'C')
        self.set_text_color(0, 0, 0) # Volta pro preto
        
        self.set_font('Arial', '', 12)
        self.cell(0, 10, f"Probabilidade Calculada: {dados['probabilidade']}%", 0, 1, 'C')
        self.ln(5)

        # --- 4. Sintomas Reportados ---
        self.set_font('Arial', '', 12)
        self.cell(0, 10, 'Parâmetros Clínicos Analisados:', 0, 1, 'L', fill=True)
        self.ln(2)
        
        sintomas = dados['sintomas'] # É um dicionário
        # Remove chaves internas se houver (ex: 'paciente', 'sintomas')
        if 'sintomas' in sintomas: 
            sintomas = sintomas['sintomas']

        col_width = 90
        for chave, valor in sintomas.items():
            chave_formatada = chave.replace('_', ' ').title()
            self.cell(col_width, 8, f"- {chave_formatada}: {valor}", 0, 0)
            # Quebra de linha a cada 2 itens (opcional, aqui fiz simples)
            self.ln()

        # Salva em memória (nome temporário, pois o controller vai mandar os bytes)
        caminho_arquivo = f"laudo_{dados['id']}.pdf"
        self.output(caminho_arquivo)
        return caminho_arquivo