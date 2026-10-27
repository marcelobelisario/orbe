# Orbe

Aplicativo mobile para gestão de finanças pessoais, desenvolvido com Expo, React Native e TypeScript. O objetivo é reunir rendas, gastos e indicadores em um único lugar para facilitar o acompanhamento do saldo e da evolução financeira.

## Estado atual

O projeto está na fase inicial de desenvolvimento. A tela inicial exibe um dashboard com saldo, renda, gastos, comprometimento da renda, distribuição por categoria, evolução mensal, lançamentos recentes e um insight calculado. O painel utiliza dados fictícios locais, sem integração com backend ou persistência. O seletor de mês começa no mês atual e atualiza os indicadores conforme o período escolhido.

A implementação do [dashboard](src/modules/dashboard/README.md) utiliza cálculos simples com arrays e `react-native-gifted-charts` para os gráficos. Toque no avatar para alterar o tema, no olhinho para ocultar os valores e em “Ver todos” para abrir o extrato completo. Os módulos de identidade e cadastro de lançamentos e os estados de carregamento e erro ainda não estão implementados.

A biblioteca em [`src/components/`](src/components/README.md) inclui botões, campos de formulário, seleção de categorias, ícones, ícones animados e barra de progresso. Todos acompanham os temas claro, escuro e automático.

As funcionalidades abaixo descrevem o escopo completo. O painel e seus indicadores já possuem uma demonstração com dados locais; autenticação, cadastro, persistência e integração ainda estão planejados.

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

O ESLint utiliza a configuração recomendada pelo Expo, versionada em `eslint.config.js`.

## Organização do código

| Caminho | Conteúdo |
| --- | --- |
| `src/app/` | Rotas e layout de navegação; tela inicial em `index.tsx` |
| `src/components/` | Componentes compartilhados e exemplos de uso na documentação |
| `src/theme/` | Paletas clara e escura, tipografia e preferência de tema |
| `src/data/` | Dados financeiros de exemplo compartilhados entre as telas |
| `src/contexts/` | Visibilidade de valores compartilhada entre dashboard e extrato |
| `src/modules/` | Dashboard implementado e estrutura reservada para identidade e novos lançamentos |
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
