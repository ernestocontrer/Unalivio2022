module.exports = {
  pathPrefix: `/mini-gatsbyv2-material-kit-react`,
  siteMetadata: {
    title: 'ALIVIAME',
    titleTemplate: '%s | ALIVIAME - Recarga teléfonos venezolanos desde México fácil y seguro.',
    description:
      "Aliviame es la forma más fácil, económica y segura de enviar recargas telefónicas de México a Venezuela",
    url: "https://aliviame.io",
    image: "/card.png",
    facebookUsername: 'aliviameya'
  },
  plugins: [
    'gatsby-plugin-resolve-src',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-offline',
    'gatsby-plugin-sass',
    'gatsby-plugin-material-ui',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/assets/img/favicon.png', // This path is relative to the root of the site.
      },
    },
  ],
}