import React,{useState, useEffect} from 'react'
import app from '@firebase/app'
import getFirebase from 'db/firebase'

const FirebaseContext = React.createContext(null)

export {FirebaseContext}

export default ({ children }) => {  
  const [state, setState] = useState({
    firebase: undefined
  })

  const init = () => {
    //const app = require('firebase/app')
    //const auth = require('firebase/auth')
    //const database = require('firebase/database')

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