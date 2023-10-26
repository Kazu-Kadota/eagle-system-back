# eagle-system-back

## Estrutura do projeto

```
📦 eagle-system-back
├── src //Código fonte
│   ├── controllers //Camada de controle de requests enviadas pelo cliente
│   │   └── todo //Padrão de pasta a ser seguido. Ex: GET /todo -> src/controllers/todo/get
│   │       └── get
│   │           ├── index.test.ts
│   │           ├── index.ts //Configuração do handler
│   │           ├── main.test.ts
│   │           ├── main.ts  //Controller todo get
│   │           ├── todo-get-adapter.test.ts
│   │           ├── todo-get-adapter.ts  //Verifica dado do banco se está apto para ser usado no controller
│   │           ├── validate.test.ts
│   │           └── validate.ts //Valida input do usuário
│   ├── models //Models do serviço. Obs: Não adicionar models de serviço terceiro.
│   │   └── todo.ts
│   ├── repositories //Camada de leitura/escrita ao banco de dados
│   │   └── todo
│   │       ├── get.test.ts
│   │       └── get.ts
│   └── utils //Funções reutilizáveis no serviço
│       ├── date
│       │   ├── get-iso-string.test.ts
│       │   └── get-iso-string.ts
│       ├── get-env
│       │   ├── get-string-env.test.ts
│       │   └── get-string-env.ts
│       ├── get-user-id.test.ts
│       └── get-user-id.ts
├── README.md
├── babel.config.js //Necessário para jest em typescript
├── jest.config.js //Configurações do jest
├── local-authorizers.js //Força jest utilizar nossa lambda autorizador para autenticar rotas localmente
├── package-lock.json
├── package.json
├── serverless.yml //Configurações para rodar lambdas localmente e realizar deploy pelo actions do github
├── tsconfig.build.json
└── tsconfig.json
```
