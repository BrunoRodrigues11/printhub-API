# 🖨️ PrintHub API

![Node.js](https://img.shields.io/badge/Node.js-v24-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-v5-lightgrey?style=for-the-badge&logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Ready-blue?style=for-the-badge&logo=postgresql)
![JWT](https://img.shields.io/badge/JWT-Auth-black?style=for-the-badge&logo=json-web-tokens)

**PrintHub API** é um sistema de backend (RESTful) desenvolvido para o gerenciamento centralizado de impressoras corporativas, controle de localidades (Sites) e gestão de usuários. A aplicação conta com um sistema robusto de autenticação e controle de acesso baseado em papéis (RBAC).

---

## 🚀 Funcionalidades

- **Gestão de Unidades (Sites):** Cadastro de localidades e matrizes corporativas.
- **Gestão de Equipamentos (Printers):** Controle detalhado de impressoras (Térmicas e Papel), incluindo número de série, IP, patrimônio e fila de impressão.
- **Gestão de Usuários:** Cadastro de usuários com senhas criptografadas.
- **Autenticação Segura:** Login baseado em Tokens JWT (JSON Web Tokens).
- **Controle de Acesso (RBAC):** Permissões divididas em `Admin`, `Analista` e `User`.
- **Regras de Negócio Integradas:**
  - Prevenção de e-mails duplicados.
  - Prevenção de duplicidade de números de série e patrimônio (Asset ID).
  - Lógica condicional para suprimentos (Toners vs. Impressoras Térmicas).

---

## 🛠️ Tecnologias Utilizadas

- **Linguagem & Runtime:** JavaScript / Node.js
- **Framework Web:** Express (v5)
- **Banco de Dados:** PostgreSQL (driver `pg`)
- **Segurança:** `bcrypt` (Hash de senhas), `jsonwebtoken` (Auth)
- **Gerenciador de Pacotes:** `pnpm`

---

## ⚙️ Arquitetura

O projeto segue o padrão MVC focado em separação de responsabilidades:
- **Routes:** Definição de endpoints e aplicação de middlewares (`auth`, `role`).
- **Controllers:** Interceptação de requisições, respostas HTTP e tratamento de erros.
- **Services:** Regras de negócio e comunicação direta com o banco de dados.

---

## 🏁 Como Rodar Localmente

### 1. Pré-requisitos
Certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (v18 ou superior)
- [PostgreSQL](https://www.postgresql.org/)
- [pnpm](https://pnpm.io/pt/) (`npm install -g pnpm`)

### 2. Instalação

Clone o repositório e instale as dependências:

```bash
git clone [https://github.com/BrunoRodrigues11/printhub-API](https://github.com/BrunoRodrigues11/printhub-API)
cd printhub_API
pnpm install
```

### 3. Configuração do Banco de Dados

Crie um banco de dados no PostgreSQL chamado `printhub` e rode o script SQL fornecido na pasta do projeto (ex: `database.sql`) para criar os `Enums` e as tabelas `sites`, `users` e `printers`.

### 4. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto. Adicione suas credenciais do PostgreSQL e uma chave secreta para o JWT:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/printhub"
NODE_ENV="development"
JWT_SECRET="sua_chave_secreta_super_segura_aqui"
PORT=3001
```

### 5. Executando a Aplicação

Para iniciar o servidor em modo de desenvolvimento (com auto-reload do Nodemon):

```bash
pnpm dev
```
A API estará rodando em: `http://localhost:3001`

---

## 🛣️ Rotas da API (Endpoints)

> **Dica de Fluxo:** Para testar, cadastre primeiro um `Site`, depois um `User` (atribuindo o ID do site), faça o `Login` para obter o Token, e então cadastre uma `Printer`.

### Autenticação
- `POST /api/users/login` - Retorna o Token JWT.

### Usuários (`/api/users`)
- `POST /` - Cria um novo usuário (Público).
- `GET /` - Lista usuários (Requer Auth: Admin/Analista).
- `GET /:id` - Busca usuário por ID (Requer Auth).
- `PUT /:id` - Atualiza usuário (Requer Auth: Admin).
- `DELETE /:id` - Exclui usuário (Requer Auth: Admin).

### Impressoras (`/api/printers`)
- `POST /` - Cadastra impressora (Requer Auth: Admin/Analista).
- `GET /` - Lista impressoras (aceita query `?status=Online` ou `?site_id=...`) (Requer Auth).
- `PUT /:id` - Atualiza impressora (Requer Auth: Admin/Analista).
- `DELETE /:id` - Exclui impressora (Requer Auth: Admin).

### Unidades / Sites (`/api/sites`)
- `POST /` - Cadastra localidade (Requer Auth: Admin).
- `GET /` - Lista localidades (Requer Auth).
- `PUT /:id` - Atualiza localidade (Requer Auth: Admin).
- `DELETE /:id` - Exclui localidade (Requer Auth: Admin).

---
*Desenvolvido com dedicação para otimização de infraestrutura de TI.*