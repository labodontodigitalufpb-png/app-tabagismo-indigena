# Apps Script do Laboratorio (Tabaco Controle)

Esta pasta contem o backend Google Apps Script para receber os casos enviados pelo app e gravar tudo em uma planilha do laboratorio.

Este material pertence ao projeto **Tabaco Controle**.

## Arquivos

- `Code.gs`: endpoint web (`doGet` e `doPost`) que recebe o `payload` do app.
- `appsscript.json`: manifesto do projeto Apps Script.

## Como criar o projeto na conta do laboratorio

1. Entre na conta Google do laboratorio.
2. Abra `https://script.new`.
3. Crie um projeto chamado `Tabaco Controle - Coleta`.
4. Substitua o conteudo do editor por [Code.gs](/Users/paulobonan/Documents/Universidades/UFPB/pesquisa/projetos/Tabagismo geral/tabaco/apps-script/Code.gs).
5. No arquivo de manifesto, substitua pelo conteudo de [appsscript.json](/Users/paulobonan/Documents/Universidades/UFPB/pesquisa/projetos/Tabagismo geral/tabaco/apps-script/appsscript.json).
6. Crie ou escolha uma planilha do Google Sheets do laboratorio e copie o ID dela.
7. Em `Code.gs`, troque `PREENCHA_COM_O_ID_DA_PLANILHA_DO_LABORATORIO` pelo ID real da planilha.
8. Clique em `Deploy` > `New deployment` > `Web app`.
9. Execute como a conta do laboratorio e permita acesso para quem vai usar o app.
10. Copie a URL final terminada em `/exec`.

## Como ligar o frontend ao novo script

1. Crie um arquivo `.env.local` na raiz do projeto.
2. Adicione:

```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/SEU_DEPLOY_ID/exec
```

3. Reinicie o `vite` se ele estiver rodando.

## Estrutura da planilha

- Aba `Envios`: uma linha por lote enviado.
- Aba `Casos`: uma linha por caso individual, com colunas dinamicas baseadas no payload recebido.
