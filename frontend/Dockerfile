# Estágio 1: Build da Aplicação Vite
FROM node:20-alpine AS build

WORKDIR /app

# Copia dependências e instala
COPY package*.json ./
RUN npm ci

# Copia o código-fonte e gera os arquivos estáticos de produção
COPY . .
RUN npm run build

# Estágio 2: Execução com Nginx leve
FROM nginx:alpine

# Copia os arquivos gerados no build para a pasta estática do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia as configurações do Nginx para tratar o roteamento do React
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]