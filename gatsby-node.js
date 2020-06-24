/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

exports.onPreBootstrap = ({ reporter }) => {
  // use helpers
  reporter.info(`Using environment ${process.env.NODE_ENV}:`);
}