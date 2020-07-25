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
// import Payment from '@material-ui/icons/Payment';


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

import {CardElement} from '@stripe/react-stripe-js';

// Consumers
import { withFirebase } from 'components/FirebaseProvider/FirebaseProvider.jsx';
import { withStripe } from 'components/StripeProvider/StripeProvider.jsx';
//import { withGoogleRecaptcha } from 'react-google-recaptcha-v3';
import { withSnackbar } from 'notistack'

import orders from 'services/orders';
import rates from 'services/rates';

// JSX
import productStyle from "assets/jss/material-kit-react/views/landingPageSections/productStyle.jsx";

// dates
import { destroyCookie } from "nookies";

import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js'


class ProductSection extends React.Component {
  defaultState = {
    from: '',
    to: '',
    amount: '',
    product: '',
    products: [ // this will be prefetched from firebase
      {name: "DirectTV prepago", value: 9},
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
    rate: '...',
    base: 1,
    error: {
      from: false,
      to: false,
      amount: false,
      product: false
    },
    modal: {
      title: 'Loading...',
      open: false,
      onClose: () => this.closeModal()
    }
  }

  state = this.defaultState

  handleChange = name => event => {
    this.setState({ [name]: event.target.value })
  }

  handlePhone = event => {
    const phone = new AsYouType('VE').input(event.target.value)
    const phoneNumber = parsePhoneNumberFromString(phone, 'VE')

    const error = this.state.error
    error.to = (phoneNumber)? !phoneNumber.isValid() : true;

    this.setState({
      to: phone,
      error: error
    })
  }

  handlePaymentChange = name => event => {
    let payment = this.state.paymentObject;
    payment[name] = event.target.value;
    this.setState({paymentObject: payment})
  }

  refreshRate = () => {
    if (this.props.firebase.apps.length == 0)
      console.error("Error fetching Firebase app")
    else {
      rates(this.props.firebase).last().then(snap => {
        const rate = snap.docs[0].data()

        if (!rate) {
          console.error('Tasa vacía')
        }
        
        this.setState({
          rate: this.formatRate(this.state.base * rate.price)
        })
      }).catch(err => {
        console.error('Error fetching rate!')
      })
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

  checkout = (event) => {
    event.preventDefault()
    this.showModal('Procesando...', {
      variant: 'info',
      persist: true
    });
    const {stripe, elements, firebase} = this.props

    if (!stripe || !elements || !firebase) {
      // Stripe.js and Firebase services have not yet loaded.
      // Make  sure to disable form submission until they're loaded.
      console.error("Services not loaded yet")
      this.showModal('Por favor verifica tu conexión', {
        variant: 'warning',
        persist: false
      });

      return;
    }

    if (firebase.apps.length == 0) {
      // Make sure this Firebase app is loaded
      console.error("Error fetching Firebase app")
      this.showModal('Por favor recarga la página de nuevo', {
        variant: 'danger',
        persist: true
      });
      return;
    }

    // call a firebase function 
    this.generateOrder(firebase).then(result => {
      if (!result.data) {
        console.error('Respuesta sin intent!')
        this.showModal('Por favor intenta de nuevo', {
          variant: 'warning',
          persist: false
        });
        return
      }

      const intent = result.data
      if (!intent.client_secret) {
        console.error('Intent sin client secret')
        this.showModal('Por favor intenta de nuevo', {
          variant: 'warning',
          persist: false
        });
        return
      }

      const secret = intent.client_secret
      /*this.handlePayment(intent.client_secret, stripe, elements)*/
      const card = elements.getElement(CardElement)

      stripe.confirmCardPayment(secret, {
        payment_method: { card }
      }).then(result  => {
        if (result.error) {
          // Show error to your customer (e.g., insufficient funds)
          this.showModal(result.error.message, {
            variant: 'danger',
            persist: false
          });
        } else {
          // The payment has been processed!
          if (result.paymentIntent.status === 'succeeded') {
            // Show a success message to your customer
            // There's a risk of the customer closing the window before callback
            // execution. Set up a webhook or plugin to listen for the
            // payment_intent.succeeded event that handles any business critical
            // post-payment actions.
            this.showModal('Recarga en curso!', {
              variant: 'success',
              persist: false
            });
          }

          destroyCookie(null, "paymentIntentId");
          card.clear()
          this.setState(this.defaultState)
        }
      }).catch(console.error);
    }).catch(error => {
      this.showModal(error.message, {
        variant: 'danger',
        persist: false
      });
    });
  }

  generateOrder = (firebase) => {
    const {product, amount, from, to} = this.state;
    return orders(firebase).create({
      product,
      amount,
      from,
      to
    });
  }
  
  handlePayment =  (secret, stripe, elements) => {
    return stripe.confirmCardPayment(secret, {
      payment_method: {
        card: elements.getElement(CardElement)
      }
    })
  };

  showModal = (message, {variant, persist}) => {
    const {title, actions, open, onClose, ...modal} = this.state.modal
    this.setState({modal: {
      title: message,
      actions: (<Button
        onClick={this.closeModal}
        color={variant}
        simple
        disabled={!!persist}
      >
        {(!!persist)? 'ESPERA' : "CERRAR"}
      </Button>),
      open: true,
      onClose: (!!persist)? () => {} : this.closeModal,
      ...modal
    }});
    if (!persist) setTimeout(this.closeModal, 5000)
  };

  openModal = () => {
    const {open, ...modal} = this.state.modal
    this.setState({modal: {
      open: true,
      ...modal
    }})
  } 

  closeModal = () => {
    const {open, ...modal} = this.state.modal
    this.setState({modal: {
      open: false,
      ...modal
    }})
  }

  componentDidMount = () => {
    this.refreshRate();
    this.interval = setInterval(() => this.refreshRate, 5 * 60 * 1000);
  }

  componentWillUnmount = () => {
    clearInterval(this.interval);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.section}>
        <CustomModal
          id="modal"
          {...this.state.modal}
        />
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={8}>
            <h1 className={classes.title}>¡Recarga teléfonos!</h1>
          </GridItem>
        </GridContainer>
        <div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <Card >
                <form className={classes.form} onSubmit={this.checkout}>
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
                        ),
                        onChange: this.handleChange("from"),
                        value: this.state.from
                      }}
                    />
                    <CustomInput
                      labelText="0412-1234567"
                      id="to"
                      formControlProps={{
                        fullWidth: true
                      }}
                      error={this.state.error.to}
                      inputProps={{
                        type: "tel",
                        pattern: '[0-9]{4}-[0-9]{7}', 
                        required: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <PhoneForwarded className={classes.inputIconsColor} />
                          </InputAdornment>
                        ),
                        onChange: this.handlePhone,
                        value: this.state.to
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
                        endAdornment: "MXN",
                        required: true,
                        min: 10,
                        max: 5000,
                        step: 0.01,
                        onChange: this.handleChange("amount"),
                        value: this.state.amount
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
                    <br />
                    <CardElement />
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <Button type="submit" color="primary" size="lg" >
                      Recargar
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              <h2 className={classes.title}>Por cada {/* <span id="base">{this.state.base}</span> */} peso</h2>
              <h1 className={classes.title}>recibes <span id="rate">{this.state.rate}</span> bolívares!</h1>
              <h5 className={classes.description}>*Tasa aproximada sujeta a cambios cada 15 min.</h5>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    );
  }
}


ProductSection.propTypes = {
  classes: PropTypes.object.isRequired,
  stripe: PropTypes.object.isRequired,
  firebase: PropTypes.object.isRequired,
  //enqueueSnackbar: PropTypes.func.isRequired
};




export default withStyles(productStyle)((withSnackbar(withFirebase(withStripe(ProductSection)))));