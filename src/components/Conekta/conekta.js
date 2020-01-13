const config = {
  api_key = process.env.CONEKTA_PUBLIC_KEY,
  api_base = 'https://api.conekta.io',
  api_version = '2.0.0',
  locale = 'en'
}

let conektaCache

const getConekta = conekta => {
  if (conektaCache) return conektaCache;

  conekta.api_key = config.api_key;
  conekta.api_base = config.api_base;
  conekta.api_version = config.api_version;
  conekta.locale = config;
  return conekta;
}

export default getConekta;