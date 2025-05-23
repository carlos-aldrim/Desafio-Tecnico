# 🎥 Plataforma de Streaming - Full Stack App

Bem-vindo à **Plataforma de Vídeos**, uma aplicação Full Stack moderna, robusta e escalável que combina uma API RESTful com um frontend interativo. Essa plataforma foi pensada para oferecer uma experiência imersiva tanto para usuários comuns quanto administradores, com suporte a autenticação, controle de acesso, organização por categorias e muito mais.

## 🚀 Visão Geral

O sistema é dividido em dois ambientes:

* **Backend**: API RESTful construída com Node.js, Fastify, Prisma e PostgreSQL.
* **Frontend**: Interface SPA desenvolvida com Vue.js, TailwindCSS e Pinia.

---

## 🔧 Backend

### 🛠️ Tecnologias Utilizadas

* **Node.js**
  Utilizado como runtime principal do backend por sua leveza, performance assíncrona baseada em eventos e vasto ecossistema de pacotes. Permite alta escalabilidade e rápida manipulação de I/O, ideal para APIs modernas.

* **Fastify**
  Framework web leve e extremamente rápido, escolhido por sua performance superior ao Express e seu suporte nativo a plugins, tipagem com TypeScript, validação de esquemas com JSON Schema, e facilidade na criação de rotas RESTful bem estruturadas.

* **Prisma ORM**
  Selecionado por sua sintaxe declarativa e moderna, permite o mapeamento eficiente de entidades do banco de dados PostgreSQL para o código em JavaScript. Oferece migrações seguras, integração com TypeScript, e uma excelente experiência de desenvolvimento, além de gerar uma interface amigável para o banco.

* **PostgreSQL**
  Um dos bancos relacionais mais robustos e confiáveis do mercado. Sua escolha se deu pela compatibilidade com Prisma, consistência de dados, suporte a transações complexas e extensibilidade com JSON, arrays e funções definidas pelo usuário.

* **Jest**
  Framework de testes utilizado para garantir a qualidade do código por meio de testes unitários e de integração. Sua popularidade, simplicidade de uso e recursos como mocks automáticos e cobertura de código o tornam ideal para testar APIs Node.js.

* **K6**
  Ferramenta de testes de carga escolhida para avaliar a performance e a escalabilidade da API. Com ela é possível simular usuários simultâneos, medir latência e throughput, e identificar gargalos sob alto volume de requisições.

* **Swagger (OpenAPI)**
  Utilizado para documentação automática das rotas da API. Através da integração com Fastify e schemas JSON, fornece uma interface visual interativa em `http://localhost:3000/docs/ui`, facilitando testes, entendimento e uso da API por desenvolvedores externos.

* **JWT (JSON Web Token)**
  Implementado para autenticação segura e baseada em token. Com o JWT, é possível validar identidades e permissões do usuário em cada requisição, permitindo acesso controlado a recursos protegidos da API.

* **Structured Logging (com app.log)**
  Foi adotado para melhorar a observabilidade da aplicação. Os logs são organizados de forma estruturada no terminal e também persistidos no arquivo `app.log`, permitindo fácil análise de erros, rastreio de requisições e auditoria de ações críticas no sistema.

---

### 📑 Documentação da API

Acesse a documentação das rotas no formato OpenAPI via Swagger:

🔗 [`http://localhost:3000/docs/ui`](http://localhost:3000/docs/ui)

---

### 🔐 Autenticação

A API utiliza autenticação baseada em **JWT (Bearer Token)** para proteger rotas privadas e garantir o acesso apenas a usuários autorizados.

#### ✅ Funcionalidades:

* Geração e validação de **JWT** para autenticação segura.
* **Login e Cadastro** disponíveis para usuários comuns e administradores.
* **Segurança e Autenticação** para proteger rotas sensíveis.
* Compatível com ferramentas de testes como **Postman** e **Insomnia**.

#### 👤 Usuário Administrador Pré-configurado (para testes):

Ao iniciar o backend, um usuário administrador já está disponível com as seguintes credenciais:

* **Email:** `admin@admin.com`
* **Senha:** `admin123`

Esse usuário pode ser usado para testar as rotas protegidas, como criação de vídeos, categorias, e gerenciamento de usuários.

---

### 🧪 Como usar o JWT no Postman (Passo a Passo)

1. **Realize o login:**

   * Envie uma requisição `POST` para o endpoint `/login` (ou `/auth/login`, conforme definido no seu backend).
   * No **Body**, selecione `raw` e `JSON`, e insira as credenciais do admin:

     ```json
     {
       "email": "admin@admin.com",
       "password": "admin123"
     }
     ```

2. **Receba o token:**

   * A resposta será um objeto contendo o token JWT:

     ```json
     {
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     }
     ```

3. **Copie o token JWT.**

4. **Use o token nas requisições protegidas:**

   * Vá até a aba **Authorization** da nova requisição.
   * Em **Type**, selecione **Bearer Token**.
   * No campo abaixo, cole o token JWT copiado anteriormente.

   Exemplo:

   ```
   Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

5. **Envie a requisição:**

   * Agora você pode acessar rotas protegidas como:

     * `POST /videos`
     * `DELETE /categories/:id`
     * `GET /users`
     * etc.

### 🔐 Observações:

* O token tem validade (conforme configurado no backend). Após esse tempo, será necessário realizar login novamente para obter um novo token.
* As rotas públicas (ex: login e register) não requerem autenticação.
* Tokens inválidos ou expirados resultarão em erros `401 Unauthorized`.

---

### 📚 Rotas Disponíveis na API

#### 🔐 Autenticação

* **POST `/login`**
  Autentica um usuário existente e retorna um token JWT.

* **POST `/users`**
  Registra um novo usuário na plataforma.

### 👤 Usuários

* **GET `/users`**
  Lista todos os usuários cadastrados. *(Requer autenticação)*

* **GET `/users/:id`**
  Obtém detalhes de um usuário específico pelo ID. *(Requer autenticação)*

* **PUT `/users/:id`**
  Atualiza informações de um usuário específico. *(Requer autenticação)*

* **DELETE `/users/:id`**
  Remove um usuário do sistema. *(Requer autenticação)*

* **GET `/profile`**
  Mostra o perfil logado. *(Requer autenticação)*

* **GET `/admins`**
  Lista todos os usuários adminstradores cadastrados. *(Requer autenticação)*

### 🎬 Vídeos

* **GET `/videos`**
  Retorna uma lista de vídeos disponíveis na plataforma.

* **GET `/videos/:id`**
  Obtém detalhes de um vídeo específico pelo ID.

* **POST `/videos`**
  Adiciona um novo vídeo à plataforma. *(Requer autenticação)*

* **PUT `/videos/:id`**
  Atualiza informações de um vídeo existente. *(Requer autenticação)*

* **DELETE `/videos/:id`**
  Remove um vídeo da plataforma. *(Requer autenticação)*

### 🗂️ Categorias

* **GET `/categories`**
  Lista todas as categorias disponíveis.

* **GET `/categories/:id`**
  Obtém detalhes de uma categoria específica pelo ID.

* **POST `/categories`**
  Cria uma nova categoria. *(Requer autenticação)*

* **PUT `/categories/:id`**
  Atualiza informações de uma categoria existente. *(Requer autenticação)*

* **DELETE `/categories/:id`**
  Remove uma categoria do sistema. *(Requer autenticação)*

### 💬 Comentários

* **GET `/videos/:id/comments`**
  Lista todos os comentários associados a um vídeo específico.

* **POST `/videos/:id/comments`**
  Adiciona um novo comentário a um vídeo. *(Requer autenticação)*

* **DELETE `/comments/:id`**
  Remove um comentário específico. *(Requer autenticação)*

---

### 🗃️ Banco de Dados

* O projeto utiliza **PostgreSQL** como sistema de gerenciamento de banco de dados relacional, conhecido por sua robustez, segurança e alta compatibilidade com aplicações em produção.
* O gerenciamento das tabelas, relações e migrations é feito com **Prisma ORM**, que oferece uma interface declarativa, intuitiva e tipada para manipulação dos dados, além de facilitar a integração com o código Node.js.
* Durante o desenvolvimento, é possível utilizar o **Prisma Studio**, uma interface visual acessível via navegador que permite visualizar e editar os dados diretamente do banco de maneira prática.
* A modelagem do banco segue uma estrutura lógica bem definida, com **relacionamentos claros entre entidades como usuários, vídeos, categorias e comentários**.

📊 **Documentação Visual Completa:**

🔗 [Acesse os Diagramas UML, ERD e Arquitetura (Draw.io e Structurizr DSL)](https://drive.google.com/file/d/1uKB1a6dRWUrRfOsi1hE4JHRrBtrGsozZ/view?usp=sharing)

Esse material contém:

* 📌 **Diagramas UML**: Comportamento e estrutura dos modelos principais da aplicação.
* 🧩 **ERD (Entity Relationship Diagram)**: Diagrama de entidades e seus relacionamentos, facilitando a compreensão da lógica do banco.
* 🏗️ **Estrutura de Arquitetura em Structurizr DSL (Draw\.io)**: Visualização da arquitetura da aplicação — separação de camadas, fluxos entre frontend, backend, banco de dados e serviços auxiliares — útil para desenvolvedores e arquitetos de software que desejam entender a visão geral do sistema.

Essa documentação é essencial para quem deseja contribuir com o projeto ou apenas compreendê-lo melhor em termos técnicos.

### 🗂️ Representação ERD

<p align="center">
  <img src="https://github.com/user-attachments/assets/c458bc13-f091-4c8f-864e-8535e53f5d48" alt="Representação ERD" width="600"/>
</p>

<p align="center"><em>Figura 1: Diagrama ERD (Entity-Relationship Diagram)</em></p>

---

### 📐 Representação UML

<p align="center">
  <img src="https://github.com/user-attachments/assets/a9eeaa21-bcd9-4924-b1ac-3c2f29b40887" alt="Representação UML" width="600"/>
</p>

<p align="center"><em>Figura 2: Diagrama UML com classes e relacionamentos</em></p>

---

### 🏛️ Apresentação da Arquitetura

<p align="center">
  <img src="https://github.com/user-attachments/assets/f8987e47-d90e-483e-bb00-428ffb49a115" alt="Apresentação da Arquitetura" width="600"/>
</p>

<p align="center"><em>Figura 3: Arquitetura da aplicação (Backend e Frontend)</em></p>

---

### 📈 Observabilidade

* Logs estruturados para atividades da API.
* Métricas detalhadas no terminal.
* Armazenamento em `app.log` para auditoria e monitoramento.

---

## 💻 Frontend

A interface da aplicação foi desenvolvida com foco em modernidade, interatividade e escalabilidade, utilizando as seguintes tecnologias:

### 🧰 Tecnologias Utilizadas

* **Vue.js**
  Framework progressivo para construção de interfaces dinâmicas e reativas, baseado em componentes reutilizáveis. Ideal para aplicações do tipo SPA (Single Page Application).

* **Tailwind CSS**
  Framework de utilitários para construção de interfaces modernas e responsivas diretamente na marcação HTML. Facilita a criação de layouts elegantes com agilidade.

* **Pinia**
  Biblioteca oficial de gerenciamento de estado do Vue. Permite centralizar e controlar o estado global da aplicação de maneira eficiente, com integração ao Composition API.

* **i18n (Internationalization)**
  Suporte à internacionalização, permitindo a exibição da interface em múltiplos idiomas. Nesta aplicação, estão disponíveis os idiomas **Português** e **Inglês**.

---

### 👨‍💻 Funcionalidades

#### Usuários:

* Tela de **Login** e **Cadastro**.
* **Autenticação JWT** integrada ao backend.
* Interface personalizada e responsiva.
* Acesso a vídeos por **categoria**.
* Adição de **comentários** e **reações**.
* Gerenciamento de conta (editar perfil, logout, excluir conta).

#### Administradores:

* Tudo que um usuário comum pode fazer, mais:

  * Criar, editar e excluir **vídeos**.
  * Gerenciar **categorias**.
  * Cadastrar e remover **usuários**.

### 🎨 Interface

* Design moderno, interativo e chamativo.
* Barra de navegação dinâmica com acesso às seções principais:

  * **Início**
  * **Vídeos**
  * **Categorias**
  * **Usuários**
  * **Gerenciamento (Admin)**

### 📺 Funcionalidade dos Vídeos

* Lista de vídeos com:

  * Título
  * Descrição
  * Categoria
  * Botão **Assistir** que redireciona para a URL configurada pelo administrador.

* Comentários e interações disponíveis para cada vídeo selecionado.

---

## 🧪 Testes

* **Testes unitários e de integração com Jest**.
* **Testes de carga com K6**, simulando múltiplas requisições para avaliar performance da API.

Aqui está a continuação do seu documento, com a **imagem 4** centralizada, acompanhada de legenda e formatação consistente com as demais seções:

### 🧪 Execução de Todos os Testes

<p align="center">
  <img src="https://github.com/user-attachments/assets/f47995d0-806f-4212-8405-6aaeb505fc50" alt="Execução dos Testes" width="600"/>
</p>

<p align="center"><em>Figura 4: Execução de todos os testes unitários e de integração no terminal</em></p>

### 🧪 Como Rodar os Testes via Terminal

### 🔧 Acesse o diretório do backend

```bash
cd backend
```

---

### ✅ Testes Unitários

Executa os testes unitários utilizando o Jest:

```bash
npm test unit
```

> 🔍 *Valida o funcionamento isolado de cada função ou componente da aplicação.*

---

### 🔄 Testes de Integração

Executa os testes que verificam a comunicação entre os módulos da aplicação:

```bash
npm test integration
```

> 🔗 *Garante que os componentes funcionam corretamente em conjunto, como rotas, banco de dados e controladores.*

---

### ⚙️ Testes de Carga com K6

Simula múltiplas requisições para avaliar a performance da API.

#### ▶️ Rodar todos os testes de carga de uma vez:

```bash
Get-ChildItem -Path tests-k6 -Filter *.js | ForEach-Object { k6 run $_.FullName }
```

#### 🧪 Rodar testes de carga individualmente:

```bash
k6 run tests-k6/user-load-test.js
k6 run tests-k6/category-load-test.js
k6 run tests-k6/video-load-test.js
k6 run tests-k6/comment-load-test.js
```

> 📈 *Avalia a escalabilidade e estabilidade da aplicação sob alto tráfego.*

---

## 🗂️ Organização do Projeto

### Estrutura Backend (Node.js)

```
📦 backend/
 ┣ 📂logs/
 ┃ ┗ 📄app.log
 ┣ 📂src/
 ┃ ┣ 📂modules/
 ┃ ┣ 📂router/
 ┃ ┣ 📂middlewares/
 ┃ ┣ 📂utils/
 ┃ ┣ 📂validators/
 ┃ ┗ 📂prisma/
 ┣ 📄app.js
 ┣ 📄otel.js
 ┗ 📄server.js
```

### Estrutura Frontend (Vue.js)

```
📦 frontend/
 ┣ 📂config/
 ┣ 📂assets/
 ┣ 📂router/
 ┣ 📂components/
 ┣ 📂views/
 ┣ 📂store/
 ┣ 📂locales/
 ┣ 📄App.vue
 ┣ 📄i18n.js
 ┗ 📄main.js
```

---

## 🌐 Internacionalização

* A plataforma está disponível nos idiomas:

  * 🇧🇷 Português
  * 🇺🇸 Inglês

---

## 🏁 Como Rodar o Projeto

### Backend

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

> ⚠️ **Atenção**: no diretório `backend`, é necessário configurar um arquivo `.env` com as seguintes variáveis de ambiente:
>
> * `JWT_SECRET`: chave secreta usada para geração e validação de tokens JWT.
> * `DATABASE_URL`: URL de conexão com o banco de dados (usada pelo Prisma).
> * `API_BASE`: URL base da API, utilizada especialmente durante os **testes de carga**, então **configure com atenção** conforme o ambiente (local, staging, produção, etc).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

> ⚠️ **No diretório `frontend`**, configure a variável `VITE_API_BASE` no arquivo `.env` para definir a URL base da API que será consumida pela aplicação frontend.

---

### Banco de Dados

```bash
cd backend
npx prisma studio
```

> Esse comando abre uma interface visual para gerenciar os dados diretamente no banco via Prisma Studio.

---

Claro! Aqui está o conteúdo atualizado com a nova seção sobre o deploy, já integrado com as outras instruções:

---

## 🏁 Como Rodar o Projeto

### Backend

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

> ⚠️ **Atenção**: no diretório `backend`, é necessário configurar um arquivo `.env` com as seguintes variáveis de ambiente:
>
> * `JWT_SECRET`: chave secreta usada para geração e validação de tokens JWT.
> * `DATABASE_URL`: URL de conexão com o banco de dados (usada pelo Prisma).
> * `API_BASE`: URL base da API, utilizada especialmente durante os **testes de carga**, então **configure com atenção** conforme o ambiente (local, staging, produção, etc).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

> ⚠️ **No diretório `frontend`**, configure a variável `VITE_API_BASE` no arquivo `.env` para definir a URL base da API que será consumida pela aplicação frontend.

---

### Banco de Dados

```bash
cd backend
npx prisma studio
```

> Esse comando abre uma interface visual para gerenciar os dados diretamente no banco via Prisma Studio.

---

## ☁️ Acesso ao Projeto Implantado (Deploy)

A estrutura completa do projeto já foi implantada em ambiente de produção. Você pode acessar e testar diretamente pelos links abaixo, **sem a necessidade de executar o código localmente**:

* 🔗 **Backend (API)**: [https://streaming-api-cgj5.onrender.com](https://streaming-api-cgj5.onrender.com)
* 🌐 **Frontend (Interface do Usuário)**: [https://streaming-frontend-g5a0.onrender.com](https://streaming-frontend-g5a0.onrender.com)

> 💡 Ideal para testes, demonstrações e validação rápida da aplicação.

---

## 📫 Autor

Caso tenha dúvidas, sugestões ou queira colaborar:

**Autor:** Carlos Aldrim

📧 Email: [carlosaldrimfilho@gmail.com](carlosaldrimfilho@gmail.com)

🔗 GitHub: [@carlos-aldrim](https://github.com/carlos-aldrim)