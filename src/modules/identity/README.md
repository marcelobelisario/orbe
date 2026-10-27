# Identidade

O cadastro reutiliza `Btn`, `FormInput`, `Icon`, as fontes e o `ThemeProvider` da branch `feat/dashboard-components`. O logo e o indicador de força de senha também acompanham a paleta clara ou escura. Não há uma segunda implementação de botão, campo ou paleta de cores.

`FormInput` aceita `isPassword` para oferecer o botão de mostrar/ocultar senha, preservando as propriedades de `TextInput`, os eventos de foco e as mensagens de erro.

As regras de cadastro ficam em `validation.ts`: nome e sobrenome, e-mail válido, senha de pelo menos oito caracteres, confirmação igual e aceite explícito dos termos. Números e símbolos são sugestões do indicador, não exigências adicionais.

Os formulários são demonstrações locais: não cadastram usuários, não autenticam credenciais e não persistem ou enviam dados. A tela que os utiliza define o comportamento de `onSuccess`.

A rota `/` reúne as abas de login e cadastro. O login validado, o cadastro validado e o botão de demonstração usam `router.replace("/dashboard")`. O painel continua disponível em `/dashboard` e o extrato em `/statement`, sob os mesmos provedores de tema e visibilidade. A recuperação valida o e-mail e informa que nenhum envio ocorreu na demonstração. A opção de lembrar credenciais será adicionada quando houver autenticação e persistência.

Validação:

```sh
npm run lint
npm run typecheck
node --experimental-strip-types --test tests/*.test.mjs
```
