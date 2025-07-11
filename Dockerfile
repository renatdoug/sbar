# Usa imagem oficial do Python
FROM python:3.11-slim

# Define diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto
COPY . .

# Instala dependências
RUN pip install --upgrade pip && \
    pip install -r backend/requirements.txt

# Expõe a porta do Django
EXPOSE 8000

# Comando padrão ao iniciar o container
CMD ["python", "backend/manage.py", "runserver", "0.0.0.0:8000"]
