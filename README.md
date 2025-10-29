# Goomer Menu API – Desafio Técnico

API para gerenciamento de **produtos**, **promoções** e **cardápio**, construída com **Fastify**, **Zod** e documentada com **OpenAPI/Swagger**.

---

## Tecnologias

- [Fastify](https://www.fastify.io/) – servidor web rápido e leve
- [Zod](https://zod.dev/) – validação de schemas
- [fastify-zod-openapi](https://github.com/vinissimus/fastify-zod-openapi) – documentação OpenAPI automática
- [PostgreSQL](https://www.postgresql.org/) – banco de dados relacional
- [pg](https://www.npmjs.com/package/pg) – cliente PostgreSQL para Node.js
- [pg-migrate](https://github.com/salsita/node-pg-migrate) – gerenciamento de migrations
- [Swagger UI](https://swagger.io/tools/swagger-ui/) – interface visual para documentação da API

---

## Como rodar (Linux Debian-based)

### Instalar dependências

Instalar dependências:

```bash
npm install
```

Iniciar servidor web:

```bash
npm run dev
```

Com o servidor web on, rode as migrations enviando um POST para:
localhost:3000/migrations

Dica: abra um novo terminal e execute:

```bash
curl -X POST http://localhost:3000/migrations
```

Rodar testes automatizados:

```bash
npm test
```

## Acessar documentação Swagger (visualizar endpoints)

Suba o servidor web e acesse:
[http://localhost:3000/docs](http://localhost:3000/docs)
