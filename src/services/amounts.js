const calls = {
  list: 'amounts-list'
}

const amounts = (firebase) => {
  const amountsRef = firebase.firestore().collection('amounts');
  return {
    list: () => (amountsRef.get().then(snap => snap.docs.map(doc => ({
      name: doc.data().name,
      value: doc.data().value
    }))))
  }
}

export default amounts