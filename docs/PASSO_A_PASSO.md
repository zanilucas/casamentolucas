# Site de casamento - passo a passo

Este projeto foi criado em `C:\site_casamento` com Next.js, React, TailwindCSS, API Routes, Supabase e Mercado Pago Checkout Pro.

## 1. Rodar localmente

1. Abra o PowerShell.
2. Entre na pasta:

```powershell
cd C:\site_casamento
```

3. Instale as dependencias, se ainda nao estiverem instaladas:

```powershell
npm install
```

4. Copie o arquivo de ambiente:

```powershell
Copy-Item .env.example .env.local
```

5. Abra `C:\site_casamento\.env.local` e preencha as chaves reais.
6. Rode o projeto:

```powershell
npm run dev
```

7. Abra no navegador:

```text
http://localhost:3000
```

## 2. Foto principal do casal

1. Escolha uma foto vertical bonita dos noivos.
2. Renomeie o arquivo para `casal.jpg`.
3. Coloque a imagem dentro desta pasta:

```text
C:\site_casamento\public
```

O site usa automaticamente `public\casal.jpg` na pagina inicial.

## 3. Configurar Supabase

1. Acesse `https://supabase.com`.
2. Crie um projeto novo.
3. No menu lateral, abra `SQL Editor`.
4. Crie uma nova query.
5. Cole todo o conteudo de:

```text
C:\site_casamento\supabase\schema.sql
```

6. Clique em `Run`.
7. Va em `Project Settings` > `API`.
8. Copie:

```text
Project URL
service_role key
```

9. Cole no `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
SUPABASE_SERVICE_ROLE_KEY=SUA_SERVICE_ROLE_KEY
```

Importante: nunca coloque a `service_role key` em arquivos publicos nem no frontend.

## 4. Configurar Mercado Pago Checkout Pro

1. Acesse `https://www.mercadopago.com.br/developers`.
2. Entre em `Suas integracoes`.
3. Crie uma aplicacao.
4. Copie o `Access Token`.
5. Para testes, use primeiro o token de teste.
6. Cole no `.env.local`:

```env
MERCADO_PAGO_ACCESS_TOKEN=SEU_ACCESS_TOKEN
```

7. Quando publicar na Vercel, defina:

```env
NEXT_PUBLIC_APP_URL=https://seu-site.vercel.app
```

O webhook ja esta configurado no codigo em:

```text
https://seu-site.vercel.app/api/payments/webhook
```

## 5. Configurar senha do painel admin

No `.env.local`, altere:

```env
ADMIN_PASSWORD=uma-senha-forte
ADMIN_SESSION_SECRET=um-texto-grande-aleatorio
```

Depois acesse:

```text
http://localhost:3000/admin
```

## 6. Publicar na Vercel

1. Crie uma conta em `https://vercel.com`.
2. Instale o Git se ainda nao tiver: `https://git-scm.com/download/win`.
3. Abra o PowerShell:

```powershell
cd C:\site_casamento
git init
git add .
git commit -m "MVP site casamento"
```

4. Envie para um repositorio GitHub.
5. Na Vercel, clique em `Add New Project`.
6. Importe o repositorio.
7. Em `Environment Variables`, cadastre as mesmas variaveis do `.env.local`.
8. Clique em `Deploy`.

## 7. Arquivos principais

- `src\app\page.tsx`: pagina inicial.
- `src\app\rsvp\page.tsx`: formulario RSVP.
- `src\app\presentes\page.tsx`: lista de presentes.
- `src\app\admin\page.tsx`: painel administrativo.
- `src\app\api\rsvp\route.ts`: salva RSVP no Supabase.
- `src\app\api\payments\create-preference\route.ts`: cria pagamento no Mercado Pago.
- `src\app\api\payments\webhook\route.ts`: recebe confirmacoes do Mercado Pago.
- `supabase\schema.sql`: tabelas do banco.
- `.env.example`: modelo das variaveis secretas.
