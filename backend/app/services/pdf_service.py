from fpdf import FPDF
import os

class PDFService(FPDF):
    def header(self):
        # --- BANNER SUPERIOR (Fundo Azul Escuro) ---
        # Corrigido para a cor do seu frontend: #0b2b3f (RGB: 11, 43, 63)
        self.set_fill_color(11, 43, 63)
        self.rect(0, 0, 210, 25, 'F') 
        
        self.set_y(8)
        self.set_font('Arial', 'B', 22)
        self.set_text_color(255, 255, 255)
        self.cell(0, 8, 'HELENA', 0, 1, 'C')
        
        # Subtítulo (Azul Claro: #6eb1be -> RGB: 110, 177, 190)
        self.set_font('Arial', 'I', 10)
        self.set_text_color(110, 177, 190)
        self.cell(0, 5, 'Relatorio Preditivo de Risco Pulmonar - IA', 0, 1, 'C')
        self.ln(12)

    def footer(self):
        # --- RODAPÉ COM AVISO LEGAL ---
        self.set_y(-25)
        self.set_font('Arial', 'I', 8)
        self.set_text_color(150, 150, 150) # Cinza
        
        aviso = ("Aviso Legal: O HELENA e uma ferramenta de suporte a decisao clinica baseada em Inteligencia "
                 "Artificial. O diagnostico final, a interpretacao dos dados e a conduta terapeutica sao de "
                 "responsabilidade exclusiva do medico assistente.")
        self.multi_cell(0, 4, aviso, 0, 'C')
        self.ln(2)
        
        # Numeração de página
        self.set_font('Arial', 'B', 8)
        self.set_text_color(11, 43, 63)
        self.cell(0, 5, f'Pagina {self.page_no()}', 0, 0, 'C')

    def draw_section_title(self, title):
        # --- FUNÇÃO AUXILIAR PARA TÍTULOS DE SEÇÃO ---
        self.set_font('Arial', 'B', 12)
        self.set_text_color(11, 43, 63) # Azul Escuro
        self.set_fill_color(244, 249, 251) # Fundo Azulzinho claro (#f4f9fb)
        
        self.cell(0, 10, f"  {title}", 0, 1, 'L', fill=True)
        
        # Linha inferior decorativa
        self.set_draw_color(110, 177, 190) # Azul Claro
        self.set_line_width(0.5)
        self.line(self.get_x(), self.get_y(), self.get_x() + 190, self.get_y())
        self.set_line_width(0.2) # Reseta espessura
        self.ln(4)

    def gerar_laudo(self, dados):
        self.add_page()
        
        # --- 1. DADOS DE REGISTRO E PACIENTE (Duas Colunas) ---
        self.draw_section_title("DADOS DO ATENDIMENTO E PACIENTE")
        
        self.set_font('Arial', 'B', 10)
        self.set_text_color(100, 100, 100) # Cinza escuro para os rótulos
        
        # Linha 1
        self.cell(30, 6, "Paciente:", 0, 0)
        self.set_font('Arial', 'B', 10)
        self.set_text_color(11, 43, 63)
        self.cell(80, 6, str(dados.get('paciente_nome', '-')), 0, 0)
        
        self.set_font('Arial', 'B', 10)
        self.set_text_color(100, 100, 100)
        self.cell(30, 6, "ID Sistema:", 0, 0)
        self.set_font('Arial', '', 10)
        self.set_text_color(11, 43, 63)
        id_display = dados.get('paciente_id') or dados.get('id_personalizado') or dados.get('id', '-')
        self.cell(50, 6, str(id_display), 0, 1)

        # Linha 2
        self.set_font('Arial', 'B', 10)
        self.set_text_color(100, 100, 100)
        self.cell(30, 6, "Nascimento:", 0, 0)
        self.set_font('Arial', '', 10)
        self.set_text_color(11, 43, 63)
        self.cell(80, 6, str(dados.get('paciente_nasc', '-')), 0, 0)

        self.set_font('Arial', 'B', 10)
        self.set_text_color(100, 100, 100)
        self.cell(30, 6, "Data Emissao:", 0, 0)
        self.set_font('Arial', '', 10)
        self.set_text_color(11, 43, 63)
        self.cell(50, 6, str(dados.get('data', '-')), 0, 1)

        # Linha 3
        self.set_font('Arial', 'B', 10)
        self.set_text_color(100, 100, 100)
        self.cell(30, 6, "Instituicao:", 0, 0)
        self.set_font('Arial', '', 10)
        self.set_text_color(11, 43, 63)
        self.cell(80, 6, str(dados.get('hospital_nome', '-')), 0, 0)
        
        self.set_font('Arial', 'B', 10)
        self.set_text_color(100, 100, 100)
        self.cell(30, 6, "Medico (CRM):", 0, 0)
        self.set_font('Arial', '', 10)
        self.set_text_color(11, 43, 63)
        medico_txt = f"{dados.get('medico_nome', '-')} ({dados.get('medico_crm', '-')})"
        self.cell(50, 6, medico_txt, 0, 1)
        
        self.ln(6)

        # --- 2. DESTAQUE DO RESULTADO DA IA ---
        self.draw_section_title("CONCLUSÃO DO MOTOR PREDITIVO")
        
        resultado = str(dados.get('resultado', '')).upper()
        probabilidade = dados.get('probabilidade', '0')
        is_alto_risco = "ALTO" in resultado
        
        # Cores dinâmicas (Vermelho vs Verde)
        if is_alto_risco:
            fill_color = (254, 226, 226) # bg-red-50
            border_color = (239, 68, 68) # border-red-500
            text_color = (185, 28, 28)   # text-red-700
        else:
            fill_color = (220, 252, 231) # bg-green-50
            border_color = (34, 197, 94) # border-green-500
            text_color = (21, 128, 61)   # text-green-700

        self.set_fill_color(*fill_color)
        self.set_draw_color(*border_color)
        self.set_line_width(0.5)
        
        # Desenha a caixa de destaque
        start_y = self.get_y()
        self.rect(10, start_y, 190, 24, 'FD')
        
        self.set_y(start_y + 5)
        self.set_font('Arial', 'B', 16)
        self.set_text_color(*text_color)
        self.cell(0, 6, f"DIAGNOSTICO IA: {resultado}", 0, 1, 'C')
        
        self.set_font('Arial', 'B', 12)
        self.cell(0, 8, f"Grau de Confianca / Risco Calculado: {probabilidade}%", 0, 1, 'C')
        
        self.set_line_width(0.2) # Volta pro padrão
        self.ln(12)

        # --- 3. TABELA DE SINTOMAS (Duas colunas com bordas sutis) ---
        self.draw_section_title("PARAMETROS CLINICOS ANALISADOS")
        
        sintomas = dados.get('sintomas', {})
        if 'sintomas' in sintomas: 
            sintomas = sintomas['sintomas']

        # Extrai os itens e converte chaves para formato legível
        itens = []
        for chave, valor in sintomas.items():
            chave_fmt = chave.replace('_', ' ').title()
            valor_fmt = str(valor).lower()
            if valor_fmt == 'm': valor_fmt = 'masculino'
            if valor_fmt == 'f': valor_fmt = 'feminino'
            itens.append((chave_fmt, valor_fmt))

        # Desenha a tabela 2x2
        self.set_draw_color(230, 230, 230) # Cinza bem claro para as linhas
        
        for i in range(0, len(itens), 2):
            # Coluna 1
            k1, v1 = itens[i]
            self.set_font('Arial', 'B', 9)
            self.set_text_color(11, 43, 63)
            self.cell(50, 8, f"{k1}:", 'B', 0)
            
            self.set_font('Arial', '', 9)
            self.set_text_color(100, 100, 100)
            self.cell(45, 8, v1, 'B', 0)

            # Coluna 2 (Se houver)
            if i + 1 < len(itens):
                k2, v2 = itens[i+1]
                self.set_font('Arial', 'B', 9)
                self.set_text_color(11, 43, 63)
                self.cell(50, 8, f"{k2}:", 'B', 0)
                
                self.set_font('Arial', '', 9)
                self.set_text_color(100, 100, 100)
                self.cell(45, 8, v2, 'B', 1)
            else:
                self.cell(95, 8, "", 'B', 1) # Célula vazia pra fechar a borda
                
        self.ln(8)
        
        # --- 4. OBSERVAÇÕES MÉDICAS ---
        if dados.get('observacoes'):
            self.draw_section_title("OBSERVACOES CLINICAS")
            self.set_font('Arial', '', 10)
            self.set_text_color(80, 80, 80)
            self.multi_cell(0, 6, str(dados['observacoes']))

        # Salva o arquivo e devolve o caminho
        caminho_arquivo = f"laudo_{dados.get('id', 'temp')}.pdf"
        self.output(caminho_arquivo)
        return caminho_arquivo