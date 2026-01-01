#!/bin/bash
# Script para Linux/Mac: Para o servidor

if command -v docker-compose &> /dev/null; then
    docker-compose down
    echo "Servidor parado."
else
    echo "Docker Compose não encontrado."
fi