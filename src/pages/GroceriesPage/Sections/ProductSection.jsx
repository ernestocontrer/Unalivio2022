import React from 'react';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import InputAdornment from '@material-ui/core/InputAdornment';
import PropTypes from 'prop-types';

// @material-ui/icons
import ContactMail from '@material-ui/icons/ContactMail';
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

class ProductSection extends React.Component {
	defaultState = {
		from: '',
		to: '',
		name: '',
		product: '',
		products: [
			// this will be prefetched from firebase
			{
				name: 'Cargando...',
				value: -1,
				price: { name: 'Cargando...', value: -1 },
			},
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

	refreshProducts = () => {
		if (this.props.firebase.apps.length == 0)
			console.error('Error fetching Firebase app');
		else {
			products(this.props.firebase)
				.list('combo')
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

	getPaymentName = code => {
		const currentPayment = this.state.methods.filter(_ => _.value == code);

		return currentPayment.length == 0
			? 'Selecciona un método de pago primero'
			: currentPayment[0].name;
	};

	confirm = event => {
		event.preventDefault();

		this.showModal('Confirma tu orden', {
			variant: 'info',
			persist: true,
			content: (
				<>
					<ul>
						<li>Email de contacto: {this.state.from}</li>
						<li>Destinatario: {this.state.name}</li>
						<li>Teléfono: {this.state.to}</li>
						<li>Combo: {this.state.product.name}</li>
						<li>Precio del combo: {this.state.product.price}</li>
					</ul>
				</>
			),
			buttons: (
				<>
					<Button onClick={this.checkout} color='info'>
						CHÉVERE PROCEDER
					</Button>
					<Button onClick={this.closeModal}>REGRESAR Y MODIFICAR</Button>
				</>
			),
		});
	};

	checkout = () => {
		this.showModal('Muy pronto!', {
			variant: 'info',
			persist: false,
			buttons: <></>,
		});
		return;
	};

	generateOrder = firebase => {
		const { product, amount, from, to } = this.state;
		return orders(firebase).create({
			product,
			amount,
			from,
			to,
		});
	};



	showModal = (message, { variant, persist, content, buttons }) => {
		const { title, actions, open, onClose, ...modal } = this.state.modal;
		this.setState({
			modal: {
				title: message,
				content: content || <></>,
				actions: actions || buttons || (
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
				...modal,
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
			<div className={classes.background} id='combo'>
				<div className={classes.section}>
					<CustomModal id='modal' {...this.state.modal} />
					<div>
						<GridContainer justify='center'>
							<GridItem xs={12} sm={12} md={4}>
								<Card>
									<form className={classes.form} onSubmit={this.confirm}>
										<CardHeader color='primary' className={classes.cardHeader}>
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
												labelText='María Rodríguez'
												id='name'
												formControlProps={{
													fullWidth: true,
												}}
												inputProps={{
													type: 'text',
													required: true,
													endAdornment: (
														<InputAdornment position='end'>
															<ContactMail
																className={classes.inputIconsColor}
															/>
														</InputAdornment>
													),
													onChange: this.handleChange('name'),
													value: this.state.name,
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
												labelText='Combo'
												id='product'
												formControlProps={{
													fullWidth: true,
												}}
												inputSelections={this.state.products}
												inputProps={{
													endAdornment: (
														<InputAdornment position='end'>
															<span className={classes.inputIconsColor}>
																{this.formatAmount(
																	this.state.product.price,
																	this.state.rate
																)}
															</span>
														</InputAdornment>
													),
													onChange: this.handleChange('product'),
													value: this.state.product,
												}}
											/>
										</CardBody>
										<CardFooter className={classes.cardFooter}>
											<GridContainer>
												<GridItem xs={12} sm={12} md={6}>
													<Button
														type='submit'
														color='secondary'
														size='lg'
														round
													>
														Recargar
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
