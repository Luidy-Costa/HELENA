import os
import joblib
import pandas as pd
import numpy as np

class AIService:
    
    _COLUNAS_MODELO = [
        'Falta_Ar', 'Tosse_Sangue', 'Tosse', 'Fadiga', 'Alcoolismo', 'Chiado', 
        'Idade_30_a_50_anos', 'Idade_50_a_70_anos', 'Idade_Mais_de_70', 
        'Genero_f', 'Genero_m', 
        'Fumo_ex_fumante', 'Fumo_fumante_ativo', 'Fumo_não_fumante', 
        'Freq_Respiratoria_abnormal', 'Freq_Respiratoria_normal', 
        'Freq_Cardiaca_abnormal', 'Freq_Cardiaca_normal', 
        'Pressao_Sistolica_abnormal', 'Pressao_Sistolica_normal', 
        'Pressao_Diastolica_abnormal', 'Pressao_Diastolica_normal', 
        'IMC_abnormal', 'IMC_normal', 
        'Sat_Oxigenio_abnormal'
    ]

    def __init__(self):
        
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../'))
        self.model_path = os.path.join(base_dir, 'ai_models', 'modelo_pulmao.pkl')
        self.scaler_path = os.path.join(base_dir, 'ai_models', 'escalonador.pkl')
        
        self.modelo = None
        self.escalonador = None
        self._carregar_modelos()

    def _carregar_modelos(self):
        try:
            if not os.path.exists(self.model_path) or not os.path.exists(self.scaler_path):
                print(f"[IA] Arquivos não encontrados em: {self.model_path}")
                return

            
            self.modelo = joblib.load(self.model_path)
            self.escalonador = joblib.load(self.scaler_path)
            print("[IA] Modelos carregados com sucesso!")
        except Exception as e:
            print(f"[IA] Erro crítico ao carregar modelos: {e}")

    def prever_risco(self, prontuario):
        """
        Recebe o JSON do frontend, traduz para números e calcula o risco.
        """
        if not self.modelo or not self.escalonador:
            return 0.0, "ERRO: IA Offline"

        try:
            # 1. Pipeline de Pré-processamento
            dataframe_escalonado = self._pre_processar_dados(prontuario)

          
            probabilidade = self.modelo.predict_proba(dataframe_escalonado)[0]
            
            # Pegamos a chance de ser "1" (Câncer) e multiplicamos por 100
            chance_cancer = probabilidade[1] * 100
            
           
            resultado = "Alto Risco" if chance_cancer >= 50 else "Baixo Risco"

            return round(float(chance_cancer), 2), resultado

        except Exception as e:
            print(f"Erro durante predição: {e}")
            return 0.0, f"Erro: {str(e)}"

    def _pre_processar_dados(self, prontuario):
        
        # Inicializa tudo com 0
        prontuario_traduzido = {coluna: 0 for coluna in self._COLUNAS_MODELO}

        # Tratamento de Variáveis Sim/Não
        res_sim = ['Falta_Ar', 'Tosse_Sangue', 'Tosse', 'Fadiga', 'Alcoolismo', 'Chiado']
        for i in res_sim:
            # .get(i, '') garante que não quebre se o campo faltar
            if str(prontuario.get(i, '')).lower() == "sim":
                prontuario_traduzido[i] = 1
        
        # Tratamento de Idade
        idade = prontuario.get("Idade")
        if idade == '30_a_50_anos': prontuario_traduzido['Idade_30_a_50_anos'] = 1
        elif idade == '50_a_70_anos': prontuario_traduzido['Idade_50_a_70_anos'] = 1
        elif idade == 'Mais_de_70': prontuario_traduzido['Idade_Mais_de_70'] = 1  

        # Tratamento de Gênero
        genero = prontuario.get("Genero")
        if genero in ["M", "m", "Masculino"]: prontuario_traduzido['Genero_m'] = 1
        elif genero in ["F", "f", "Feminino"]: prontuario_traduzido['Genero_f'] = 1

        # Tratamento de Fumo
        fumo = prontuario.get('Fumo') 
        if fumo == 'fumante_ativo': prontuario_traduzido['Fumo_fumante_ativo'] = 1
        elif fumo == 'ex_fumante': prontuario_traduzido['Fumo_ex_fumante'] = 1
        elif fumo == 'não_fumante': prontuario_traduzido['Fumo_não_fumante'] = 1
        
        # Tratamento de Sinais Vitais (Normal/Anormal)
        res_normal = ['Freq_Respiratoria', 'Freq_Cardiaca', 'Pressao_Sistolica', 'Pressao_Diastolica', 'IMC']
        for i in res_normal:
            res = str(prontuario.get(i, '')).lower()
            if res == "normal":
                prontuario_traduzido[f"{i}_normal"] = 1 
            elif res in ["anormal", "abnormal"]:
                prontuario_traduzido[f"{i}_abnormal"] = 1 

        # Tratamento Oxigênio
        if str(prontuario.get('Sat_Oxigenio', '')).lower() in ["anormal", "abnormal", "baixa"]:
            prontuario_traduzido['Sat_Oxigenio_abnormal'] = 1
        
        dataframe = pd.DataFrame([prontuario_traduzido])[self._COLUNAS_MODELO]
        
        return self.escalonador.transform(dataframe)