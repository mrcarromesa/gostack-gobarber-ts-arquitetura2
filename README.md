# Arquitetura

- Organizando as pastas

- Antes de começar no caso utilizando a extensão do material icons podemos estilizar alguns icones de arquivo e pastas

- No arquivo `settings.json` do vscode podemos adicionar as seguintes configurações:

```json
"material-icon-theme.folders.associations": {
  "migrations": "Dump",
  "infra": "app",
  "entities": "class",
  "typeorm": "database",
  "repositories": "mappings",
  "http": "container",
  "modules": "components",
  "implementatios": "core",
  "dtos": "typescript",
  "fakes": "mock"
},

"material-icon-theme.files.associations": {
  "ormconfig.json": "database",
  "tsconfig.json": "tune",
},
```

- Em [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme), tem mais informações sobre esse relacionamento


- Agora criamos a pasta `src/modules` e vamos separar as partes do projeto

  - Quais são as areas de conhecimento diferentes?
    - Atualmente temos o Appointments e o users
  - Dividimos a aplicação em setores caso um setor seja removido os demais continuam a funcionar

- Criamos a pasta `src/modules/users` e `src/modules/appointments`
- Criamos a pasta `src/modules/appointments/services` e movemos todos os services de appointments
- Criamos a pasta `src/modules/users/services` e movemos todos os services de users

- Por fim removemos a pasta `src/services`

- Criamos a pasta `src/modules/appointments/repositories`

- Dessa forma podemos apagar a pasta `src/repositories`

- Temos a pasta `database` porém essa pasta não pertence a nenhum modulo, nesse caso podemos criar a pasta `src/shared` o qual é compartilhada por todos os modulos

- Passamos o as pastas database, erros, middleware, routes

- Por fim criamos a pasta `src/modules/appointments/entities` e adicionamos o model correpsondente
- Por fim criamos a pasta `src/modules/users/entities` e adicionamos o model correpsondente

- Finalmente podemos apagar a pasta `src/models`

---

## Camada de infra e camada de dominio

- A camada de dominio basicamente seria a de regra de negocio, basicamente algo que até quem não entende de programação conseguirá ler
E essa camada não precisa saber qual base de dados esta sendo utilizado, ou qual ferramenta para envio de e-mail está sendo utilizada, isso é responsabilidade da camada de infra, então adicionamos a ela tudo que for de uma lib especifica de um pacote especifico.

- Atualmente o que temos no nosso projeto de que podemos mover para camada de infra são:
- database - alterar para typeorm: caso alterameos de typeorm para outro isso deixará de existir pois utiliza uma lib especifia, no caso do erros por exemplo eu posso alterar qualquer lib que for ele continuará o mesmo.

- criamos também a pasta `src/shared/infra/http/` e inserimos tudo que tem haver com requisição do tipo http, que são:
  - routes
  - middleware
  - server.ts


- Também em `src/modules/appontments` criamos a pasta `infra/typeorm`
- Também em `src/modules/users` criamos a pasta `infra/typeorm`

- Agora em `src/modules/appointments` o que precisamos mover para o infra?
  - No caso temos o `entities/Appointments.ts` que está totalmente relacionado com o typeorm, e se um dia o typeorm mudar isso irá para de funcionar, dessa forma podemos move-lo para `src/modules/appointments/infra/typeorm/entities/Appointments.ts`

- A mesma coisa realizamos no `src/modules/users/entities/`

- Também podemos adicionar as rotas em `src/modules/appointments/infra/http/routes/`
- Também podemos adicionar as rotas em `src/modules/users/infra/http/routes/`

---

## Root Import com typescript

- Para não precisar utilizar o `../../../../../` podemos realizar alguns ajustes em `tsconfig.json`:

```json
"baseUrl": "./",
"paths": {
  // ...
},
```

- Utilizamos essa configurações para criar atalhos, para os caminhos das importações ficarem menores,
- Utilizamos esse recurso juntamente com a prop baseUrl:

```json
"baseUrl": "./src",
"paths": {
  "@modules/*": ["modules/*"],
  "@config/*": ["config/*"],
  "@shared/*": ["shared/*"],
},
```

- Dessa forma podemos utilizar isso no nossos arquivos:


```ts
import User from '@modules/users/infra/typeorm/entities/User';
```

- Depois de realizar as configurações é interessante dar um reload no vscode para ele conseguir entender

- E por fim podemos atualizar isso.

- Finalmente precisamos ajustar o arquivo `package.json`:

```json
"scripts": {
    "build": "tsc",
    "dev:server": "ts-node-dev --inspect --transpileOnly --ignore-watch node_modules src/shared/infra/http/server.ts",
    "start": "ts-node src/shared/infra/http/server.ts",
    "typeorm": "ts-node-dev ./node_modules/typeorm/cli.js"
  },
```

- Precisamos instalar um plugin que entende o `@` que adicionamos nos caminhos, pois o ts-node não consegue entender, dessa forma instalamos o :

```bash
yarn add tsconfig-paths -D
```


- Ainda no `package.json` adicionamos aos scripts o `-r` que significa register, vamos registrar o plugin:

```json
"scripts": {
    "build": "tsc",
    "dev:server": "ts-node-dev -r tsconfig-paths/register --inspect --transpileOnly --ignore-watch node_modules src/shared/infra/http/server.ts",
    "start": "ts-node src/shared/infra/http/server.ts",
    "typeorm": "ts-node-dev -r tsconfig-paths/register ./node_modules/typeorm/cli.js"
  },
```
