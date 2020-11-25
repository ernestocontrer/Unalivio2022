import React,{useState, useEffect, Component} from 'react'
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

    const lazyFirebase = {
      app:  import('firebase/app'),
      firestore: import('firebase/firestore'),
      functions: import('firebase/functions'),
      analytics: import('firebase/analytics')
    }

    Promise.all([
      lazyFirebase.app, 
      lazyFirebase.firestore,
      lazyFirebase.functions,
      lazyFirebase.analytics
    ]).then(([app]) => {
      const firebase = getFirebase(app)
      return setState({ firebase });
    }).catch(console.error);

    //const firebase = getFirebase(app)
  }

  useEffect(() => {
    init()
    return () => {
      /* cleanup */
    }
  }, [/* input */])
  
  if (!state.firebase || !state.firebase.apps.length) {
    return null
  }  return (<FirebaseContext.Provider value={ state.firebase }>
    { children }
  </FirebaseContext.Provider>)
}