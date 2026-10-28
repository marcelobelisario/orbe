# Orbe

Aplicativo mobile para gestão de finanças pessoais. O objetivo é reunir rendas, gastos e indicadores em um único lugar
para facilitar o acompanhamento do saldo e da evolução financeira.

## Estado atual

A tela inicial reúne login e cadastro em modo demonstração. Os formulários validados e o botão de demonstração abrem o
dashboard, com saldo, renda, gastos, comprometimento da renda, distribuição por categoria, evolução mensal, lançamentos
recentes e um insight calculado. O painel utiliza dados fictícios locais, sem persistência.

A implementação do utiliza cálculos simples com arrays e `react-native-gifted-charts` para os gráficos. 
Toque no avatar para alterar o tema, no olhinho para ocultar os valores e
em “Ver todos” para abrir o extrato completo. As telas de [identidade](src/modules/identity/README.md) reutilizam os
componentes e os temas do painel. A autenticação real, o cadastro de lançamentos e os estados globais de carregamento e
erro ainda não estão implementados.

A biblioteca em `src/components/` inclui botões, campos de formulário com opção de mostrar senha, seleção de categorias,
ícones, ícones animados, logo e indicadores de progresso e força de senha. Todos acompanham os temas claro e escuro.

## Funcionalidades

- Login e cadastro com validação local; recuperação de senha demonstrativa.
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

Os dados ficam **somente na memória durante a sessão**. Recarregar o aplicativo restaura os exemplos. Login/cadastro não
autenticam nem criam contas reais por enquanto; recuperação não envia e-mail. Não há backend, armazenamento permanente ou
edição/exclusão individual de registros. Apens foi criado o banco de dados, mas não foi implementado ainda.

## Executar

Use **Node.js 22.13 ou superior** (validado com Node 24) e npm.

```sh
npm ci
npm start
```

O Expo apresenta as opções para dispositivo ou emulador compatível. Para apresentar pelo navegador, use `npm run web`.

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
