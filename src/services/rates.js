const rates = (firebase) => {
  const db = firebase.firestore()
  const ratesRef = db.collection('rates');
  return {
    list: () => (ratesRef.get().then(snap => snap.map(rate => ({
      name: rate.data().price,
      value: rate.id
    })))),
    last: () => (ratesRef.where(
      'pair', '==', db.doc('pairs/VESMXN')
    ).orderBy('time', 'desc').limit(1).get())
  }
}

export default rates