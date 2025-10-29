# Goomer Menu API - desafio tecnico

API para gerenciamento de produtos, promoções e cardápio, construída com **Fastify**, **Zod** e documentada com **OpenAPI/Swagger**.

## Tecnologias

- [Fastify](https://www.fastify.io/) – web server rápido
- [Zod](https://zod.dev/) – validação de schemas
- [fastify-zod-openapi](https://github.com/vinissimus/fastify-zod-openapi) – documentação automática OpenAPI
- [PostgreSQL](https://www.postgresql.org/) – banco de dados relacional
- [pg](https://www.npmjs.com/package/pg) – cliente PostgreSQL para Node.js
- [pg-migrate](https://github.com/salsita/node-pg-migrate) – gerenciamento de migrations
- [Swagger UI](https://swagger.io/tools/swagger-ui/) – interface visual para documentação da API

## Como rodar (desenvolvido em linux debian based)

Instalar dependencias:
npm install

Iniciar servidor web:
npm run dev

Rode as migrations enviando um POST para:
localhost:3000/migrations

Rodar testes automatizados:
npm test

## Acessar documentacao swagger (visualizar endpoints)

suba o servidor web e acesse:
http://localhost:3000/docs
