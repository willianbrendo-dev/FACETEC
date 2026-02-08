# Guia de Deploy (Render + Supabase)

Este guia descreve como colocar o **Sistema Acadêmico** no ar.

## 1. Banco de Dados (Supabase)
O Render apaga dados locais (SQLite) ao reiniciar, por isso usamos o Supabase (PostgreSQL).

1.  Crie uma conta em [supabase.com](https://supabase.com/).
2.  Clique em **"New Project"**.
3.  Defina uma **Senha do Banco de Dados** (Salve-a!).
4.  Após criar, vá em **Project Settings** (ícone de engrenagem) -> **Database**.
5.  Em **Connection String**, selecione **Node.js**.
6.  Copie a string:
    `postgresql://postgres.xxxx:[SUA-SENHA]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
    *Substitua `[SUA-SENHA]` pela senha que você criou.*

## 2. Deploy no Render (Opção A: Automático)
O Render usa o arquivo `render.yaml` para configurar tudo.

1.  Crie uma conta em [render.com](https://render.com/).
2.  Vá em **"Blueprints"** -> **"New Blueprint Instance"**.
3.  Conecte seu repositório GitHub (`willianbrendo-dev/FACETEC`).
4.  Dê um nome e clique em **Update/Apply**.
5.  Preencha as variáveis:
    *   `DATABASE_URL`: A string do Supabase.
    *   `JWT_SECRET`: Uma senha qualquer.

---

## 3. Deploy no Render (Opção B: Manual)
**Se a Opção A falhar**, faça manualmente:

### Passo 3.1: Backend (API)
1.  No Render, clique em **New +** -> **Web Service**.
2.  Conecte o repositório.
3.  Configure:
    *   **Name**: `academic-backend`
    *   **Root Directory**: `server`
    *   **Environment**: `Node`
    *   **Build Command**: `npm install && npm run build`
    *   **Start Command**: `npm start`
4.  Em **Environment Variables**, adicione:
    *   `DATABASE_URL`: (Sua string do Supabase)
    *   `JWT_SECRET`: (Sua senha secreta)
    *   `PORT`: `10000`
5.  Clique em **Create Web Service**.

### Passo 3.2: Frontend (Site)
1.  No Render, clique em **New +** -> **Web Service**.
2.  Conecte o repositório.
3.  Configure:
    *   **Name**: `academic-frontend`
    *   **Root Directory**: deixe em branco (ou `.`)
    *   **Environment**: `Node`
    *   **Build Command**: `npm install && npm run build`
    *   **Start Command**: `npx serve -s dist -l $PORT`
4.  Clique em **Create Web Service**.

---

## 4. Conexão Final
Assim que o **Backend** estiver "Live" (Verde):

1.  Copie a URL dele (ex: `https://academic-backend.onrender.com`).
2.  Vá no serviço do **Frontend** -> **Environment**.
3.  Adicione a variável:
    *   `VITE_API_URL`: A URL do backend (sem a barra final).
4.  Salve. O Frontend vai reiniciar e conectar.
