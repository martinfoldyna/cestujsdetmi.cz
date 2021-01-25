module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', '3ba55dd804c381c0c26c84393d19e18d'),
    },
  },
  sendgrid_api_key: env('SENDGRID_API_KEY', ),
  // cron: {enabled: true}
});
