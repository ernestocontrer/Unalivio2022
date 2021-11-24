import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import PropTypes from "prop-types";

// @material-ui/icons
import ContactMail from "@material-ui/icons/ContactMail";
import Redeem from "@material-ui/icons/Redeem";
//import People from "@material-ui/icons/People";
import Category from "@material-ui/icons/Category";
import PhoneForwarded from "@material-ui/icons/PhoneForwarded";
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

// Consumers
import { withFirebase } from "components/FirebaseProvider/FirebaseProvider.jsx";
//import { withGoogleRecaptcha } from 'react-google-recaptcha-v3';
import { withSnackbar } from "notistack";
import numberUsedCoupon from "services/numberUsedCoupon";
import orders from "services/orders";
import products from "services/products";
import amounts from "services/amounts";
import rates from "services/rates";
import commision from "services/commision";
import coupons from "services/coupons";
// JSX
import productStyle from "assets/jss/material-kit-react/views/landingPageSections/productStyle.jsx";

// dates
import { destroyCookie } from "nookies";

import { AsYouType, parsePhoneNumberFromString } from "libphonenumber-js";
import requestPago from "../../../services/API/pago";
import Button123Pago from "../../../components/Button123Pago/Button123Pago";
import S from "./style/ProductSection.module.css";
import BasicSelect from "../../../components/FormHeader/FormHeader";
import { padding } from "@mui/system";

class ProductSection extends React.Component {
  defaultState = {
    coupons: [],
    commision: "",
    numberUsedCoupon: [],
    productName: "",
    data: "",
    mode: false,
    from: "",
    to: "",
    amount: "",
    coupon: "",
    amounts: [{ name: "Cargando...", value: -1 }],
    product: "",
    products: [
      // this will be prefetched from firebase
      { name: "MOVISTAR", value: -1 },
    ],
    method: "",
    methods: [
      // this will be prefetched from firebase
      { name: "Tarjeta (Débito o Crédito)", value: 1 },
      //{name: "Transferencia (SPEI)", value: 2},
      //{name: "Tienda de Conveniencia (OXXO, 7/11, etc.)", value: 3},
    ],
    rate: "...",
    base: 1,
    error: {
      from: false,
      to: false,
      amount: false,
      product: false,
    },
    modal: {
      title: "Loading...",
      open: false,
      onClose: () => this.closeModal(),
    },
  };
  state = this.defaultState;
  refreshCoupons = () => {
    if (this.props.firebase.apps.length == 0)
      console.error("Error fetching Firebase app");
    else {
      coupons(this.props.firebase)
        .list()
        .then((coupons) => {
          if (!coupons) {
            console.error("Montos vacíos");
          }

          if (coupons.length == 0) {
            console.error("Montos vacíos");
          }
          console.log(coupons);
          this.setState({
            coupons: [...coupons],
          });
        })
        .catch(console.error);
    }
  };
  refreshRate = () => {
    if (this.props.firebase.apps.length == 0)
      console.error("Error fetching Firebase app");
    else {
      rates(this.props.firebase)
        .last()
        .then((snap) => {
          const rate = snap.docs[0].data();

          if (!rate) {
            console.error("Tasa vacía");
          }

          this.setState({
            rate: this.formatRate(this.state.base * rate.price),
          });
        })
        .catch((err) => {
          console.error("Error fetching rate!");
        });
    }
  };

  formatRate = (rate) => Math.floor((rate + Number.EPSILON) * 100) / 100;

  formatAmount = (amount) =>
    +(amount * (1 + +this.state.commision / 100)).toFixed(2);

  refreshCommision = () => {
    if (this.props.firebase.apps.length == 0)
      console.error("Error fetching Firebase app");
    else {
      commision(this.props.firebase)
        .getCommision()
        .then((commision) => {
          if (!commision) {
            console.error("Montos vacíos");
          }

          if (commision.length == 0) {
            console.error("Montos vacíos");
          }
          console.log(commision);
          this.setState({
            commision: commision[0].commision,
          });
        })
        .catch(console.error);
    }
  };

  refreshAmounts = () => {
    if (this.props.firebase.apps.length == 0)
      console.error("Error fetching Firebase app");
    else {
      amounts(this.props.firebase)
        .list()
        .then((amounts) => {
          if (!amounts) {
            console.error("Montos vacíos");
          }

          if (amounts.length == 0) {
            console.error("Montos vacíos");
          }
          console.log(amounts);
          this.setState({
            amounts: amounts,
          });
        })
        .catch(console.error);
    }
  };

  refreshNumberUsedCoupon = () => {
    if (this.props.firebase.apps.length == 0)
      console.error("Error fetching Firebase app");
    else {
      numberUsedCoupon(this.props.firebase)
        .list()
        .then((numberUsedCoupon) => {
          if (!numberUsedCoupon) {
            console.error("Montos vacíos");
          }

          if (numberUsedCoupon.length == 0) {
            console.error("Montos vacíos");
          }
          console.log("q", numberUsedCoupon);
          this.setState({
            numberUsedCoupon: numberUsedCoupon,
          });
        })
        .catch(console.error);
    }
  };

  refreshProducts = () => {
    if (this.props.firebase.apps.length == 0)
      console.error("Error fetching Firebase app");
    else {
      products(this.props.firebase)
        .list()
        .then((products) => {
          if (!products) {
            console.error("Productos vacíos");
          }

          if (products.length == 0) {
            console.error("productos vacíos");
          }

          this.setState({
            products: products,
          });
          console.log(products);
        })
        .catch(console.error);
    }
  };

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  };

  handlePhone = (event) => {
    console.log(this.state.numberUsedCoupon);
    const phone = new AsYouType("VE").input(event.target.value);
    const productsPair = {
      "0424": "Movistar",
      "0414": "Movistar",
      "0416": "Movilnet",
      "0414": "Movilnet",
      "0412": "Digitel",
    };

    const phoneNum = phone.slice(0, 4);
    if (Object.keys(productsPair).includes(phoneNum)) {
      this.state.products.map((e) => {
        if (e.name === productsPair[phoneNum]) {
          this.setState({ product: e.value });
        }
      });
      this.setState({ productName: productsPair[phoneNum] });
    }
    if (phone.length < 4) {
      this.setState({ productName: "" });
    }
    const phoneNumber = parsePhoneNumberFromString(phone, "VE");
    const error = this.state.error;
    error.to = phoneNumber ? !phoneNumber.isValid() : true;

    this.setState({
      to: phone,
      error: error,
    });
  };

  handlePaymentChange = (name) => (event) => {
    let payment = this.state.paymentObject;
    payment[name] = event.target.value;
    this.setState({ paymentObject: payment });
  };

  handleCoupon = (event) => {
    const coupon = event.target.value;

    this.setState({
      coupon: coupon
        .toUpperCase()
        .replace(/\s/g, "")
        .substr(0, 19),
    });
  };

  getPaymentName = (code) => {
    const currentPayment = this.state.methods.filter((_) => _.value == code);

    return currentPayment.length == 0
      ? "Selecciona un método de pago primero"
      : currentPayment[0].name;
  };

  confirm = (event) => {
    event.preventDefault();
    this.checkout();
  };

  generate = () => {
    const { elements, firebase } = this.props;
    this.generateOrder(firebase)
      .then((result) => {
        if (!result.data) {
          console.error("Respuesta sin intent!");
          this.showModal("Por favor intenta de nuevo", {
            variant: "warning",
            persist: false,
          });
          return;
        }
        const intent = result.data;
        /* 	if (!intent.client_secret) {
        console.error('Intent sin client secret');
        this.showModal('Por favor intenta de nuevo ಥ_ಥ', {
          variant: 'warning',
          persist: false,
        });
        return;
      } */

        const secret = intent.client_secret;
        /*this.handlePayment(intent.client_secret, stripe, elements)*/
        /*  this.showModal("Procesando pago...", {
        variant: "info",
        persist: true,
      }); */
      })
      .catch((error) => {
        this.showModal(error.message, {
          variant: "danger",
          persist: false,
        });
      });
  };

  checkout = async () => {
    this.setState({ modal: this.defaultState.modal });
    console.log(this.state.coupon);
    await requestPago(
      this.state.from,
      this.state.to,
      +this.formatAmount(this.state.amount),
    )
      .then((response) => {
        this.setState({ data: response.data });
        /*  this.setState({ mode: true }); */
      })
      .then(() => {
        const access = this.state.numberUsedCoupon.filter(
          (e) => e.number === this.state.to,
        );
        /*  const accessLocalStorage = () => {
          const data = localStorage.getItem("numberUsedCoupon");
          return data.filter((e) => e === this.state.to).length === 1
            ? false
            : true;
        }; */

        if (
          access.length === 1 &&
          this.state.coupon !== ""
          /*  accessLocalStorage() */
        ) {
          this.showModal("Confirma tu orden", {
            variant: "info",
            persist: true,
            content: (
              <>
                <div> This coupon only for 1time </div>
              </>
            ),
            buttons: (
              <Button
                onClick={this.closeModal}
                style={{
                  marginLeft: "15px",
                }}
              >
                REGRESAR Y MODIFICAR
              </Button>
            ),
          });
        } else {
          this.showModal("Confirma tu orden", {
            variant: "info",
            persist: true,
            content: (
              <>
                <ul>
                  <li>Email de contacto: {this.state.from}</li>
                  <li>Teléfono: {this.state.to}</li>
                  <li>
                    Monto a recargar: {+this.formatAmount(this.state.amount)}
                  </li>
                </ul>
              </>
            ),
            buttons: (
              <>
                <Button123Pago
                  data={this.state.data}
                  closeModal={() => {
                    this.generate();
                    setTimeout(() => {
                      this.clearForms();
                      this.closeModal();
                    }, 5000);
                  }}
                ></Button123Pago>
                {/* <Button onClick={this.checkout} color="info">
            CHÉVERE PROCEDER!!!
          </Button >*/}
                <Button
                  onClick={this.closeModal}
                  style={{
                    marginLeft: "15px",
                  }}
                >
                  REGRESAR Y MODIFICAR
                </Button>
              </>
            ),
          });
        }
      });

    /*    this.showModal("Procesando datos...", {
      variant: "info",
      persist: true,
      content: (
        <>
          <ul>
            <li>Email de contacto: {this.state.from}</li>
            <li>Teléfono: {this.state.to}</li>
            <li>Monto a recargar: {this.state.amount}</li>
          </ul>
        </>
      ),
    }); */
    const { elements, firebase } = this.props;

    /*   if (!elements || !firebase) {
      // Make  sure to disable form submission until they're loaded.
      console.error("Services not loaded yet");
      this.showModal(
        "Por favor verifica tu conexión de internet y recarga la página de nuevo",
        {
          variant: "warning",
          persist: false,
        },
      );

      return;
    } */

    /*  if (firebase.apps.length == 0) {
      // Make sure this Firebase app is loaded
      console.error("Error fetching Firebase app");
      this.showModal("Por favor recarga la página de nuevo", {
        variant: "danger",
        persist: true,
      });
      return;
    } */

    // call a firebase function
    /*   this.showModal("Validando orden...", {
      variant: "info",
      persist: true,
    }); */
    // this.showModal('Validando orden...', {
    // 	variant: 'info',
    // 	persist: true,
    // });
  };

  clearForms = () => {
    this.setState({
      productName: "",
      mode: false,
      from: "",
      to: "",
      amount: "",
      coupon: "",
      product: "",
    });
  };

  generateOrder = (firebase) => {
    const { productName, product, amount, from, to, coupon } = this.state;

    return orders(firebase).create({
      commision,
      productName,
      product,
      amount,
      from,
      to,
      coupon,
    });
  };

  showModal = (message, { variant, persist, content, buttons }) => {
    const { title, actions, open, onClose, ...modal } = this.state.modal;
    this.setState({
      modal: {
        ...modal,
        title: message,
        content: content || <></>,
        actions: buttons || (
          <Button
            onClick={this.closeModal}
            color={variant}
            simple
            disabled={!!persist}
          >
            {!!persist ? "ESPERA" : "CERRAR"}
          </Button>
        ),
        open: true,
        onClose: !!persist ? () => {} : this.closeModal,
      },
    });
    if (!persist) setTimeout(this.closeModal, 15000);
  };

  openModal = () => {
    console.log("parfagor");
    const { open, ...modal } = this.state.modal;
    this.setState({
      modal: {
        open: true,
        ...modal,
      },
    });
  };

  closeModal = () => {
    const { open, ...modal } = this.state.modal;
    this.setState({
      modal: {
        open: false,
        ...modal,
      },
    });
  };

  refreshData = () => {
    this.refreshNumberUsedCoupon();
    this.refreshRate();
    this.refreshProducts();
    this.refreshAmounts();
    this.refreshCommision();
    this.refreshCoupons();
  };

  componentDidMount = () => {
    this.refreshData();
    this.interval = setInterval(() => this.refreshRate(), 5 * 60 * 1000);
  };

  componentWillUnmount = () => {
    clearInterval(this.interval);
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className={S.form}>
          <BasicSelect
            error={this.state.error.to}
            handlePhone={this.handlePhone}
            to={this.state.to}
            productName={this.state.productName}
            a={this.state.products}
            inputSelections={this.state.products}
          />
        </div>
        <div className={classes.background} id="topup">
          <div className={classes.section}>
            <CustomModal id="modal" {...this.state.modal} />
            <div>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={4}>
                  <Card>
                    <form className={classes.form} onSubmit={this.confirm}>
                      <CardHeader
                        color="primary"
                        className={classes.cardHeader}
                      >
                        <h1 className={classes.title}>¡Alívialo ya!</h1>
                      </CardHeader>
                      <CardBody>
                        <CustomInput
                          labelText="email_de@contacto.com"
                          id="from"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            type: "email",
                            required: true,
                            endAdornment: (
                              <InputAdornment position="end">
                                <ContactMail
                                  className={classes.inputIconsColor}
                                />
                              </InputAdornment>
                            ),
                            onChange: this.handleChange("from"),
                            value: this.state.from,
                          }}
                        />
                        <CustomInput
                          labelText="0412-1234567"
                          id="to"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          error={this.state.error.to}
                          inputProps={{
                            type: "tel",
                            pattern: "[0-9]{4}-[0-9]{7}",
                            required: true,
                            endAdornment: (
                              <InputAdornment position="end">
                                <PhoneForwarded
                                  className={classes.inputIconsColor}
                                />
                              </InputAdornment>
                            ),
                            onChange: this.handlePhone,
                            value: this.state.to,
                          }}
                        />
                        <CustomInput
                          labelText="Monto"
                          id="amount"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputSelections={this.state.amounts}
                          inputProps={{
                            required: true,
                            endAdornment: (
                              <InputAdornment position="end">
                                <span className={classes.inputIconsColor}>
                                  {`${this.formatAmount(
                                    this.state.amount,
                                  )} Bs.S`}
                                </span>
                              </InputAdornment>
                            ),
                            onChange: this.handleChange("amount"),
                            value: this.state.amount,
                          }}
                        />
                        <CustomInput
                          labelText="Compañia"
                          id="product"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          /*  inputSelections={this.state.products} */
                          inputProps={{
                            readOnly: true,
                            required: true,
                            endAdornment: (
                              <InputAdornment position="end">
                                <Category className={classes.inputIconsColor} />
                              </InputAdornment>
                            ),
                            onChange: this.handleChange("product"),
                            value: this.state.productName,
                          }}
                        />
                        <CustomInput
                          labelText="CUPON"
                          id="coupon"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            type: "text",
                            endAdornment: (
                              <InputAdornment position="end">
                                <Redeem className={classes.inputIconsColor} />
                              </InputAdornment>
                            ),
                            onChange: this.handleCoupon,
                            value: this.state.coupon,
                          }}
                        />
                      </CardBody>
                      <CardFooter className={classes.cardFooter}>
                        <GridContainer className={S.formText}>
                          <GridItem
                            xs={12}
                            sm={12}
                            md={12}
                            className={S.formText}
                          >
                            <Button
                              type="submit"
                              color="secondary"
                              size="lg"
                              round
                            >
                              Recargar
                            </Button>
                          </GridItem>
                          <GridItem
                            xs={12}
                            sm={12}
                            md={12}
                            className={S.formText}
                          >
                            <Button
                              color="transparent"
                              href="/privacy"
                              target="_blank"
                              className={classes.navLink}
                            >
                              <h6 className={classes.description}>
                                ¡Tu privacidad es importante para nosotros!
                              </h6>
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
        </div>
      </div>
    );
  }
}

ProductSection.propTypes = {
  classes: PropTypes.object.isRequired,
  firebase: PropTypes.object.isRequired,
  db: PropTypes.object.isRequired,
  functions: PropTypes.object.isRequired,
  //enqueueSnackbar: PropTypes.func.isRequired
};

export default withStyles(productStyle)(
  withSnackbar(withFirebase(ProductSection)),
);
