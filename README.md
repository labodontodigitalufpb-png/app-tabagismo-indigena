# Tabaco Controle

Este repositorio e do projeto **Tabaco Controle** (nao e o projeto Ybytu Livre).

Aplicacao React + Vite para registro de casos e envio dos dados para Google Sheets.

## Rodando localmente

```bash
npm install
npm run dev
```

## Integracao com Google Sheets

O app ja possui um botao `Enviar todos para Google Sheets` e faz um `POST` para uma URL de Google Apps Script.

### 1. Configurar a URL no front-end

Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/SEU_DEPLOYMENT_ID/exec
```

Existe um exemplo em [.env.example](/Users/paulobonan/Documents/Universidades/UFPB/pesquisa/projetos/Tabagismo geral/tabaco/.env.example).

### 2. Criar a planilha

No Google Sheets, crie uma planilha e uma aba chamada, por exemplo, `Respostas`.

### 3. Criar o Apps Script

No menu da planilha:

`Extensoes` -> `Apps Script`

Cole o codigo de [Code.gs](/Users/paulobonan/Documents/Universidades/UFPB/pesquisa/projetos/Tabagismo geral/tabaco/google-apps-script/Code.gs) no editor do Apps Script.

### 4. Publicar

No Apps Script:

`Implantar` -> `Nova implantacao` -> `Aplicativo da Web`

Use algo como:

- Executar como: `Voce`
- Quem tem acesso: `Qualquer pessoa`

Depois copie a URL `/exec` e coloque no `.env`.

O projeto ja vem com um `.env` criado usando a URL que estava configurada anteriormente no app. Se voce publicar uma nova implantacao no seu Google Sheets, substitua esse valor.

### 5. Enviar os dados

1. Salve um ou mais casos no app.
2. Clique em `Enviar todos para Google Sheets`.
3. Verifique se as linhas apareceram na planilha.

## Observacao

Os casos continuam sendo guardados localmente no navegador via `localStorage` ate serem removidos manualmente.
