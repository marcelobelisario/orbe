# Orbe

Aplicativo mobile para gestão de finanças pessoais, desenvolvido com Expo, React Native e TypeScript. O objetivo é reunir rendas, gastos e indicadores em um único lugar para facilitar o acompanhamento do saldo e da evolução financeira.

## Estado atual

O projeto está na fase inicial de desenvolvimento. Esta versão contém a configuração do Expo, a navegação inicial com Expo Router e uma tela de apresentação. Os módulos de identidade, painel e lançamentos, os componentes compartilhados e os estados de interface possuem apenas arquivos reservados para implementação.

As funcionalidades abaixo fazem parte do escopo planejado; ainda não estão implementadas. Não há integração com backend ou persistência de dados nesta versão.

## Funcionalidades planejadas

- **Cadastro e autenticação:** criar conta com nome completo, e-mail e confirmação de senha; entrar com e-mail e senha.
- **Painel financeiro:** consultar saldo disponível, totais de renda e gastos e comprometimento da renda.
- **Indicadores:** visualizar gastos por categoria, evolução mensal e insight do mês.
- **Lançamentos recentes:** consultar descrição, categoria, data e valor.
- **Registro de renda:** informar valor, descrição, categoria e data, com observação opcional. Categorias previstas: Salário, Freelance, Investimento, Benefício e Outros.
- **Registro de gasto:** informar valor, descrição, categoria, data e forma de pagamento, com observação opcional. Formas previstas: Pix, Débito, Crédito e Dinheiro.
- **Estados do painel:** apresentar carregamento, ausência de dados e erro, com ação para tentar novamente.

## Tecnologias

- Expo SDK 58
- React Native 0.88 e React 19.3
- TypeScript com verificação estrita
- Expo Router para navegação baseada em arquivos
- npm com lockfile versionado

## Executar localmente

Instale uma versão do Node.js compatível com as dependências do projeto e o npm.

```bash
git clone https://github.com/marcelobelisario/orbe.git
cd orbe
npm ci
npm start
```

O Expo CLI apresenta as opções para abrir o aplicativo em um dispositivo ou emulador compatível. Também estão disponíveis:

| Comando | Finalidade |
| --- | --- |
| `npm start` | Iniciar o servidor de desenvolvimento |
| `npm run android` | Iniciar o Expo e abrir no Android |
| `npm run ios` | Iniciar o Expo e abrir no simulador iOS, no macOS |
| `npm run web` | Iniciar a versão web de desenvolvimento |
| `npm run typecheck` | Verificar os tipos sem gerar arquivos |
| `npm run lint` | Executar o fluxo de lint do Expo |

A configuração e as dependências de ESLint ainda não estão versionadas. Na primeira execução de `npm run lint`, o Expo poderá solicitar sua instalação e configuração.

## Organização do código

| Caminho | Conteúdo |
| --- | --- |
| `src/app/` | Rotas e layout de navegação; tela inicial em `index.tsx` |
| `src/components/` | Arquivos reservados para componentes compartilhados |
| `src/modules/` | Estrutura reservada para identidade, painel e novos lançamentos |
| `src/states/` | Arquivos reservados para estados de carregamento e erro |
| `docs/` | Documentação de requisitos e diagrama de casos de uso |
| `assets/` | Recursos visuais ainda sem uso na configuração do aplicativo |

Mantenha apenas rotas e layouts dentro de `src/app/`. Componentes e lógica dos módulos devem ficar fora desse diretório.

Ícones, favicon e imagem de splash personalizados não estão configurados nesta etapa.

## Documentação

- [Requisitos funcionais](docs/Documentacao_App_Financeiro.docx)
- [Diagrama de casos de uso](docs/DCU.png)
- [Arquivo editável do diagrama](docs/DCU_App_Financeiro.asta)
- [Protótipo no Figma](https://www.figma.com/design/rSNsOGpKdQimT3FrZLTmyI/MobilePrototipo?node-id=0-1)

A documentação e o protótipo originais podem usar o nome anterior **Finora**. O nome atual do projeto é **Orbe**.

## Equipe

- João Victor Souza
- Luiz Henrique Balieiro
- Marcelo Augusto Belisário

## Contribuição

Antes de alterar o projeto, consulte [AGENTS.md](AGENTS.md). Execute a verificação de tipos e o lint antes de enviar alterações. Para adicionar bibliotecas, utilize `npx expo install <pacote>` para resolver versões compatíveis com o SDK.
