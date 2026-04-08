# Ybytu Livre

Aplicativo React + Capacitor para coleta de dados relacionados ao uso de tabaco em contexto indigena, com armazenamento local no dispositivo e envio posterior em lote para Google Sheets via Google Apps Script.

## Executar o app

```bash
npm install
npm run dev
```

## Configuracao do Apps Script

O endpoint de envio nao fica mais fixo no codigo. Configure a URL do web app com um arquivo `.env.local`:

```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/SEU_DEPLOY_ID/exec
```

Um exemplo base esta em [.env.example](/Users/paulobonan/Documents/Universidades/UFPB/pesquisa/projetos/Tabagismo Indigena/app-tabagismo/.env.example).

## Deploy no Netlify

O projeto ja esta preparado para deploy web no Netlify com [netlify.toml](/Users/paulobonan/Documents/Universidades/UFPB/pesquisa/projetos/Tabagismo Indigena/app-tabagismo/netlify.toml).

Configuracao esperada:

- Build command: `npm run build`
- Publish directory: `dist`
- Node: `20`

Antes de publicar, configure no painel do Netlify a variavel de ambiente:

```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/SEU_DEPLOY_ID/exec
```

Depois de salvar a variavel, rode um novo deploy no Netlify para embutir a URL no frontend.

## Backend do Google Sheets

O backend pronto para publicar na conta do laboratorio esta em [apps-script/README.md](/Users/paulobonan/Documents/Universidades/UFPB/pesquisa/projetos/Tabagismo Indigena/app-tabagismo/apps-script/README.md).

Arquivos principais:

- [apps-script/Code.gs](/Users/paulobonan/Documents/Universidades/UFPB/pesquisa/projetos/Tabagismo Indigena/app-tabagismo/apps-script/Code.gs)
- [apps-script/appsscript.json](/Users/paulobonan/Documents/Universidades/UFPB/pesquisa/projetos/Tabagismo Indigena/app-tabagismo/apps-script/appsscript.json)
