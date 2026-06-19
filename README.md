# Adaptador de Treino

PWA que lê a foto de uma série, **adapta os exercícios à academia do seu prédio** (via API da Anthropic)
e gera um card com fotos, carga/reps, cronômetro e **exportação em PDF** (download com um toque, ou impressão nativa).

**120 exercícios** (os realizáveis na sua academia) já vêm com **fotos embutidas e otimizadas** —
o app funciona **offline por completo, inclusive as fotos**. Se você não gostar ou não puder fazer um exercício sugerido, toque em **“Trocar”** para ver outras opções do mesmo grupo (também offline) e substituí-lo no card. A única coisa que exige internet é
adaptar uma série *nova* (leitura da foto pela IA).

## Estrutura
```
adaptador-treino/
├─ index.html              # app + 120 fotos embutidas + catálogo (chama /api/adapt)
├─ sw.js                   # service worker (offline total do app)
├─ manifest.webmanifest
├─ icon-192.png / icon-512.png / icon-maskable-512.png
├─ netlify.toml            # publish, functions, redirect /api/adapt
├─ netlify/functions/adapt.js   # proxy seguro para a API (usa a chave do ambiente)
├─ package.json / .gitignore / .env.example
```

## Deploy contínuo (GitHub → Netlify)
1. Suba este repositório para o GitHub (branch `main`).
2. Netlify → **Add new site → Import an existing project → GitHub** → selecione o repo (config vem do `netlify.toml`) → **Deploy**.
3. **Environment variables** → adicione `ANTHROPIC_API_KEY` (sua chave) → **Trigger deploy**.
4. Cada `git push` na `main` republica automaticamente.

> A chave nunca fica no código/repo — só como variável de ambiente, lida pela function `adapt.js`. O `.gitignore` bloqueia `.env`.

## Local (opcional)
```bash
npm i -g netlify-cli
cp .env.example .env      # coloque a ANTHROPIC_API_KEY (não comitar)
netlify dev
```

## Observação
Adaptação é sugestão automática; confira a execução com seu professor. Fotos: free-exercise-db (domínio público).
