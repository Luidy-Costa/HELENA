# O seu import com o apelido
from predictor import LungCancerPrediction as lcp

print("Iniciando os testes...\n")

# 1. Ligando o Robô (Usando o apelido "lcp" que você criou)
meu_robo = lcp()

# 2. Criando o Paciente Fictício
paciente_joao = {
    "Falta_Ar": "sim",
    "Tosse_Sangue": "não",
    "Tosse": "sim",
    "Fadiga": "sim",
    "Alcoolismo": "não",
    "Chiado": "sim",
    "Idade": "50_a_70_anos",
    "Genero": "M",
    "Fumo": "fumante_ativo",
    "Freq_Respiratoria": "Anormal",  # <-- MUDE DE "Normal" PARA "Anormal"
    "Freq_Cardiaca": "Normal",
    "Pressao_Sistolica": "Anormal",
    "Pressao_Diastolica": "Normal",
    "IMC": "Normal",
    "Sat_Oxigenio": "Anormal"
}

print("Analisando o paciente João...")

# 3. Fazendo a Previsão
resultado_joao = meu_robo.prever(paciente_joao)

# 4. Mostrando o Resultado Final
print("\n=== RESULTADO FINAL ===")
print(f"Diagnóstico: {resultado_joao['Diagnostico']}")
print(f"Probabilidade de ser Câncer: {resultado_joao['Probabilidade']}")
print("=======================\n")