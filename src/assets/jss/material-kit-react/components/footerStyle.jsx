import {
	container,
	primaryColor,
	secondaryForeground,
} from 'assets/jss/material-kit-react.jsx';

const footerStyle = {
	block: {
		color: 'inherit',
		padding: '0.9375rem',
		fontWeight: '500',
		fontSize: '12px',
		textTransform: 'uppercase',
		borderRadius: '3px',
		textDecoration: 'none',
		position: 'relative',
		display: 'block',
	},
	left: {
		float: 'left!important',
		display: 'block',
	},
	right: {
		padding: '15px 0',
		margin: '0',
		float: 'right!important',
	},
	footer: {
		padding: '0.9375rem 0',
		textAlign: 'center',
		display: 'flex',
		zIndex: '2',
		position: 'relative',
	},
	a: {
		color: primaryColor,
		textDecoration: 'none',
		backgroundColor: 'transparent',
	},
	footerWhiteFont: {
		'&,&:hover,&:focus': {
			color: '#FFFFFF',
		},
	},
	container,
	fullWidthContainer: {
		paddingLeft: '0px',
		paddingRight: '0px',
		marginLeft: 'auto',
		marginRight: 'auto',
		zIndex: '12',
		backgroundColor: secondaryForeground,
		filter: 'blur(0px) opacity(75%)',
	},
	list: {
		marginBottom: '0',
		padding: '0',
		marginTop: '0',
	},
	inlineBlock: {
		display: 'inline-block',
		padding: '0px',
		width: 'auto',
		color: 'inherit',
	},
	icon: {
		width: '18px',
		height: '18px',
		position: 'relative',
		top: '3px',
	},
};
export default footerStyle;
