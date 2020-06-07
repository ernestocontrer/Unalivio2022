const calls = {
  create: 'generateOrder'
}

const orders = (firebase) => ({
  create: (order) => firebase.functions().httpsCallable(calls.create)(order),
})

export default orders 