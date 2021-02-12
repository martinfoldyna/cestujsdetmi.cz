// TODO: UNTRACK THIS FILE ON GIT!!!!



module.exports = ({env}) => ({
  upload: {
    provider: 'google-cloud-storage',
    providerOptions: {
      bucketName: process.env.STORAGE_BUCKET_NAME,
      publicFiles: true,
      uniform: false,
      baseUrl: `https://storage.googleapis.com/${process.env.STORAGE_BUCKET_NAME}`,
      basePath: "",
      serviceAccount: {
        type: process.env.STORAGE_TYPE,
        project_id: process.env.STORAGE_PROJECT_ID,
        private_key_id: process.env.STORAGE_PRIVATE_KEY_ID,
        private_key: process.env.STORAGE_PRIVATE_KEY,
        client_email: process.env.STORAGE_CLIENT_EMAIL,
        client_id: process.env.STORAGE_CLIENT_ID,
        auth_uri: process.env.STORAGE_AUTH_URI,
        token_uri: process.env.STORAGE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.STORAGE_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.STORAGE_CLIENT_X509_CERT_URL,
      },
    }
  },
  email: {
    provider: env('EMAIL_PROVIDER'),
    providerOptions: {
      host: env('EMAIL_SMTP_HOST'),
      port: env('EMAIL_SMTP_PORT', 587),
      auth: {
        user: env('EMAIL_SMTP_USER'),
        pass: env('EMAIL_SMTP_PASS'),
      },
    },
    settings: {
      defaultFrom: env('EMAIL_ADDRESS_FROM'),
      defaultReplyTo: env('EMAIL_ADDRESS_REPLY'),
    },
  },
})
