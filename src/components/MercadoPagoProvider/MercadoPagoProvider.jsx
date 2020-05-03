import React,{useState, useEffect, Component} from 'react'

import MercadoPago from 'mercadopago'
import getMercadoPago from 'services/mercadopago'

const MercadoPagoContext = React.createContext(null)

const withMercadoPago = Component => props => (
  <MercadoPagoContext.Consumer>
    {mercadopago => <Component {...props} mercadopago={mercadopago} />}
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
  
  if (!app.apps.length || !state.mercadopago) {
    return null
  }  return (<MercadoPagoContext.Provider value={ state.mercadopago }>
    { children }
  </MercadoPagoContext.Provider>)
}