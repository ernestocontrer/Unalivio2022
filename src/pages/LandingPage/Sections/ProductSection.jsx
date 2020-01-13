import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";

// @material-ui/icons
import ContactMail from '@material-ui/icons/ContactMail';
import People from "@material-ui/icons/People";
import Category from '@material-ui/icons/Category';
import PhoneForwarded from '@material-ui/icons/PhoneForwarded';
import Payment from '@material-ui/icons/Payment';



// React icons
import {FaFacebook, FaTwitter, FaGooglePlusG } from 'react-icons/fa';

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import InfoArea from "components/InfoArea/InfoArea.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";



// JSX
import productStyle from "assets/jss/material-kit-react/views/landingPageSections/productStyle.jsx";

class ProductSection extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  state = {
    from: '',
    to: '',
    amount: '',
    product: '',
    method: '',
    error: ''
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value })
  }
  
  clickSubmit = () => {
    const jwt = auth.isAuthenticated()
    const {
      from,
      to,
      amount,
      product,
      method
    } = this.state;
    const order = {
      from,
      to,
      amount,
      product,
      method
    };

    // when reload
    // then payment details form is shown
    // with button confirm
    

    create({
      userId: jwt.user._id
    }, {
      t: jwt.token
    }, organization).then((data) => {
      if (data.error) {
        this.setState({error: data.error})
      } else {
        this.setState({error: '', redirect: true})
      }
    })
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
                      inputSelections={[ // this will be prefetched from firebase
                        {name: "Digitel", value: 1},
                        {name: "Movistar", value: 2},
                        {name: "Movilnet", value: 3},
                        {name: "Digitel línea fija", value: 4},
                        {name: "Digitel internet", value: 5},
                        {name: "Movistar línea fija", value: 6},
                        {name: "Movistar internet", value: 7},
                        {name: "Movistar prepago", value: 8},
                      ]}
                      inputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Category className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                    />
                    <CustomInput
                      labelText="Forma de pago"
                      id="method"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputSelections={[ // this will be prefetched from firebase
                        {name: "Tarjeta (Débito o Crédito)", value: 0},
                        {name: "Transferencia (SPEI)", value: 1},
                        {name: "Tienda de Conveniencia (OXXO, 7/11, etc.)", value: 2},
                      ]}
                      inputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Payment className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                    />
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <Button color="primary" size="lg">
                      Recargar
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={6}>
              <h2 className={classes.title}>Por cada 100 pesos</h2>
              <h1 className={classes.title}>recargas 100 000 bolívares!</h1>
              <h5 className={classes.description}>*Tasa aproximada sujeta a cambios cada 5min.</h5>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    );
  }
}

export default withStyles(productStyle)(ProductSection);
