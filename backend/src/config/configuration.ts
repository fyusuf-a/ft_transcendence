export default () => {
  return {
    AVATAR_SUFFIX: '_avatar.',
    BACKEND_42_UID: process.env.BACKEND_42_UID,
    BACKEND_42_SECRET: process.env.BACKEND_42_SECRET,
    BACKEND_GOOGLE_UID: process.env.BACKEND_GOOGLE_UID,
    BACKEND_GOOGLE_SECRET: process.env.BACKEND_GOOGLE_SECRET,
    URL: process.env.URL,
    JWT_EXPIRATION_TIME: '60m',
    JWT_SECRET: process.env.JWT_SECRET_KEY,
    MAX_FILE_SIZE: 2 * 1000 * 1000,
    UPLOADS_PATH: './uploads/',
    TWO_FACTOR_AUTHENTICATION_APP_NAME: 'ft_transcendence',
  };
};
