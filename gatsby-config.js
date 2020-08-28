module.exports = {
  pathPrefix: `/mini-gatsbyv2-material-kit-react`,
  siteMetadata: {
    title: 'UNALIVIO',
    titleTemplate: '%s | UNALIVIO - Recarga teléfonos fácil y seguro.',
    description:
      "Unalivio es la forma más fácil, económica y segura de enviar recargas telefónicas de México a Venezuela",
    url: "https://unalivio.com",
    image: "/card.png",
    facebookUsername: 'esunalivio'
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-sri',
      options: {
        hash: 'sha512', // 'sha256', 'sha384' or 'sha512' ('sha512' = default)
        crossorigin: true // Optional
      }
    },
    'gatsby-plugin-resolve-src',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-offline',
    'gatsby-plugin-sass',
    {
      resolve: `gatsby-plugin-material-ui`,
      options: {
        stylesProvider: {
          injectFirst: true,
        },
      },
    },
    {
      resolve: `gatsby-plugin-recaptcha`,
      options: {
          async: false,
          defer: false,
          args: `?render=${process.env.RECAPTCHA_KEY}` // `?onload=onloadCallback&render=explicit`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'UNALIVIO',
        short_name: 'unalivio',
        start_url: '/',
        background_color: '#999999',
        theme_color: '#2c82c4',
        display: 'minimal-ui',
        icon: 'src/assets/img/favicon.png', // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-anchor-links`,
      options: {
        offset: -64, // This path is relative to the root of the site.
      },
    }
  ],
}