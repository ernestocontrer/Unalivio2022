import React,{useState, useEffect, Component} from 'react'
import app from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'
import getFirebase from 'db/firebase'




import React from "react";
import useModal from "./useModal";
import Modal from "./modal";


let [modal, setModal] = React.useState(false);
let [modalContent, setModalContent] = React.useState({
  title: 'Loading...',
  open: false,
  onClose: () => this.closeModal()
});

let handleModal = (content = false) => {
  setModal(!modal);
  if (content) {
    setModalContent(content);
  }
};


let ModalContext;
let { Provider } = (ModalContext = React.createContext());

let ModalProvider = ({ children }) => {
  let { modal, handleModal, modalContent } = useModal();
  return (
    <Provider value={{ modal, handleModal, modalContent }}>
      <Modal />
      {children}
    </Provider>
  );
};

export { ModalContext, ModalProvider };


const ModalContext = React.createContext(null)

const withModal = Component => props => (
  <ModalContext.Consumer>
    {modal => <Component {...props} modal={modal} />}
  </ModalContext.Consumer>
)

export {ModalContext, withModal}


export default ({ children }) => {  
  const [state, setState] = useState({
    firebase: undefined
  })

  const init = () => {
    console.log('Injecting modals')
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
  }  return (<ModalContext.Provider value={ state.firebase }>
    { children }
  </ModalContext.Provider>)
}