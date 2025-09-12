# [FinTrack - Gerenciador de orçamento]
<!-- EXEMPLO: "AtendeAí — Fila de Ajuda em Sala" -->

## 1) Problema
<!--  A gestão das finanças pessoais pode ser estressante. Muitas pessoas perdem o controle de seus gastos e têm dificuldade em lembrar para onde foi seu dinheiro. Para isso criarei um sistema que registra gastos e rendas de cada usuário, em uma interface simples e privada, 
para que registrem suas transações financeiras, as categorizem, e visualizem um resumo de suas despesas e receitas. -->
-A gestão das finanças pessoais pode ser estressante. Muitas pessoas perdem o controle de seus gastos e têm dificuldade em lembrar para onde foi seu dinheiro. Para isso criarei um sistema que registra gastos e rendas de cada usuário, em uma interface simples e privada, 
para que registrem suas transações financeiras, as categorizem, e visualizem um resumo de suas despesas e receitas.

## 2) Atores e Decisores (quem usa / quem decide)
<!-- Liste papéis (não nomes).
     EXEMPLO:
     Usuários principais: Alunos da turma de Desenvolvimento Web
     Decisores/Apoiadores: Professores da disciplina; Coordenação do curso -->
-Usuários principais: Usuários. 
-Decisores/Apoiadores: Cliente. 

## 3) Casos de uso (de forma simples)
<!-- Formato "Ator: ações que pode fazer".
     DICA: Use "Manter (inserir, mostrar, editar, remover)" quando for CRUD.
     EXEMPLO:
     Todos: Logar/deslogar do sistema; Manter dados cadastrais
     Professor: Manter (inserir, mostrar, editar, remover) todos os chamados
     Aluno: Manter (inserir, mostrar, editar, remover) seus chamados -->
-Todos: Registrar uma conta no sistema, fazer login no sistema Usuário individual: Fazer logout do sistema, manter (visualizar, editar, excluir) os próprios dados cadastrais, manter (inserir, visualizar, editar, remover) suas transações financeiras, Visualizar um dashboard com o resumo financeiro (Total de Receitas, Total de Despesas, Saldo Líquido), filtrar e visualizar transações por categoria ou período.  

## 4) Limites e suposições
<!-- Simples assim:
     - Limites = regras/prazos/obrigações que você não controla.
     - Suposições = coisas que você espera ter e podem falhar.
     - Plano B = como você segue com a 1ª fatia se algo falhar.
     EXEMPLO:
     Limites: entrega final até o fim da disciplina (ex.: 2025-11-30); rodar no navegador; sem serviços pagos.
     Suposições: internet no laboratório; navegador atualizado; acesso ao GitHub; 10 min para teste rápido.
     Plano B: sem internet → rodar local e salvar em arquivo/LocalStorage; sem tempo do professor → testar com 3 colegas. -->
- Limites: prazo final de entrega previsto pela disciplina, autenticação de usuário,  proteção CSRF, cookies seguros e validação server-side, sem serviços pagos, uso de tecnologias web, com um backend e um banco de dados, rodar em navegador atualizado.
- Suposições: O usuário possui conexão com a internet  
- Plano B: A aplicação deve ser capaz de rodar inteiramente em um ambiente local (localhost).

## 5) Hipóteses + validação
<!-- Preencha as duas frases abaixo. Simples e direto.
     EXEMPLO Valor: Se o aluno ver sua posição na fila, sente mais controle e conclui melhor a atividade.
     Validação: teste com 5 alunos; sucesso se ≥4 abrem/fecham chamado sem ajuda.
     EXEMPLO Viabilidade: Com app no navegador (HTML/CSS/JS + armazenamento local),
     criar e listar chamados responde em até 1 segundo na maioria das vezes (ex.: 9 de cada 10).
     Validação: medir no protótipo com 30 ações; meta: pelo menos 27 de 30 ações (9/10) em 1s ou menos. -->
- H-Valor: Se um usuário registrar consistentemente suas transações de ganhos e gastos, então sua compreensão sobre seu estado financeiro melhora em clareza, facilitando o gerenciamento financeiro.  
- Validação (valor): O usuário de teste (avaliador) deve conseguir realizar o fluxo completo de: a. Logar, b. Adicionar uma nova transação de receita e uma de despesa, c. Visualizar o dashboard e identificar corretamente o saldo resultante, d. Editar uma transação.
-H-Viabilidade: Com a arquitetura SSR (Server-Side Rendering) utilizando Node.js/Express + EJS + mysql.  
- Validação (viabilidade): Medição manual do tempo de carregamento completo da página (Ferramenta "Network" do DevTools, métrica "Load" ou "Finish") 
- meta: 9 em cada 10 carregamentos de página (90%) são completados em 1 segundo ou menos.

## 6) Fluxo principal e primeira fatia
<!-- Pense “Entrada → Processo → Saída”.
     EXEMPLO de Fluxo:
     1) Aluno faz login
     2) Clica em "Pedir ajuda" e descreve a dúvida
     3) Sistema salva e coloca na fila
     4) Lista mostra ordem e tempo desde criação
     5) Professor encerra o chamado
     EXEMPLO de 1ª fatia:
     Inclui login simples, criar chamado, listar em ordem.
     Critérios de aceite (objetivos): criar → aparece na lista com horário; encerrar → some ou marca "fechado". -->
**Fluxo principal (curto):**  
1) Usuário autenticado visualiza sua lista de transações. 
2) Clica em "Adicionar Transação" e preenche o formulário.  
3) Sistema valida e salva os dados.  
4) A página é atualizada, mostrando a nova transação na lista e o saldo do dashboard é recalculado.

**Primeira fatia vertical (escopo mínimo):**  
- Inclui: Autenticação básica (registro + login), tela de listagem de transações (vazia inicialmente), funcionalidade de criar uma transação, cálculo e exibição do saldo simples (Income - Expenses).  
- Critérios de aceite:
<!-- Ao criar uma transação do tipo 'income', ela deve aparecer imediatamente na lista de   transações e o valor do "Total Income" no dashboard deve aumentar correspondentemente.

Ao criar uma transação do tipo 'expense', ela deve aparecer imediatamente na lista de transações e o valor do "Total Expenses" no dashboard deve aumentar, resultando em uma diminuição do "Net Balance".
-->
1) Ao criar uma transação do tipo 'income', ela deve aparecer imediatamente na lista de   transações e o valor do "Total Income" no dashboard deve aumentar correspondentemente.
2) Ao criar uma transação do tipo 'expense', ela deve aparecer imediatamente na lista de transações e o valor do "Total Expenses" no dashboard deve aumentar, resultando em uma diminuição do "Net Balance".

## 7) Esboços de algumas telas (wireframes)
<!-- Vale desenho no papel (foto), Figma, Excalidraw, etc. Não precisa ser bonito, precisa ser claro.
     EXEMPLO de telas:
     • Login
     • Lista de chamados (ordem + tempo desde criação)
     • Novo chamado (formulário simples)
     • Painel do professor (atender/encerrar)
     EXEMPLO de imagem:
     ![Wireframe - Lista de chamados](img/wf-lista-chamados.png) -->
[Links ou imagens dos seus rascunhos de telas aqui]

## 8) Tecnologias
<!-- Liste apenas o que você REALMENTE pretende usar agora. -->
- HTML + CSS (com Bootstrap opcional)
- JavaScript no cliente (scripts leves de interação)
- Node.js + Express + EJS (SSR) no servidor
- MySQL (banco de dados)

### 8.1 Navegador
**Navegador:** HTML/CSS/JS Bootstrap, se houver
**Armazenamento local (se usar):** LocalStorage/IndexedDB/— 
**Hospedagem:** Railway possivelmente

### 8.2 Front-end (servidor de aplicação, se existir)
**Front-end (servidor):** Node.js + Express (SSR) 
**Hospedagem:** Railway (suporte a Node.js e banco de dados MySQL, integração com GitHub)

### 8.3 Back-end (API/servidor, se existir)
**Back-end (API):** Node.js + Express (SSR)  
**Banco de dados:** MySQL.  
**Deploy do back-end:** Render ou Railway

## 9) Plano de Dados (Dia 0) — somente itens 1–3
<!-- Defina só o essencial para criar o banco depois. -->

### 9.1 Entidades
<!-- EXEMPLO:
     - Usuario — pessoa que usa o sistema (aluno/professor)
     - Chamado — pedido de ajuda criado por um usuário 
     Duas tabelas principais: Usiário e Transações
     (adicionarei depois outra entidade "categorias")
-->
- Users — Armazena as informações dos usuários do sistema.
- Transactions — Registra todas as operações financeiras (receitas e despesas) dos usuários.
- [Entidade 3] — [...]

### 9.2 Campos por entidade
<!-- Use tipos simples: uuid, texto, número, data/hora, booleano, char. -->

### Usuario
| Campo           | Tipo                          | Obrigatório | Exemplo            |
|-----------------|-------------------------------|-------------|--------------------|
| id              | número                        | sim         | 1                  |
| username            | texto                         | sim         | "Ana Souza"        |
| email           | texto                         | sim (único) | "ana@exemplo.com"  |
| password_hash      | texto                         | sim         | "$2a$10$..."       |
| created_at           | data/hora                  | sim         | 2025-08-20 12:30     |
| updated_at     | data/hora                     | sim         | 2025-08-20 14:30   |

### Transações
| Campo           | Tipo               | Obrigatório | Exemplo                 |
|-----------------|--------------------|-------------|-------------------------|
| id              | número             | sim         | 2                       |  
| user_id         | número (fk)        | sim         | 8f3a-...                |
| amount          | decimal            | sim         | 150.50                  |
| description     | texto              | não         | "Supermercado"          |
| type            | texto (enum)       | sim         | "expense"               |   
| category        | texto              | sim         | food                    |
| date            | data               | sim         | 2025-08-20              |
| created_at      | data/hora          | sim         | 2025-08-20 14:35        |
| updated_at      | data/hora          | sim         | 2025-08-20 14:50        |

### 9.3 Relações entre entidades
<!-- Frases simples bastam. EXEMPLO:
     Um Usuario tem muitos Chamados (1→N).
     Um Chamado pertence a um Usuario (N→1). -->
- Um User tem muitas Transactions. (1→N)
- Uma Transaction pertence a um User. (N→1)

### 9.4 Modelagem do banco de dados no MYSQL

```sql
CREATE TABLE users (
  id               INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username         VARCHAR(255) NOT NULL UNIQUE,
  email            VARCHAR(255) NOT NULL UNIQUE,
  password_hash    VARCHAR(255) NOT NULL,
  created_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
  id               INT            NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id          INT            NOT NULL,
  amount           DECIMAL(10, 2) NOT NULL,
  description      TEXT,
  type             ENUM('income', 'expense') NOT NULL,
  category         VARCHAR(255),
  date             DATE           NOT NULL,
  created_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);




INSERT INTO users (nome, email, password_hash) VALUES
('Usuário', 'user@user.com.br', '123');

INSERT INTO transactions (user_id, amount, description, type, category, date)  VALUES
(1, 2500.00, 'Salário mensal', 'income', 'Salário', '2025-08-25'),
(1, 150.50, 'Supermercado semanal', 'expense', 'Alimentação', '2025-08-26'),
```
