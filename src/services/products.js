const calls = {
  list: 'products-list'
}

const products = (firebase) => {
  const productsRef = firebase.firestore().collection('products');
  return {
    list: () => (productsRef.get().then(snap => snap.docs.map(product => ({
      name: product.data().name,
      value: product.id
    }))))
  }
}

export default products