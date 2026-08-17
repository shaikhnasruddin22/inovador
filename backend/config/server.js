module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS', [
      'inovadorDevAppKey1_9f83j209fk2',
      'inovadorDevAppKey2_8fj302jfk29',
      'inovadorDevAppKey3_38fjk209dk3',
      'inovadorDevAppKey4_83jfd902jfk',
    ]),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
