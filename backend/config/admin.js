module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'inovadorAdminJwtSecret_83jfd902jfk29f83j209'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'inovadorApiTokenSalt_38fjk209dk38fj302jfk29'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'inovadorTransferTokenSalt_83jfd902jfk29f83'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', false),
    promoteEE: env.bool('FLAG_PROMOTE_EE', false),
  },
});
