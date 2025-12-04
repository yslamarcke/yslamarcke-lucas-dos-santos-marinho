# ZelaPB - Sistema de Gestão Urbana Inteligente

O **ZelaPB** é uma plataforma Progressive Web App (PWA) desenvolvida para conectar cidadãos, equipes de limpeza urbana e prefeituras, utilizando Inteligência Artificial para classificar e priorizar demandas.

## 🚀 Tecnologias

- **Frontend**: React 19, TypeScript
- **Estilização**: Tailwind CSS
- **IA**: Google Gemini 2.5 Flash (via @google/genai)
- **Gráficos**: Recharts
- **Ícones**: Lucide React

## 📦 Como Rodar Localmente

Siga os passos abaixo para rodar este projeto no seu computador (VS Code):

### 1. Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.

### 2. Criar o Projeto
Recomendamos usar Vite para iniciar:

```bash
npm create vite@latest zelapb -- --template react-ts
cd zelapb
```

### 3. Instalar Dependências
Copie o conteúdo do arquivo `package.json` fornecido ou instale manualmente:

```bash
npm install react react-dom @google/genai recharts lucide-react
npm install -D tailwindcss postcss autoprefixer
```

### 4. Configurar Tailwind
Inicialize o Tailwind:
```bash
npx tailwindcss init -p
```
Configure o `tailwind.config.js` para procurar arquivos no `./src`.

### 5. Copiar os Arquivos
Copie todos os arquivos `.tsx` e `.ts` deste projeto para a pasta `src/` do seu projeto local.

### 6. Configurar API Key
Crie um arquivo `.env` na raiz do projeto e adicione sua chave do Google Gemini:
```env
VITE_API_KEY=sua_chave_aqui
```
*Nota: No código, substitua `process.env.API_KEY` por `import.meta.env.VITE_API_KEY` se usar Vite.*

### 7. Rodar
```bash
npm run dev
```

## 📱 Funcionalidades

1.  **App do Cidadão**: Denúncias com foto, geolocalização e análise de IA.
2.  **App da Equipe**: Recebimento de tarefas, rotas e comunicação com líderes.
3.  **Painel da Prefeitura**: Dashboard de BI, gestão de contratos e monitoramento em tempo real.
4.  **Painel do Criador (Admin)**: Gestão SaaS, deploy de configurações e controle financeiro.

---
Desenvolvido por Yslamarcke Lucas dos Santos Marinho © 2025
