const Config = {
  baseUrl: import.meta.env.VITE_BASE_URL || 'http://localhost:4500',
  authorization: import.meta.env.VITE_AUTHORIZATION || '',
  secretKeCrypto: import.meta.env.VITE_CRIPTO_SECRET,
};

export default Config;
