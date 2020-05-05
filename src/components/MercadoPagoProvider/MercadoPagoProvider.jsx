import React,{useState, useEffect} from 'react'

import MercadoPago from 'mercadopago'
import getMercadoPago from 'services/mercadopago'
import { Helmet } from "react-helmet"

const MercadoPagoContext = React.createContext(null)

const withMercadoPago = Component => props => (
  <MercadoPagoContext.Consumer>
    {mercadopago => <>
      <Helmet>
      <script src="https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js"></script>
      </Helmet>
      <Component {...props} mercadopago={mercadopago} />
    </>
    }
  </MercadoPagoContext.Consumer>
)

export {MercadoPagoContext, withMercadoPago }


export default ({ children }) => {  
  const [state, setState] = useState({
    mercadopago: undefined
  })

  const init = () => {
    console.log('Initializing MercadoPago')
    const mercadopago = getMercadoPago(MercadoPago)
    setState({ mercadopago })
  }

  useEffect(() => {
    init()
    return () => {
      /* cleanup */
    }
  }, [/* input */])
  
  if (!state.mercadopago) {
    return null
  }  return (<MercadoPagoContext.Provider value={ state.mercadopago }>
    { children }
  </MercadoPagoContext.Provider>)
}