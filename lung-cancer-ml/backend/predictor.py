import joblib
import pandas as pd
import os
from typing import Dict, Any

class LungCancerPrediction:
    # Constante de classe: Carregada apenas uma vez na memória, otimizando a API
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

    def __init__(self, caminho_modelo: str = "modelos/modelo_pulmao.pkl", caminho_escalonador: str = "modelos/escalonador.pkl"):
        self.caminho_modelo = caminho_modelo
        self.caminho_escalonador = caminho_escalonador
        self.modelo = None
        self.escalonador = None
        self._carregar_modelos()

    def _carregar_modelos(self) -> None:
        """Carrega os arquivos .pkl do modelo e do escalonador para a memória."""
        if not os.path.exists(self.caminho_modelo) or not os.path.exists(self.caminho_escalonador):
            raise FileNotFoundError(f"Erro: Arquivos não encontrados em {self.caminho_modelo} ou {self.caminho_escalonador}")
        
        try:
            self.modelo = joblib.load(self.caminho_modelo)
            self.escalonador = joblib.load(self.caminho_escalonador)
            print("Modelos carregados com sucesso e prontos para operação!")
        except Exception as e:
            raise RuntimeError(f"Erro ao carregar os modelos com joblib: {str(e)}")

    def _pre_processar_dados(self, prontuario: Dict[str, Any]) -> pd.DataFrame:
        """
        Traduz o dicionário humano do formulário (Sim/Não/Anormal) 
        para a matriz binária escalonada exigida pelo modelo.
        """
        prontuario_traduzido = {coluna: 0 for coluna in self._COLUNAS_MODELO}

        # Tratamento de Variáveis Sim/Não
        res_sim = ['Falta_Ar', 'Tosse_Sangue', 'Tosse', 'Fadiga', 'Alcoolismo', 'Chiado']
        for i in res_sim:
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
        
        # Cria e escalona o DataFrame final
        dataframe = pd.DataFrame([prontuario_traduzido])[self._COLUNAS_MODELO]
        return self.escalonador.transform(dataframe)

    def prever(self, prontuario: Dict[str, Any]) -> Dict[str, str]:
        """
        Recebe os dados brutos do paciente, realiza o pré-processamento,
        aplica o modelo matemático e retorna o diagnóstico final baseado no threshold de 50%.
        """
        # 1. Pipeline de Pré-processamento
        dataframe_escalonado = self._pre_processar_dados(prontuario)

        # 2. Predição Matemática
        probabilidade = self.modelo.predict_proba(dataframe_escalonado)[0]
        indice_cancer = list(self.modelo.classes_).index(1)
        chance_cancer = probabilidade[indice_cancer]
        
        # 3. Aplicação da Regra de Negócio Clínica
        diagnostico_final = "Alto Risco" if chance_cancer >= 0.50 else "Baixo Risco"

        return {
            "Diagnostico": diagnostico_final,
            "Probabilidade": f"{(chance_cancer * 100):.2f}%"
        }