import React,{useState, useEffect, Component} from 'react'
import app from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/analytics'
import getFirebase from 'db/firebase'

const FirebaseContext = React.createContext(null)

const withFirebase = Component => props => (<FirebaseContext.Consumer>
  {firebase => <Component {...props} firebase={firebase} />}
</FirebaseContext.Consumer>)

export {FirebaseContext, withFirebase}


export default ({ children }) => {  
  const [state, setState] = useState({
    firebase: undefined
  })

  const init = () => {
    console.log('Initializing firebase')
    const firebase = getFirebase(app)
    setState({ firebase })
  }

  useEffect(() => {
    init()
    return () => {
      /* cleanup */
    }
  }, [/* input */])
  
  if (!app.apps.length || !state.firebase) {
    return null
  }  return (<FirebaseContext.Provider value={ state.firebase }>
    { children }
  </FirebaseContext.Provider>)
}