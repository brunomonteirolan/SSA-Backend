# SSA Backend

Express + TypeScript backend atualizado para Node.js moderno.

## O que foi atualizado

| Pacote | Antes | Depois |
|---|---|---|
| TypeScript | 4.2 | 5.3 |
| mongoose | 5.12 | 8.1 |
| aws-sdk | v2 | @aws-sdk v3 |
| @types/node | 14 | 20 |
| ts-node-dev | 1.1 | 2.0 |
| @sentry/node | 6 | 8 |
| socket.io | 4.0 | 4.7 |

## Mudanças de código

- **mongoose.ts**: Removidas opções deprecadas (`useNewUrlParser`, `useUnifiedTopology`, `useFindAndModify`, `useCreateIndex`)
- **entities/Client.ts & Company.ts**: `mongoose.Types.ObjectId()` → `new mongoose.Types.ObjectId()`
- **utils/s3.ts**: Reescrito completamente para AWS SDK v3 (`@aws-sdk/client-s3`)
- **api/client.ts**: Adaptado para `getFileUrl` agora ser async
- **useCases/updateAppVersion.ts**: `appVersion.update()` deprecado → `Object.assign() + save()`
- **api/appVersions.ts**: `MongoError` → verificação por `err.code === 11000` (mongoose 8)

## Configuração

1. Copie `.env` e preencha as variáveis:
```
PORT=35000
BACKEND_APP_URL=http://localhost:35000
WEB_APP_URL=http://localhost:3000
MONGO_URL=mongodb://localhost:27017/myDatabase
AWS_BUCKET_NAME=seu-bucket
AWS_BUCKET_REGION=us-east-1
AWS_ACCESS_KEY=sua-chave
AWS_SECRET_KEY=sua-chave-secreta
```

2. Instale e rode:
```bash
npm install
npm run dev
```

## Deploy (produção)
```bash
npm run build
npm start
```
