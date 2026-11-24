# Orbe

Aplicativo mobile para gestão de finanças pessoais. O objetivo é reunir rendas, gastos e indicadores em um único lugar
para facilitar o acompanhamento do saldo e da evolução financeira.

## Estado atual

O app faz login e cadastro pela API Fastify, que armazena contas e lançamentos no SQLite. O painel calcula saldo, renda,
gastos, comprometimento da renda e evolução mensal a partir dos lançamentos da conta autenticada. A demonstração usa
dados de exemplo em memória e funciona sem a API.

Toque no avatar para alterar o tema, no olhinho para ocultar os valores e em "Ver todos" para abrir o extrato completo.

A biblioteca em `src/components/` inclui botões, campos de formulário com opção de mostrar senha, seleção de categorias,
ícones, ícones animados, logo e indicadores de progresso e força de senha. Todos acompanham os temas claro e escuro.

## Funcionalidades

- Login e cadastro pela API. A recuperação de senha é demonstrativa.
- Dashboard com saldo, renda, gastos, comprometimento, gráficos e insight calculados a partir dos lançamentos.
- Seleção do mês atual e dos meses com dados, incluindo futuros; seta gira ao abrir.
- Cadastro de renda e gasto, com categoria, data, observação e pagamento para gastos.
- Extrato completo por **Ver todos** e olhinho compartilhado com o painel.
- Tema escuro inicial e opção de tema claro.
- Demonstração de abertura, carregamento, vazio e erro pelo avatar do dashboard.
- Extras (Sugestões TPI): 
  - Seleção de tema claro/escuro
  - Olho para alternar visibilidade dos valores
  - Ajuste dos feedbacks que são mostrados ao usuário

## Executar

Use **Node.js 22.13 ou superior** (validado com Node 24) e npm.

```sh
npm ci
npm start
```

O Expo apresenta as opções para dispositivo ou emulador compatível. Para apresentar pelo navegador, use `npm run web`.

### Backend

Crie `backend/.env` a partir de `backend/.env.example`. Gere um segredo e atribua o valor a `JWT_ACCESS_SECRET`.

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
npm ci --prefix backend --include=dev
npm run dev --prefix backend
```

A primeira execução cria `backend/db/orbe.db` a partir de `backend/db/schema.sql`. O arquivo SQLite fica fora do Git e
é reutilizado nas execuções seguintes. `ORBE_DB_PATH` permite indicar outro arquivo SQLite.

A API responde em `/health` e oferece documentação em `/docs`. Para conectar o app, crie o `.env` na raiz a partir de
`.env.example` e aponte `EXPO_PUBLIC_API_URL` para um endereço acessível pelo aparelho. Use `http://localhost:3333`
no navegador local ou o IP de rede do computador no celular físico. Use HTTPS em ambientes compartilhados.

Execute `npm test --prefix backend` para verificar autorização e isolamento entre contas com um SQLite em memória.

| Comando                          | Finalidade                                        |
|----------------------------------|---------------------------------------------------|
| `npm start`                      | Iniciar o Expo                                    |
| `npm run android`                | Abrir no Android                                  |
| `npm run ios`                    | Abrir no simulador iOS, no macOS                  |
| `npm run web`                    | Abrir a versão web                                |
| `npm run lint`                   | Verificar com ESLint                              |
| `npm run typecheck`              | Verificar tipos                                   |
| `npm test`                       | Executar testes de cálculos e validações          |
| `npx expo-doctor`                | Diagnosticar configuração e dependências          |
| `npx expo export --platform all` | Exportar pacotes JavaScript de Android, iOS e web |

## Organização

| Caminho                  | Responsabilidade                            |
|--------------------------|---------------------------------------------|
| `src/app/`               | Rotas do Expo Router e provedores no layout |
| `src/components/`        | Elementos reutilizáveis                     |
| `src/modules/identity/`  | Login, cadastro e validação                 |
| `src/modules/dashboard/` | Painel e cálculos mensais                   |
| `src/modules/newEntry/`  | Escolha e validação de lançamentos          |
| `src/modules/statement/` | Extrato                                     |
| `src/modules/demo/`      | Controles de apresentação                   |
| `src/contexts/`          | Lançamentos e visibilidade na sessão        |
| `src/theme/`             | Cores, fontes e seleção de tema             |
| `src/data/finance.ts`    | Tipos, categorias e exemplos                |
| `src/states/`            | Abertura, carregamento, vazio e erro        |
| `tests/`                 | Testes com o executor nativo do Node        |

Formulários usam `useState`; lançamentos usam um contexto com um array. Dinheiro é armazenado em centavos. Gráficos usam
`react-native-gifted-charts`.

## Documentação

- [Requisitos](docs/Documentacao_App_Financeiro.docx)
- [Diagrama](docs/DCU.png) e [arquivo editável](docs/DCU_App_Financeiro.asta)
- [Protótipo Figma](https://www.figma.com/design/rSNsOGpKdQimT3FrZLTmyI/MobilePrototipo?node-id=0-1)
- GitHub: https://github.com/marcelobelisario/orbe
- App Android: [em breve]

## Equipe

- João Victor Souza
- Luiz Henrique Balieiro
- Marcelo Augusto Belisário
