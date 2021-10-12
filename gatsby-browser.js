/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
import React from "react";

import FirebaseProvider from "components/FirebaseProvider/FirebaseProvider.jsx"
// import StripeProvider from 'components/StripeProvider/StripeProvider.jsx'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { SnackbarProvider } from "notistack";


export const wrapRootElement = ({ element }) => {
  return (
    <GoogleReCaptchaProvider
    reCaptchaKey={process.env.RECAPTCHA_KEY}
    language="es"
  >
    <SnackbarProvider>
      {/* <StripeProvider> */}
        <FirebaseProvider>
      {element}
      </FirebaseProvider>
      {/* </StripeProvider> */}
    </SnackbarProvider>
  </GoogleReCaptchaProvider>
  )
}