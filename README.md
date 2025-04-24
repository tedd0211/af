This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Biblioteca de Conteúdos

Aplicativo web de streaming para colaboradores e afiliados.

## Deploy no Google App Engine

Para fazer o deploy deste aplicativo no Google App Engine, siga os passos abaixo:

### Pré-requisitos

1. Instale o [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
2. Faça login na sua conta Google:
   ```
   gcloud auth login
   ```
3. Crie um projeto no Google Cloud (ou use um existente):
   ```
   gcloud projects create [SEU-ID-PROJETO] --name="[NOME-DO-PROJETO]"
   ```
4. Configure o projeto padrão:
   ```
   gcloud config set project [SEU-ID-PROJETO]
   ```

### Deploy

1. Na raiz do projeto, execute:
   ```
   gcloud app deploy
   ```
2. Quando solicitado, selecione a região para o seu aplicativo.
3. Confirme o deploy digitando "Y".
4. Após o deploy, você pode acessar o aplicativo com:
   ```
   gcloud app browse
   ```

### Variáveis de ambiente

As variáveis de ambiente do Supabase já estão configuradas no arquivo `app.yaml`. Caso precise alterar:

1. Edite o arquivo `app.yaml`
2. Atualize as variáveis na seção `env_variables`
3. Faça o deploy novamente

### Troubleshooting

- Se ocorrer erro de permissão, verifique se você habilitou a API do App Engine:
  ```
  gcloud services enable appengine.googleapis.com
  ```
- Para logs do aplicativo:
  ```
  gcloud app logs tail
  ```
- Para atualizar o aplicativo, simplesmente execute `gcloud app deploy` novamente.
