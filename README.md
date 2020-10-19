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


---

### Interface

- Nesse projeto iremos forçar para que todas as interfaces comecem com a letra "I" no eslint podemos adicionar uma regra para forçar isso:

```json
"@typescript-eslint/interface-name-prefix": ["error", {"prefixWithI": "always"}],
```


---

## Conceito L do SOLID

- Um dos coneceitos do SOLID é o `Liskov Substition Principle`, determina que as camadas que são integração com outras libs, como banco de dados, devem ser possível substituir essas informações, definindo um conjunto de regras, ou seja defende que os services de uma regra de repositorio, o nosso service não deve conhecer o formato final da estrutura que armazena/persiste os dados. Os serviços não devem saber se os dados estão sendo persistidos pelo typeorm, pelo no-sql...


### DTO (Data transfer object)

- Essa é uma técnica muito utilizada que consiste criar inteface para transferir o objeto entre classes.
- Um exemplo disso pode ser visto em `src/modules/appointments/dtos/ICreateAppointmentDTO.ts` e `src/modules/appointments/typeorm/repositories/AppointmentsRepository.ts`

- Sempre que precisamos passar um objecto como parametro para um serviço utilizamos o DTO

---

### SOLID até o momento:
- Já foi aplicado no projeto as seguintes práticas do SOLID:

  - (X) Single Responsability Principle
  - ( ) Open Close Principle
  - (X) Liskov Substitution Principle
  - ( ) Interface Segregation Principle
  - (X) Dependency Inversion Principle


----


## Injeção de dependências

- Utilizamos isso para não precisar inserir no constructor isso de forma manual como por exemplo:

```ts
constructor(private appointmentsRepository: IAppointmentsRepository) {}
```

- [tsyringe](https://github.com/microsoft/tsyringe)

- Instalação:

```bash
yarn add tsyringe
```

- Criamos a pasta  `src/shared/container/index.ts`

- No arquivo `src/modules/appointments/services/CreateAppointmentService.ts` adicionamos o seguinte:

```ts
import { injectable, inject } from 'tsyringe';

// ...

@injectable()
class CreateAppointmentService {

  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository) {}
  // ...
}
```

e por fim posso importar o arquivo `src/shared/container/index.ts` em `src/shared/infra/http/server.ts`:

```ts
import '@shared/container';
```

- Dessa forma ele já começará a agir.


- Por fim em `src/modules/appointments/infra/http/routes/appointments.routes.ts` podemos alterar o seguinte:

```ts
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

//..

appointmentsRouter.post('/', async (req, res) => {
// ...
  const appointmentsRepository = new AppointmentsRepository();
  const createAppointment = new CreateAppointmentService(appointmentsRepository);

// ...
});

```

- Mudamos para:

```ts

import { container } from 'tsyringe';
// import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

//..

appointmentsRouter.post('/', async (req, res) => {
// ...
  // const appointmentsRepository = new AppointmentsRepository();
  const createAppointment = container.resolve(CreateAppointmentService);

// ...
});

```

- Ok, como isso funciona?
  1 - Ele irá carregar o service nesse caso o `CreateAppointmentService`
  2 - Irá verificar dentro dele através do decoretor `@inject('...')` qual a dependência que ele precisa
  3 - Com isso ele chega no `src/shared/container/index.ts` e verifica a dependencia cadastrada
  4 - Gera a instancia da dependencia solicitada.


---

## Controllers

- Utilizado para inserir toda a responsabilidade da rota

- Criar o arquivo `src/modules/appointments/infra/http/controllers/AppointmentControllers.ts`

- Eles são responsáveis por receber a requisição repassar para o serviço responsável e retornar a resposta, apenas isso.

- Na arquitetura RestFul o controller devem ter no máximo 5 methodos:
  - index
  - show
  - create
  - update
  - delete


---

## Testes


- Testes Unitários
  - testam funcionalidades especificas da nossa aplicação
  *Jamais: chamada a api e efeito coletaral*
- Testes de integração
  - testam uma funcionalidade completa, passando por várias camadas da aplicação
  Route -> Controller -> Serviço -> Repositório -> ...

- Teste E2E (Front-end)
  - Teste que simulam a ação do usuário dentro da aplicação


- TDD (Test Driven Development)

---

### Instalação configuração

- Instalar o jest:

```bash
yarn add jest -D
```

- criar o arquivo de configuração do jest:

```bash
yarn jest --init
```

- Responder as perguntas:

  - `Would you like to use Jest when running "test" script in "package.json"?` = Y
  - `Choose the test environment that will be used for testing `  = node
  - `Do you want Jest to add coverage reports?` = N // vamos habilitar depois
  - `Automatically clear mock calls and instances between every test?` = N

- Será criado um arquivo `jest.config.js`

- Para o jest conseguir ler os arquivos de tests no formato typescript utilizamos a seguinte dependencia:

```bash
yarn add ts-jest -D
```

- E no arquivo `jest.config.js` adcionamos o seguinte:

```js
preset: 'ts-jest',
```

- Definir onde encontrar os arquivos de testes no `jest.config.js`:

```js
testMatch: [
  "**/*.spec.ts",
],
```

- Precisamos instalar a dependencia:

```bash
yarn add @types/jest -D
```

- Assim nosso projeto conseguirá entender as tipagens e variaveis globais do jest

- No `eslintrc.json` adicionamos:


```json
"env": {
      "es2020": true,
      "node": true,
      "jest": true,
  },
```

- Para os testes entender a sintaxe de `@`, que adicionamos para facilitar os imports precisamos realizar alguns ajustes em `jest.config.js`:

```js
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.json');

// ...

moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/src/'}),
// ...
```

*No arquivo `tsconfig.json` precisamos retirar todos os comentários.*
**Também verificar se não há nenhuma virgula no final de cada object, array, pois isso não será considerado um JSON válido.**

- Agora com tudo pronto podemos escrever o primeiro test, em `src/modules/appointments/services/CreateAppointmentService.spec.ts`

- Para executar os testes executamos o comando:

```bash
yarn test
```

- Antes de realizar os testes temos que pensar como vamos realizar testes que precisam utilizar base dados...
Nesse caso o ideal é que nos testes unitários não seja utilizado nenhuma ação na base de dados, por vários fatores,
Pois quando formos utilizar CI, vamos ter que criar uma base de dados isolada? vamos ter que apagar todos os registros e criar tudo novamente?
O ambiente estará preparado?
Então são uma série de coisas que devem ser pensadas então nesse caso o melhor é criamos fake o acesso e gravação aos dados aos registros.


- Como fazer? Exemplo.: Criar o arquivo `src/modules/appointments/repositories/fakes/FakeAppointmentsRepository.ts`, e copiar para dentro dele tudo que está em `src/modules/appointments/infra/typeorm/repositories/AppointmentsRepository.ts` e remover tudo que está relacionado ao typeorm

---

### Collect Coverage

- No arquivo `jest.config.js` ajustamos o seguinte:

```js
collectCoverage: true,

collectCoverageFrom: ['<rootDir>/src/modules/**/services/*.ts'],

coverageDirectory: 'coverage',

coverageReporters: [
  "text-summary",
  "lcov",
],
```


---

## Testes - Verificando se uma promise retorna erro:

- Um exemplo está presente em `src/modules/appointments/services/CreateAppointmentService.spec.ts`;

```ts
expect(createAppointment.execute({
  date: appointmentDate,
  provider_id: '123123',
})).rejects.toBeInstanceOf(AppError);
```


- Um recurso interessante sobre os testes é o `spyOn`, o qual pode ser encontrado em `src/users/services/UpdateUserAvatarService.spec.ts`:

```ts
const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
//...
expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');

expect(user.avatar).toEqual('avatar2.jpg');
```

- Ele é utilizado para espiar a função de dentro de alguma class, ou const ou function parent.


---

## TDD

- No TDD seguimos os seguintes passos:

  - RED - Criar o teste primeiro e ele irá falhar
  - GREEN - Fazer o teste passar
  - REFACTOR - Refatorar o teste


---

## spyOn

- podemos realizar mock de funções nativas do js utilizando o spyOn, um exemplo está em `src/modules/users/services/ResetPasswordService.ts`:

```ts

jest.spyOn(Date, 'now').mockImplementation(() => {
  const customDate = new Date();
  return customDate.setHours(customDate.getHours() + 3);
});
```

---

## Envio de e-mail

- Podemos utilizar o [ethereal](https://ethereal.email/) para realizar o envio de e-mail em ambiente dev

- Precisamos instalar o nodemailer:

```bash
yarn add nodemailer
```

- Também instalar a lib de tipagens do nodemailer:

```bash
yarn add @types/nodemailer -D
```

---

## Template de e-mail

- Para esse projeto iremos utilizar o handlebars:

```bash
yarn add handlebars
```

---

### Definir um tipo array de um object:

- Uma das melhores formas de definirmos um objeto como array no typescript é conforme esse exemplo que está dentro de `src/modules/appointments/services/ListProviderMonthAvailabilityService.ts`:

```ts
type IResponse = Array<{
  day: number;
  available: boolean;
}>;
```

- Utilizar o Array<> ao invés do [] pois o primeiro fica mais legível.

---

### Expect Array Containing

- Verificamos se há ocorrencias em parte do array, um exemplo está em `src/modules/appointments/services/ListProviderMonthAvailabilityService.spec.ts`:

```ts
expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ]),
    );
```

---

### Limpar cache do jest

- Quando corrigimos algum erro e mesmo assim o jest continua acusando um erro que já foi corrigido, podemos utilizar o seguinte comando:

```bash
yarn jest --clearCache
```
