#!/bin/bash
# Script para Linux/Mac: Inicia o servidor com Docker

if ! command -v docker &> /dev/null; then
    echo "Docker não está instalado. Instale o Docker primeiro."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose não está instalado. Instale o Docker Compose primeiro."
    exit 1
fi

echo "Construindo e iniciando o container..."
docker-compose up --build

echo "Servidor rodando em http://localhost:8080"
echo "Pressione Ctrl+C para parar."