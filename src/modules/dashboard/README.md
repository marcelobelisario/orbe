# Dashboard

Implementação didática do painel do protótipo, com dados fictícios locais.

- `index.tsx`: tela, cálculos e estilos. Usa componentes compartilhados e `react-native-gifted-charts` para a rosca e o gráfico de evolução.
- `summary.ts`: funções de filtro por mês/ano, totais, comparação e histórico mensal.
- `src/data/finance.ts`: dados de exemplo compartilhados pelo dashboard e pelo extrato. Dinheiro é armazenado em centavos e formatado em reais apenas na exibição.
- `src/app/index.tsx`: disponibiliza a tela pelo Expo Router.

O seletor começa no mês atual do aparelho e oferece os meses do ano atual e dos anos presentes nos dados. Cada seleção filtra os lançamentos por mês e ano. Os cálculos usam operações básicas de arrays: `filter` separa renda e gastos, `reduce` soma valores e `sort` ordena lançamentos do mais recente para o mais antigo. O saldo corresponde à renda menos os gastos do mês, sem saldo anterior.

Os dados de exemplo estão em setembro de 2026: renda de R$ 6.000,00, gastos de R$ 1.914,60, saldo de R$ 4.085,40 e comprometimento de 31,9%. Outros meses sem registros mostram valores zerados e mensagens de ausência de dados.

A evolução mostra os cinco meses terminando no mês selecionado e usa os lançamentos reais dessa lista, incluindo meses sem movimentação. A comparação considera o mês imediatamente anterior; sem uma base anterior positiva, exibe “Sem base de comparação”. Meses sem renda exibem “Sem renda”, em vez de um percentual enganoso.

O seletor mantém o mês como um título, com uma seta que gira 180° enquanto a lista de meses está aberta. Usa `Pressable`, `Modal` e uma animação curta com Reanimated, respeitando a preferência por movimento reduzido. Selecionar um mês, tocar fora da lista, usar “Fechar” ou voltar no Android fecha a seleção. O extrato continua exibindo todos os lançamentos, independentemente do mês do dashboard.

Toque no avatar para abrir as opções de tema. O dashboard mostra os três lançamentos mais recentes. **Ver todos** navega para `/statement`, a tela de **Extrato**, que exibe todos os lançamentos em uma `FlatList` e permite voltar pelo cabeçalho.

O olhinho oculta ou mostra os valores nas duas telas. A opção é compartilhada por um contexto simples em `src/contexts/valueVisibility.tsx` e vale durante a sessão. Com os valores ocultos, gráficos, montantes e percentuais financeiros também são ocultados, inclusive nos rótulos de acessibilidade. As linhas de lançamentos e o botão do olhinho são componentes reutilizáveis.

O botão de adicionar fica desabilitado porque o cadastro de lançamentos será implementado no módulo correspondente.

Nesta etapa não há autenticação, consulta ao backend ou persistência. Os gráficos são gerados com os dados locais, sem imagens estáticas de gráficos. As fontes e o SVG são empacotados com o app.

Para verificar o código:

```sh
npm run lint
npm run typecheck
node --experimental-strip-types --test tests/dashboard-summary.test.mjs
```
