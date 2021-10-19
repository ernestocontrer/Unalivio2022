import React from 'react';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import InputAdornment from '@material-ui/core/InputAdornment';
import PropTypes from 'prop-types';

// @material-ui/icons
import ContactMail from '@material-ui/icons/ContactMail';
import Redeem from '@material-ui/icons/Redeem';
//import People from "@material-ui/icons/People";
import Category from '@material-ui/icons/Category';
import PhoneForwarded from '@material-ui/icons/PhoneForwarded';
// import Payment from '@material-ui/icons/Payment';

// core components
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
//import InfoArea from "components/InfoArea/InfoArea.jsx";
import Button from 'components/CustomButtons/Button.jsx';
import Card from 'components/Card/Card.jsx';
import CardBody from 'components/Card/CardBody.jsx';
import CardHeader from 'components/Card/CardHeader.jsx';
import CardFooter from 'components/Card/CardFooter.jsx';
import CustomInput from 'components/CustomInput/CustomInput.jsx';
import CustomModal from 'components/CustomModal/CustomModal.jsx';

// Consumers
import { withFirebase } from 'components/FirebaseProvider/FirebaseProvider.jsx';
//import { withGoogleRecaptcha } from 'react-google-recaptcha-v3';
import { withSnackbar } from 'notistack';

import orders from 'services/orders';
import products from 'services/products';
import amounts from 'services/amounts';
import rates from 'services/rates';

// JSX
import productStyle from 'assets/jss/material-kit-react/views/landingPageSections/productStyle.jsx';

// dates
import { destroyCookie } from 'nookies';

import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js';
import requestPago from '../../../services/API/pago';
import Button123Pago from '../../../components/Button123Pago/Button123Pago';
import S from './style/ProductSection.module.css';
import BasicSelect from '../../../components/FormHeader/FormHeader';

class ProductSection extends React.Component {
	defaultState = {
		data: '',
		mode: false,
		from: '',
		to: '',
		amount: '',
		coupon: '',
		amounts: [{ name: 'Cargando...', value: -1 }],
		product: '',
		products: [
			// this will be prefetched from firebase
			{ name: 'Cargando...', value: -1 },
		],
		method: '',
		methods: [
			// this will be prefetched from firebase
			{ name: 'Tarjeta (Débito o Crédito)', value: 1 },
			//{name: "Transferencia (SPEI)", value: 2},
			//{name: "Tienda de Conveniencia (OXXO, 7/11, etc.)", value: 3},
		],
		rate: '...',
		base: 1,
		error: {
			from: false,
			to: false,
			amount: false,
			product: false,
		},
		modal: {
			title: 'Loading...',
			open: false,
			onClose: () => this.closeModal(),
		},
	};
	state = this.defaultState;

	refreshRate = () => {
		if (this.props.firebase.apps.length == 0)
			console.error('Error fetching Firebase app');
		else {
			rates(this.props.firebase)
				.last()
				.then(snap => {
					const rate = snap.docs[0].data();

					if (!rate) {
						console.error('Tasa vacía');
					}

					this.setState({
						rate: this.formatRate(this.state.base * rate.price),
					});
				})
				.catch(err => {
					console.error('Error fetching rate!');
				});
		}
	};

	formatRate = rate => Math.floor((rate + Number.EPSILON) * 100) / 100;

	formatAmount = (amount, rate) =>
		`${Math.ceil((amount / rate + Number.EPSILON) * 100) / 100} MXN`;

	refreshAmounts = () => {
		if (this.props.firebase.apps.length == 0)
			console.error('Error fetching Firebase app');
		else {
			amounts(this.props.firebase)
				.list()
				.then(amounts => {
					if (!amounts) {
						console.error('Montos vacíos');
					}

					if (amounts.length == 0) {
						console.error('Montos vacíos');
					}

					this.setState({
						amounts: amounts,
					});
				})
				.catch(console.error);
		}
	};

	refreshProducts = () => {
		if (this.props.firebase.apps.length == 0)
			console.error('Error fetching Firebase app');
		else {
			products(this.props.firebase)
				.list()
				.then(products => {
					if (!products) {
						console.error('Productos vacíos');
					}

					if (products.length == 0) {
						console.error('productos vacíos');
					}

					this.setState({
						products: products,
					});
				})
				.catch(console.error);
		}
	};

	handleChange = name => event => {
		this.setState({ [name]: event.target.value });
	};

	handlePhone = event => {
		const phone = new AsYouType('VE').input(event.target.value);
		const phoneNumber = parsePhoneNumberFromString(phone, 'VE');
		const error = this.state.error;
		error.to = phoneNumber ? !phoneNumber.isValid() : true;

		this.setState({
			to: phone,
			error: error,
		});
	};

	handlePaymentChange = name => event => {
		let payment = this.state.paymentObject;
		payment[name] = event.target.value;
		this.setState({ paymentObject: payment });
	};

	handleCoupon = event => {
		const coupon = event.target.value;

		this.setState({
			coupon: coupon.toUpperCase().replace(/\s/g, '').substr(0, 19),
		});
	};

	getPaymentName = code => {
		const currentPayment = this.state.methods.filter(_ => _.value == code);

		return currentPayment.length == 0
			? 'Selecciona un método de pago primero'
			: currentPayment[0].name;
	};

	confirm = event => {
		event.preventDefault();
		this.checkout();
	};

	checkout = async () => {
		this.setState({ modal: this.defaultState.modal });

		await requestPago(this.state.from, this.state.to, this.state.amount)
			.then(response => {
				this.setState({ data: response.data });
				/*  this.setState({ mode: true }); */
			})
			.then(() => {
				this.showModal('Confirma tu orden', {
					variant: 'info',
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
					buttons: (
						<>
							<Button123Pago
								data={this.state.data}
								//  clearForms={this.clearForms}
								closeModal={this.closeModal.bind(this)}
							></Button123Pago>
							{/* <Button onClick={this.checkout} color="info">
				  CHÉVERE PROCEDER!!!
				</Button >*/}
							<Button onClick={this.closeModal}>REGRESAR Y MODIFICAR</Button>
						</>
					),
				});
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
		this.generateOrder(firebase)
			.then(result => {
				if (!result.data) {
					console.error('Respuesta sin intent!');
					this.showModal('Por favor intenta de nuevo', {
						variant: 'warning',
						persist: false,
					});
					return;
				}

				const intent = result.data;
				if (!intent.client_secret) {
					console.error('Intent sin client secret');
					this.showModal('Por favor intenta de nuevo', {
						variant: 'warning',
						persist: false,
					});
					return;
				}

				const secret = intent.client_secret;
				/*this.handlePayment(intent.client_secret, stripe, elements)*/

				this.showModal('Procesando pago...', {
					variant: 'info',
					persist: true,
				});
			})
			.catch(error => {
				this.showModal(error.message, {
					variant: 'danger',
					persist: false,
				});
			});
	};

	clearForms = () => {
		setTimeout(() => {
			this.setState({
				data: '',
				mode: false,
				from: '',
				to: '',
				amount: '',
				coupon: '',
				product: '',
			});
		}, 2000);
	};

	generateOrder = firebase => {
		const { product, amount, from, to, coupon } = this.state;
		return orders(firebase).create({
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
						{!!persist ? 'ESPERA' : 'CERRAR'}
					</Button>
				),
				open: true,
				onClose: !!persist ? () => {} : this.closeModal,
			},
		});
		if (!persist) setTimeout(this.closeModal, 15000);
	};

	openModal = () => {
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
		this.refreshRate();
		this.refreshProducts();
		this.refreshAmounts();
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
<<<<<<< HEAD
					<BasicSelect
						error={this.state.error.to}
						handlePhone={this.handlePhone}
						to={this.state.to}
						product={this.state.product}
						handleChange={this.handleChange('product')}
						a={this.state.products}
						inputSelections={this.state.products}
					/>
				</div>
=======
				<BasicSelect
					error={this.state.error.to}
					handlePhone={this.handlePhone}
					to={this.state.to}
					product={this.state.product}
					handleChange={this.handleChange('product')}
					a={this.state.products}
					inputSelections={this.state.products}/>
			</div>
>>>>>>> f47125f853d213626a9e5aba7b8f7e79ade95883
				<div className={classes.background} id='topup'>
					<div className={classes.section}>
						<CustomModal id='modal' {...this.state.modal} />
						<div>
							<GridContainer justify='center'>
								<GridItem xs={12} sm={12} md={4}>
									<Card>
										<form className={classes.form} onSubmit={this.confirm}>
<<<<<<< HEAD
											<CardHeader
												color='primary'
												className={classes.cardHeader}
											>
=======
											<CardHeader color='primary' className={classes.cardHeader}>
>>>>>>> f47125f853d213626a9e5aba7b8f7e79ade95883
												<h1 className={classes.title}>¡Alívialo ya!</h1>
											</CardHeader>
											<CardBody>
												<CustomInput
													labelText='email_de@contacto.com'
													id='from'
													formControlProps={{
														fullWidth: true,
													}}
													inputProps={{
														type: 'email',
														required: true,
														endAdornment: (
															<InputAdornment position='end'>
																<ContactMail
																	className={classes.inputIconsColor}
																/>
															</InputAdornment>
														),
														onChange: this.handleChange('from'),
														value: this.state.from,
													}}
												/>
												<CustomInput
													labelText='0412-1234567'
													id='to'
													formControlProps={{
														fullWidth: true,
													}}
													error={this.state.error.to}
													inputProps={{
														type: 'tel',
														pattern: '[0-9]{4}-[0-9]{7}',
														required: true,
														endAdornment: (
															<InputAdornment position='end'>
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
													labelText='Monto'
													id='amount'
													formControlProps={{
														fullWidth: true,
													}}
													inputSelections={this.state.amounts}
													inputProps={{
														required: true,
														endAdornment: (
															<InputAdornment position='end'>
																<span className={classes.inputIconsColor}>
																	{this.formatAmount(
																		this.state.amount,
																		this.state.rate
																	)}
																</span>
															</InputAdornment>
														),
														onChange: this.handleChange('amount'),
														value: this.state.amount,
													}}
												/>
												<CustomInput
													labelText='Compañia'
													id='product'
													formControlProps={{
														fullWidth: true,
													}}
													inputSelections={this.state.products}
													inputProps={{
														required: true,
														endAdornment: (
															<InputAdornment position='end'>
																<Category className={classes.inputIconsColor} />
															</InputAdornment>
														),
														onChange: this.handleChange('product'),
														value: this.state.product,
													}}
												/>
												<CustomInput
													labelText='CUPON'
													id='coupon'
													formControlProps={{
														fullWidth: true,
													}}
													inputProps={{
														type: 'text',
														endAdornment: (
															<InputAdornment position='end'>
																<Redeem className={classes.inputIconsColor} />
															</InputAdornment>
														),
														onChange: this.handleCoupon,
														value: this.state.coupon,
													}}
												/>
											</CardBody>
											<CardFooter className={classes.cardFooter}>
												<GridContainer>
													<GridItem xs={12} sm={12} md={6}>
<<<<<<< HEAD
=======
														{!this.state.mode ? (
															<Button
																type='submit'
																color='secondary'
																size='lg'
																round
															>
																Recargar
															</Button>
														) : (
															<Button123Pago
																data={this.state.data}
																clearForms={this.clearForms}
															></Button123Pago>
														)}
													</GridItem>

													<GridItem xs={12} sm={12} md={6}>
														<h5 className={classes.subtitle}>
															¡Por cada peso recibes{' '}
															<span id='rate'>{this.state.rate}</span> bolívares!
														</h5>
													</GridItem>
													<GridItem xs={12} sm={12} md={12}>
														<h6 className={classes.description}>
															El precio está expresado en pesos mexicanos, para
															tarjetas de otros países puede haber cargos
															adicionales. Consulta con tu banco.
														</h6>
													</GridItem>

													<GridItem xs={12} sm={12} md={8}>
>>>>>>> f47125f853d213626a9e5aba7b8f7e79ade95883
														<Button
															color='transparent'
															href='/privacy'
															target='_blank'
															className={classes.navLink}
														>
															<h6 className={classes.description}>
																¡Tu privacidad es importante para nosotros!
															</h6>
														</Button>
													</GridItem>
<<<<<<< HEAD
													<GridItem xs={12} sm={12} md={6}>
														<h5 className={classes.subtitle}>
															¡Por cada peso recibes{' '}
															<span id='rate'>{this.state.rate}</span>{' '}
															bolívares!
														</h5>
													</GridItem>
													<GridItem xs={12} sm={12} md={12}>
														<h6 className={classes.description}>
															El precio está expresado en pesos mexicanos, para
															tarjetas de otros países puede haber cargos
															adicionales. Consulta con tu banco.
														</h6>
													</GridItem>
													<GridItem xs={12} sm={12} md={8}>
														<Button
															color='transparent'
															href='/privacy'
															target='_blank'
															className={classes.navLink}
														>
															<h6 className={classes.description}>
																¡Tu privacidad es importante para nosotros!
															</h6>
														</Button>
													</GridItem>
=======
>>>>>>> f47125f853d213626a9e5aba7b8f7e79ade95883
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
	withSnackbar(withFirebase(ProductSection))
);
