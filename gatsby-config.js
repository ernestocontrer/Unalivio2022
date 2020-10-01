const activeEnv = process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || "development"

console.log(`Using environment config: '${activeEnv}'`)

require("dotenv").config({
  path: `.env.${activeEnv}`,
})

module.exports = {
  pathPrefix: `/mini-gatsbyv2-material-kit-react`,
  siteMetadata: {
    title: 'UNALIVIO',
    titleTemplate: '%s | UNALIVIO - Recarga teléfonos fácil y seguro.',
    description:
      "UnAlivio es la forma más fácil, segura y económica para enviar recargas telefónicas de México a Venezuela",
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
    /*{
      resolve: `gatsby-plugin-gtag`,
      options: {
        // The property ID; the tracking code won't be generated without it
        trackingId: `${process.env.GOOGLE_ANALYTICS_TRACKING_ID}`,
        // Defines where to place the tracking script - `true` in the head and `false` in the body
        head: false,
        // Setting this parameter is optional
        anonymize: true,
        // Setting this parameter is also optional
        respectDNT: false,
        // Avoids sending pageview hits from custom paths
        //exclude: ["/preview/**", "/do-not-track/me/too/"],
        // Delays sending pageview hits on route update (in milliseconds)
        pageTransitionDelay: 0,
        // Enables Google Optimize using your container Id
        //optimizeId: "YOUR_GOOGLE_OPTIMIZE_TRACKING_ID",
        // Enables Google Optimize Experiment ID
        //experimentId: "YOUR_GOOGLE_EXPERIMENT_ID",
        // Set Variation ID. 0 for original 1,2,3....
        //variationId: "YOUR_GOOGLE_OPTIMIZE_VARIATION_ID",
        // Defers execution of google analytics script after page load
        defer: false,
        // Any additional optional fields
        sampleRate: 5,
        siteSpeedSampleRate: 10,
        cookieDomain: "unalivio.com",
      },
    },*/
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