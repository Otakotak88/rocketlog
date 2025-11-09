# Rocketlog

Foi um projeto da RocketSeat onde o objetivo final era criar uma API de entregas, onde é possível a autenticação e autorização do usuário, criação, verificação de entregas e logs de uma entrega.

## Funcionalidades
- Cadastro de usuários com papel customer
- Autenticação do usuário

### Necessário Autenticação:
Customer
- Mostrar entregas do usuário
- Exibir logs de uma entrega

Sale
- Mostrar entregas do usuário
- Exibir logs de uma entrega
- Criar, atualizar e exibir todas entregas
- Criar logs para uma entrega

Admin
- Cadastro de usuários de qualquer papel
- Criar, atualizar e exibir todas entregas
- Criar logs para uma entrega
- Mostrar entregas do usuário
- Exibir logs de uma entrega

## Tecnologias
- Node.js
- Express.js
- Postgresql
- Typescript
- Prisma
- jest
- jsonwebtoken 
- zod

## Guia de instalação
git clone https://github.com/Otakotak88/rocketlog <br>
cd rocketlog <br>
npm install

## Testes
Antes de rodar os testes é necessário um banco de dados postgresql rodando, use o comando: <br>
docker-compose up -d

Para rodar os testes é necessário rodar o comando: <br>
npm run test:dev
