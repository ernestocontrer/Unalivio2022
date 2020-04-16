import React from 'react'

const FirebaseContext = React.createContext(null)

const withFirebase = props => (
  <FirebaseContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
)

export {FirebaseContext, withFirebase}

export default ({ children }) => {  
  const [state, setState] = useState({
    firebase: undefined
  })

  const init = () => {
    const app = require('firebase/app')
    const auth = require('firebase/auth')
    const database = require('firebase/database')

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
  }  return (
  <FirebaseContext.Provider value={ firebase }>
    { children }
  </FirebaseContext.Provider>
)}