import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import PropTypes from 'prop-types'

// @material-ui/icons
import ContactMail from '@material-ui/icons/ContactMail';
import Redeem from '@material-ui/icons/Redeem';
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
import products from 'services/products';
import amounts from 'services/amounts';
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
    coupon: '',
    amounts: [
      {name: "Cargando...", value: -1},
    ],
    product: '',
    products: [ // this will be prefetched from firebase
      {name: "Cargando...", value: -1},
    ],
    method: '',
    methods: [ // this will be prefetched from firebase
      {name: "Tarjeta (D??bito o Cr??dito)", value: 1},
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

  refreshRate = () => {
    if (this.props.firebase.apps.length == 0)
      console.error("Error fetching Firebase app")
    else {
      rates(this.props.firebase).last().then(snap => {
        const rate = snap.docs[0].data()

        if (!rate) {
          console.error('Tasa vac??a')
        }
        
        this.setState({
          rate: this.formatRate(this.state.base * rate.price)
        })
      }).catch(err => {
        console.error('Error fetching rate!')
      })
    }
  }

  formatRate =  rate => Math.floor((rate + Number.EPSILON) * 100) / 100

  formatAmount = (amount, rate) => `${Math.ceil((((amount / rate) + Number.EPSILON) * 100)) / 100 } MXN`

  refreshAmounts = () => {
    if (this.props.firebase.apps.length == 0)
      console.error("Error fetching Firebase app")
    else {
      amounts(this.props.firebase).list().then(amounts => {
        if (!amounts) {
          console.error('Montos vac??os')
        }

        if (amounts.length == 0) {
          console.error('Montos vac??os')
        }

        this.setState({
          amounts: amounts
        })
      }).catch(console.error)
    }
  }

  refreshProducts = () => {
    if (this.props.firebase.apps.length == 0)
      console.error("Error fetching Firebase app")
    else {
      products(this.props.firebase).list().then(products => {
        if (!products) {
          console.error('Productos vac??os')
        }

        if (products.length == 0) {
          console.error('productos vac??os')
        }

        this.setState({
          products: products
        })
      }).catch(console.error)
    }
  }

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

  handleCoupon = event => {
    const coupon = event.target.value;

    this.setState({
      coupon: coupon.
        toUpperCase().
        replace(/\s/g, "").
        substr(0, 19)
    })
  }

  getPaymentName = (code) => {
    const currentPayment = this.state.methods
      .filter(_ => _.value == code);

    return (currentPayment.length == 0)? "Selecciona un m??todo de pago primero" : currentPayment[0].name;
  }

  confirm = (event) => {
    event.preventDefault();

    this.showModal('Confirma tu orden', {
      variant: 'info',
      persist: true,
      content: (<>
        <ul>
          <li>Email de contacto: {this.state.from}</li>
          <li>Tel??fono: {this.state.to}</li>
          <li>Monto a recargar: {this.state.amount}</li>
        </ul>
      </ >),
      buttons: (<>
        <Button onClick={this.checkout} color="info">CH??VERE PROCEDER</Button>
        <Button onClick={this.closeModal}>REGRESAR Y MODIFICAR</Button>
      </ >)
    });
  }

  checkout = () => {
    this.setState({modal: this.defaultState.modal});

    this.showModal('Procesando datos...', {
      variant: 'info',
      persist: true,
      content: (<>
        <ul>
          <li>Email de contacto: {this.state.from}</li>
          <li>Tel??fono: {this.state.to}</li>
          <li>Monto a recargar: {this.state.amount}</li>
        </ul>
      </ >)
    });
    const {stripe, elements, firebase} = this.props

    if (!stripe || !elements || !firebase) {
      // Stripe.js and Firebase services have not yet loaded.
      // Make  sure to disable form submission until they're loaded.
      console.error("Services not loaded yet")
      this.showModal('Por favor verifica tu conexi??n de internet y recarga la p??gina de nuevo', {
        variant: 'warning',
        persist: false
      });

      return;
    }

    if (firebase.apps.length == 0) {
      // Make sure this Firebase app is loaded
      console.error("Error fetching Firebase app")
      this.showModal('Por favor recarga la p??gina de nuevo', {
        variant: 'danger',
        persist: true
      });
      return;
    }

    // call a firebase function 
    this.showModal('Validando orden...', {
      variant: 'info',
      persist: true
    });

    this.generateOrder(firebase).then(result => {
      const card = elements.getElement(CardElement)

      if (!card) {
        console.error('Tarjeta no pudo leerse')
        this.showModal('Por favor intenta de nuevo', {
          variant: 'warning',
          persist: false
        });
      }

      this.showModal('Procesando pago...', {
        variant: 'info',
        persist: true
      });

      let modalMessage = 'Algo sali?? mal. Por favor cont??ctanos a contacto@unalivio.com y la hora de fallo:' + (new Date());
      let modal =  {
        variant: 'danger',
        persist: false
      }

      this.showModal('Confirmando...', {
        variant: 'info',
        persist: true
      });

      // The payment has been processed!
      destroyCookie(null, "paymentIntentId");
      this.setState(this.defaultState);
      this.showModal('Recarga en curso!', {
        variant: 'success',
        persist: false
      });
      card.clear();
      this.refreshData();
    }).catch(error => {
      this.showModal(error.message, {
        variant: 'danger',
        persist: false
      });
    });
  }

  generateOrder = (firebase) => {
    const {product, amount, from, to, coupon} = this.state;
    return orders(firebase).create({
      product,
      amount,
      from,
      to,
      coupon,
      giveaway: true
    });
  }
  
  handlePayment =  (secret, stripe, elements) => {
    return stripe.confirmCardPayment(secret, {
      payment_method: {
        card: elements.getElement(CardElement)
      }
    })
  };

  showModal = (message, {variant, persist, content, buttons}) => {
    const {title, actions, open, onClose, ...modal} = this.state.modal
    this.setState({modal: {
      ...modal,
      title: message,
      content: content || (<></>),
      actions: (buttons || (<Button
        onClick={this.closeModal}
        color={variant}
        simple
        disabled={!!persist}
      >
        {(!!persist)? 'ESPERA' : "CERRAR"}
      </Button>)),
      open: true,
      onClose: (!!persist)? () => {} : this.closeModal
    }});
    if (!persist) setTimeout(this.closeModal, 15000)
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

  refreshData = () => {
    this.refreshRate();
    this.refreshProducts();
    this.refreshAmounts();
  }

  componentDidMount = () => {
    this.refreshData();
    this.interval = setInterval(() => this.refreshRate(), 5 * 60 * 1000);
  }

  componentWillUnmount = () => {
    clearInterval(this.interval);
  }

  render() {
    const { classes } = this.props;
    return (<div className={classes.background} id="topup">
      <div className={classes.section}>
        <CustomModal
          id="modal"
          {...this.state.modal}
        />
        <div>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={4}>
              <Card>
                <form className={classes.form} onSubmit={this.confirm}>
                  <CardHeader color="primary" className={classes.cardHeader}>
                    <h1 className={classes.title}>??Al??vialo ya!</h1>
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
                      labelText="Compa??ia"
                      id="product"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputSelections={this.state.products}
                      inputProps={{
                        required: true,
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
                      labelText="CUPON"
                      id="coupon"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Redeem className={classes.inputIconsColor} />
                          </InputAdornment>
                        ),
                        onChange: this.handleCoupon,
                        value: this.state.coupon
                      }}
                    />
                    <CardElement />
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={6}> 
                        <Button type="submit" color="secondary" size="lg" round>
                          Recargar
                        </Button>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}> 
                        <h5 className={classes.subtitle}>??Por cada {/* <span id="base">{this.state.base}</span> */} peso
                        recibes <span id="rate">{this.state.rate}</span> bol??vares!</h5>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12}>
                        <h6 className={classes.description}>El precio est?? expresado en pesos mexicanos, para tarjetas de otros pa??ses puede haber cargos adicionales. Consulta con tu banco.</h6>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={8}> 
                        <Button
                          color="transparent"
                          href="/privacy"
                          target="_blank"
                          className={classes.navLink}
                        >
                          <h6 className={classes.description}>??Tu privacidad es importante para nosotros!</h6>
                        </Button>
                      </GridItem>
                    </GridContainer>
                  </CardFooter>
                </form>
              </Card>
            </GridItem>
            <GridItem xs={0} sm={0} md={4} />
          </GridContainer>
        </div>
      </div>
    </div>);
  }
}


ProductSection.propTypes = {
  classes: PropTypes.object.isRequired,
  stripe: PropTypes.object.isRequired,
  firebase: PropTypes.object.isRequired,
  db: PropTypes.object.isRequired,
  functions: PropTypes.object.isRequired,
  //enqueueSnackbar: PropTypes.func.isRequired
};




export default withStyles(productStyle)((withSnackbar(withFirebase(withStripe(ProductSection)))));