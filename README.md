# Ambiente avançado

- Muitas vezes precisamos trabalhar com informações que não necessáriamente precisam estar realicionadas as outras entidades da aplicação, para isso podemos utilizar bancos não realacionais NoSQL como o MongoDB, mesmo assim para maioria dos casos de aplicação do mundo real utilizamos bancos relacionais, o nosql é para casos especificos, quando precisamos enviar uma notificação para o usuário coisas simples que não precisam estar relacionados com o banco relacional, claro que é possível utilizar bancos nosql na maioria dos casos mas no mundo real é um pouco diferente.


## mongodb

- Instalação via docker:

- execute o comando:

```bash
docker run --name mongob -p 27017:27017 -d -t mongo
```

- `--name` o nome do banco podemos colocar o nome de nossa preferência
- `-p` a porta que ele ficará escutado
- `-d` rodar em detact mode, rodar em background, para não bloquear o terminal
- `-t` o nome da imagem

- Para utilizar um interface gráfica com o mongo podemos baixar a seguinte: [MongoDB Compass](https://www.mongodb.com/products/compass)

- Ou pode utilzar o robo 3t

- Para conectar acessamos no Compass o seguinte endereço: `mongodb://localhost:27017`


---

## Configurar o mongoDB com o typeorm

- Precisamos instalar o pacote do mongodb:

```bash
yarn add mongodb
```

- Instale também:

```bash
yarn add @types/mongodb -D
```

- No arquivo `ormconfig.json` iremos adicionar a conexão com o mongoDB, a conexão que já existe mantemos, porém iremos envolver tudo dentro de um array

- Primeiro precisamos ter um atributo name para as conexões, na existente vamos chamar de `default` e na segunda de mongodb:

```json
[
  {
    "name": "default",
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "postgres",
    "password": "docker",
    "database": "gostack_gobarber",
    "entities": [
      "./src/modules/**/infra/typeorm/entities/*.ts"
    ],
    "migrations": [
      "./src/shared/infra/typeorm/migrations/*.ts"
    ],
    "cli": {
      "migrationsDir": "./src/shared/infra/typeorm/migrations"
    }
  },
  {
    "name": "mongo",
    "type": "mongodb",
    "host": "localhost",
    "port": 27017,
    "database": "gostack_gobarber",
    "useUnifiedTopology": true,
    "entities": [
      "./src/modules/**/infra/typeorm/schemas/*.ts"
    ]
  }
]

```


- Agora como temos um array de conexão, precisamos iniciar todas elas, para isso no arquivo `src/shared/infra/typeorm/index.ts` vamos alterar o conteúdo para:

```ts
import { createConnections } from 'typeorm';

createConnections();

```


- Por fim executamos o comando:

```bash
yarn dev:server
```

- Se não houver nenhum erro, está tudo ok

---

### Criando o Schema no mongoDB

- Criamos o arquivo `src/modules/notifications/infra/typeorm/schemas/Notification.ts` para definir a estrutura da "tabela"

- O repository com o mongo e typeorm é um pouco diferente conforme no arquivo `src/modules/notifications/infra/typeorm/repositories/NotificationsRepository.ts`:

```ts
// Para trabalhar especificamente com o mongo utilizamos essas dependencias
import { getMongoRepository, MongoRepository } from 'typeorm';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import Notification from '../schemas/Notification';

// O Decoration @EntityRepository passamos o model como parametro
// O Repository<> recebe o model feito com o typeorm

class NotificationsRepository implements INotificationsRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    // Como estamos utilizando mais de uma conexão precisamos passar como segundo paramentro o nome da conexão quando ela não for a default
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = this.ormRepository.create({
      content,
      recipient_id,
    });
    await this.ormRepository.save(notification);
    return notification;
  }
}

export default NotificationsRepository;


```


- Para trabalhar especificamente com o mongo utilizamos essas dependencias

```ts
import { getMongoRepository, MongoRepository } from 'typeorm';

// ...
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    // Como estamos utilizando mais de uma conexão precisamos passar como segundo paramentro o nome da conexão quando ela não for a default
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }
```

- Como estamos utilizando uma conexão padrão para o postgres e outra para o mongo precisamos informar isso no getMongoRepository:

```ts
this.ormRepository = getMongoRepository(Notification, 'mongo');
```

---

## Validação

- Para validação vamos utilizar a biblioteca [celebrate](https://github.com/arb/celebrate):

```bash
yarn add celebrate
```

- A primeira rota que iremos validar é `src/modules/appointments/infra/http/routes/appointments.routes.ts`:

```ts
// ...
import { celebrate, Segments, Joi } from 'celebrate';
// ...
appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date(),
    },
  }),
  AppointmentController.create,
);

//...

```

- Porém se mantermos assim e não passar na validação irá retornar status 500, precisamos ajustar isso em `src/shared/infra/http/server.ts`:

```ts
// ...
import { errors } from 'celebrate';

// ...

app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  //..
});
// ...

```

---

### Variaveis de ambiente

- Para determinar o ambiente em que estamos trabalhando utilizamos variaveis de ambiente pois o acesso a base de dados por exemplo pode mudar de um ambiente para outro bem como o envio de e-mail e assim por diante.
- Para tal podemos criar o arquivo chamado `.env` na raiz da pasta do projeto

- Para deixar o arquivo mais hilight podemos instalar a extensão dotenv do vscode
- O interessante é adicionar ele no gitignore para que ele não vá para o ambiente de produção


- Para utilizar essa extensão utilizamos a lib:

```bash
yarn add dotenv
```

- Permitimos adicionar arquivo js ajustando configuração em `tsconfig.json`:

```json
"compilerOptions": {
  ...
"allowJs": true,
...
}
```

- Por fim no arquivo `src/shared/infra/http/server.ts` adicionamos no começo do arquivo:

```ts
import 'dotenv/config';
```

- Dessa forma poderemos utlizar as variaveis de ambiente dessa forma:

```ts
process.env.APP_SECRET
```

- Uma boa prática é criar o arquivo `.env.example` o qual irá conter todas as variaveis de ambiente sem valor

#### Dica para remover um arquivo do controle de versão:

```bash
git rm --cached NOME_DO_ARQUIVO
```


---

## Class transform

```bash
yarn add class-transformer
```

- Em alguns casos não queremos retornar alguns campos especificos de uma consulta que realizamos a base de dados via model

- Ex.:

```ts
// ...

import { Exclude, Expose } from 'class-transformer';

@Entity('users')
class User {
  // ...
  @Column()
  @Exclude() // Não mostrar esse campo
  password?: string;

  // ...

  // Criar um campo com um valor tratado
  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    return this.avatar
      ? `${process.env.APP_API_URL}/files/${this.avatar}`
      : null;
  }
}
```

- Utilização, exemplo em `src/modules/users/infra/http/controllers/SessionsControllers.ts`

```ts
import { classToClass } from 'class-transformer';
// ...

return res.json({ user: classToClass(user), token });
// ...
```

---

## Utilizando mail SES

- O nodemailer já tem integração com o [SES](https://nodemailer.com/transports/ses/)

- Precisamos instalar a lib:

```bash
yarn add aws-sdk
```

- Realizamos ajustes no arquivo `src/config/mail.ts` no arquivo `src/share/container/providers/MailProvider/implementations/SESMailProvider.ts` e `src/share/container/providers/index.ts`


### Credenciais aws no arquivo env:

- Conforme documentação [env aws](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html) adicionamos isso no arquivo .env:

```.env
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=
```

---

## Redis

- Para instalar utilizamos o comando:

```bash
docker run --name redis -p 6379:6379 -d -t redis:alpine
```

- Para integrar o node com o redis podemos utilizar o ioredis:

```bash
yarn add ioredis
```

- Adicionar também as tipagens do ioredis:

```bash
yarn add @types/ioredis -D
```


---

## Tipos especiais Typescript

- Um exemplo pode ser encontrado em `src/shared/container/providers/CacheProvider/models/ICacheProvider.ts`:

```ts
recover<T>(key: string): Promise<T | null>;
```

- E sua implementação em `src/shared/container/providers/CacheProvider/implementations/RedisCacheProvider.ts`:

```ts
public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) {
      return null;
    }

    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }
```

- E por fim a chamada da função em `src/modules/appointments/services/ListProvidersServices.ts`:

```ts
let users = await this.cacheProvider.recover<User[]>(
      `providers-list:${user_id}`,
    );
```

- No caso o `<T>` significa um tipo generico que podemos definir seu tipo de retorno via chamada da function utilizando o `nome_da_function<TIPO_AQUI>(param1, ...)`


----


## Evitar força bruta

- Intalar:

```bash
yarn add rate-limiter-flexible
```

- Criamos o arquivo `src/shared/infra/http/middlewares/rateLimiter.ts`

- Adicionar também o redis:

```bash
yarn add redis
```

- Adicionar também as typagens:

```bash
yarn add @types/redis -D
```


---

## Carregando relacionamentos typeorm

- Temos um relacionamento em `src/modules/appointments/infra/typeorm/entities/Appointment.ts`:

```ts
  @ManyToMany(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
```

- para que nas nossas consultas de appointment venha os dados do usuário podemos utilizar estratégia de `Eager loading` ou `Lazy Loading`.
- O `Eager Loading`:

```ts
  @ManyToMany(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
```

- Busca e retorna junto com a consulta, nesse caso de appointments os usuários relacionados.

- O `Lazy Loading`:

```ts
  @ManyToMany(() => User, { lazy: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
```

- Busca junto a consulta os usuários relacionados e permite trazer esses dados via await promise

- Porém essas nem sempre são uma boa estratégia, para nosso caso vamos fazer isso diretamente no repositorio: `src/modules/appointments/infra/typeorm/repositories/AppointmentsRepository.ts`:

```ts
 public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');
    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
      relations: ['user'], // <- Here
    });

    return appointments;
  }

```

- Adicionamos o `relations: ['user']`, o qual nesse caso irá fazer o que o eager loading faria.
