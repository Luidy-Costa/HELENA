import joblib
import pandas as pd
import os

class LungCancerPrediction:
    def __init__(self):
        #definindo o caminho onde sera achado os modelos, para facilitar alterações futuras, e abstrair essa execução da api
        self.caminho_modelo = "modelos/modelo_pulmao.pkl"
        self.caminho_escalonador = "modelos/escalonador.pkl"

        #definindo os modelos propriamente ditos da classe
        self.modelo = None
        self.escalonador = None

        #executando a função que ira a carregar os arquivos dos modelos
        self.carregar_modelos()

    def carregar_modelos(self):
        #metodo para carregart os arquivos dos modelos
        #exceção para caso o arquivo não seja encontrado no caminho indicado
        if not os.path.exists(self.caminho_modelo) or not os.path.exists(self.caminho_escalonador):
            raise FileNotFoundError("Erro: O arquivo .plk não foi encontrado no caminho indicado")
        #caso o arquivo seja encontrado no caminho que foi dito ele vai inserir os modelos nas variaveis criadas
        self.modelo= joblib.load(self.caminho_modelo)
        self.escalonador = joblib.load(self.caminho_escalonador)
        print("Modelo carregado com sucesso")
  
   
    def prever(self, prontuario):
        #nome de todas as colunas do modelo
        colunas_do_modelo = [
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

        #criando um dicionario com todos os valores zerados
        prontuario_traduzido = {i:0 for i in colunas_do_modelo}

        #res_sim = resposta com sim ou não
        res_sim = ['Falta_Ar', 'Tosse_Sangue', 'Tosse', 'Fadiga', 'Alcoolismo', 'Chiado']

        for i in res_sim:
            if str(prontuario.get(i)).lower() == "sim":
                prontuario_traduzido[i] = 1
        
        idade = prontuario.get("Idade")
        if idade == '30_a_50_anos': 
            prontuario_traduzido['Idade_30_a_50_anos'] = 1
        elif idade == '50_a_70_anos': 
            prontuario_traduzido['Idade_50_a_70_anos'] = 1
        elif idade == 'Mais_de_70': 
            prontuario_traduzido['Idade_Mais_de_70'] = 1  

       
        genero = prontuario.get("Genero")
        if genero in ["M", "m", "Masculino"]: 
            prontuario_traduzido['Genero_m'] = 1
        elif genero in ["F", "f", "Feminino"]: 
            prontuario_traduzido['Genero_f'] = 1

      
        fumo = prontuario.get('Fumo') 
        if fumo == 'fumante_ativo':     
            prontuario_traduzido['Fumo_fumante_ativo'] = 1
        elif fumo == 'ex_fumante':
            prontuario_traduzido['Fumo_ex_fumante'] = 1
        elif fumo == 'não_fumante':
            prontuario_traduzido['Fumo_não_fumante'] = 1
        
        #res_normal = resposta com normal ou anormal
        res_normal = ['Freq_Respiratoria', 
            'Freq_Cardiaca', 
            'Pressao_Sistolica', 
            'Pressao_Diastolica', 
            'IMC']
        
        for i in res_normal:
            res = str(prontuario.get(i)).lower()
            if res == "normal" :
                nome_da_coluna = f"{i}_normal"
                prontuario_traduzido[nome_da_coluna] = 1 
        
        for i in res_normal:
            if prontuario.get(i) == "Anormal"  : 
                nome_da_coluna = f"{i}_abnormal"
                prontuario_traduzido[nome_da_coluna] = 1 

        if str(prontuario.get('Sat_Oxigenio')).lower() in ["anormal", "abnormal", "baixa"]:
            prontuario_traduzido['Sat_Oxigenio_abnormal'] = 1
        
        dataframe = pd.DataFrame([ prontuario_traduzido])

        dataframe = dataframe[colunas_do_modelo]

        dataframe_escalonado = self.escalonador.transform(dataframe)

        previsao = self.modelo.predict(dataframe_escalonado)[0]


        probabilidade=self.modelo.predict_proba(dataframe_escalonado)[0]

        indice_cancer = list(self.modelo.classes_).index(1)

        chance_cancer = probabilidade[indice_cancer]
        
        diagnostico_final = "Alto Risco" if chance_cancer >= 0.50 else "Baixo Risco"

        return{"Diagnostico":diagnostico_final,
               "Probabilidade": f"{(chance_cancer*100):.2f}%"}








