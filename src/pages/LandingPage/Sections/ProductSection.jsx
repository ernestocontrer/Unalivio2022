import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import PropTypes from 'prop-types'

// @material-ui/icons
import ContactMail from '@material-ui/icons/ContactMail';
//import People from "@material-ui/icons/People";
import Category from '@material-ui/icons/Category';
import PhoneForwarded from '@material-ui/icons/PhoneForwarded';
import Payment from '@material-ui/icons/Payment';

// React icons
import {FaFacebook, FaTwitter, FaGooglePlusG } from 'react-icons/fa';

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
//import InfoArea from "components/InfoArea/InfoArea.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import CustomModal from "components/CustomModal/CustomModal.jsx";

// Firebase
import { withFirebase } from 'components/FirebaseProvider/FirebaseProvider.jsx';
import { withMercadoPago } from 'components/MercadoPagoProvider/MercadoPagoProvider.jsx';

// JSX
import productStyle from "assets/jss/material-kit-react/views/landingPageSections/productStyle.jsx";

// dates
const dateFormat = require('date-fns/format')

class ProductSection extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  defaultState = {
    from: '',
    to: '',
    amount: '',
    product: '',
    products: [ // this will be prefetched from firebase
      {name: "Digitel", value: 1},
      {name: "Movistar", value: 2},
      {name: "Movilnet", value: 3},
      {name: "Digitel línea fija", value: 4},
      {name: "Digitel internet", value: 5},
      {name: "Movistar línea fija", value: 6},
      {name: "Movistar internet", value: 7},
      {name: "Movistar prepago", value: 8},
    ],
    method: '',
    methods: [ // this will be prefetched from firebase
      {name: "Tarjeta (Débito o Crédito)", value: 1},
      //{name: "Transferencia (SPEI)", value: 2},
      //{name: "Tienda de Conveniencia (OXXO, 7/11, etc.)", value: 3},
    ],
    rate: 100/25,
    base: 100,
    error: '',
    paymentContent: classes => (<div></div>),
    paymentActions: classes => (<Button onClick={this.closeModal}>REGRESAR</Button>),
    paymentObject: {
      number: "0000000000000000", 
      name: "FULANITO PEREZ",
      cvc: "123",
      exp_my: undefined,
    },
    paymentModal: false
  }

  state = this.defaultState

  handleChange = name => event => {
    this.setState({ [name]: event.target.value })
  }

  handlePaymentChange = name  =>  event => {
    let payment = this.state.paymentObject;
    payment[name] = event.target.value;
    this.setState({paymentObject: payment})
  }

  handleCardMonthChange = event => {
    let payment = this.state.paymentObject;
    payment.exp_month = event.target.value.getMonth() + 1;
    payment.exp_year = event.target.value.getFullYear();
    this.setState({
      paymentObject: payment
    })
  }

  handleCardNumberChange = event => {
    let payment = this.state.paymentObject;
    
  }

  currentMonth = () => {
    
  }

  currentYear = () => {
    
  }

  componentDidMount = () => {
    //voa uamar a firebase
    this.init();
  }

  init = (params) => {
    // tengo que conectarme a firebase
    // e ahí jalo la tasa
    // y la pongo en el state
  }

  fetchPaymentMethods = (firebase) => {
    
  }



  refreshRate = () => {
    if (this.props.firebase.apps.length == 0)
      console.error("Error fetching Firebase app")
    else {
      const db = this.props.firebase.firestore()
      db.collection('rates')
        .orderBy('time', 'desc')
        .where('pair', '==', db.doc('pairs/USDMXN'))
        .limit(1)
        .get().then(snap => {
          snap.forEach(doc => {
            const price = doc.data().price
            const rate = this.formatRate(this.state.base / price)
            this.setState({rate})
          })
        }).catch(console.error)
    }
  }

  formatRate =  rate => Math.round((rate + Number.EPSILON) * 100) / 100

  getPaymentName = (code) => {
    const currentPayment = this.state.methods
      .filter(_ => _.value == code);

    return (currentPayment.length == 0)? "Selecciona un método de pago primero" : currentPayment[0].name;
  }

  getProductName = (code) => {
    const currentProducts = this.state.products
      .filter(_ => _.value == code);

    return (currentProducts.length == 0)? "Selecciona un producto primero" : currentProducts[0].name;
  }

  showModal = () => this.setState({paymentModal: true})

  closeModal = () => this.setState({paymentModal: false})

  renderCheckout = (method) => {
    switch(this.state.method) {
      case(1): {
        this.setState({
          paymentContent: classes => (<div>
            <CustomInput
              labelText="Nombre del titular"
              id="card-name"
              formControlProps={{
                fullWidth: true
              }}
              inputProps={{
                type: "text",
                required: true,
                placeholder: "JUAN L PEREZ GODINEZ",
                helperText: 'Tal y como viene en la tarjeta',
                onChange: this.handlePaymentChange("name"),
                endAdornment: (
                  <InputAdornment position="end">
                    <ContactMail className={classes.inputIconsColor} />
                  </InputAdornment>
                )
              }}
            />
            
          </div>),
          paymentActions: classes => (<div>
            <Button >RECARGAR</Button>
          </div>)
        })
        break;
      }
      case(2): {
        this.setState({
          paymentContent: classes => <div>checkout spei</div>,
          paymentActions: classes => (<div>
            <Button >DESCARGAR</Button>
          </div>)
        })
        break;
      }
      case(3): {
        this.setState({
          paymentContent: classes => <div>checkout spei</div>,
          paymentActions: classes => (<div>
            <Button >DESCARGAR E IR A PAGAR</Button>
          </div>)
        });
        break;
      }
      default: {
        this.setState({
          paymentContent: classes => <div></div>
        })
        break;
      }
    }
  }

  checkout = () => {
    // call a firebase function 
    // generarCheckout
    this.generateCheckout()
    this.showModal()
  }

  generateOrder = () => {
    
  }

  componentDidMount = () => {
    this.interval = setInterval(() => this.refreshRate, 5 * 60 * 1000);
  }

  componentWillUnmount = () => {
    clearInterval(this.interval);
  }

  clickSubmit = () => {
    //const jwt = auth.isAuthenticated()
    const {
      from,
      to,
      amount,
      product,
      method,
      payment
    } = this.state;

    const order = {
      from,
      to,
      amount,
      product,
      method,
      payment,
    };

    // when reload
    // then payment details form is shown
    // with button confirm
    

    // create({
    //   //userId: jwt.user._id
    // }, {
    //   //t: jwt.token
    // }, organization).then((data) => {
    //   if (data.error) {
    //     this.setState({error: data.error})
    //   } else {
    //     this.setState({error: '', redirect: true})
    //   }
    // })
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.section}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={8}>
            <h1 className={classes.title}>¡Recarga teléfonos venezolanos desde México!</h1>
          </GridItem>
        </GridContainer>
        <div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <Card >
                <form className={classes.form}>
                  <CardHeader color="primary" className={classes.cardHeader}>
                    <h4>Es muy fácil, rápido y seguro</h4>
                  </CardHeader>
                  <CardBody>
                    <CustomInput
                      labelText="email_de@contacto.com"
                      id="from"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "email",
                        required: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <ContactMail className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                    />
                    <CustomInput
                      labelText="0412-1234567"
                      id="to"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        endAdornment: (
                          <InputAdornment position="end">
                            <PhoneForwarded className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                    />
                    <CustomInput
                      labelText="123.00"
                      id="amount"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "number",
                        endAdornment: "MXN"
                      }}
                    />
                    <CustomInput
                      labelText="Compañia"
                      id="product"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputSelections={this.state.products}
                      inputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Category className={classes.inputIconsColor} />
                          </InputAdornment>
                        ),
                        onChange: this.handleChange("product"),
                        value: this.state.product
                      }}
                    />
                    <CustomInput
                      labelText="Forma de pago"
                      id="method"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputSelections={this.state.methods}
                      inputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Payment className={classes.inputIconsColor} />
                          </InputAdornment>
                        ),
                        onChange: this.handleChange("method"),
                        value: this.state.method
                      }}
                    />
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <Button color="primary" size="lg" onClick={this.checkout} >
                      Recargar
                    </Button>
                  </CardFooter>
                  <CustomModal
                    id="payment"
                    title={this.getPaymentName(this.state.method)}
                    content={this.state.paymentContent(classes)}
                    actions={this.state.paymentActions(classes)}
                    open={this.state.paymentModal}
                    onClose={this.closeModal}
                  />
                </form>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              <h2 className={classes.title}>Por cada <span id="base">{this.state.base}</span> pesos</h2>
              <h1 className={classes.title}>recargas <span id="rate">{this.state.rate}</span> dólares!</h1>
              <h5 className={classes.description}>*Tasa aproximada sujeta a cambios cada 5min.</h5>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    );
  }
}

export default withStyles(productStyle)(withMercadoPago(withFirebase((ProductSection))));
