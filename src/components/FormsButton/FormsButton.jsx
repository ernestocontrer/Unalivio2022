// import React from 'react';
// import CustomInput from 'components/CustomInput/CustomInput.jsx';
// import { InputAdornment } from '@material-ui/core';
// import { PhoneForwarded } from '@material-ui/icons';

// export default function FormsButton(props) {
// 	const { error, handlePhone, to ,classes} = props;

// 	return (
// 		<CustomInput
// 			labelText='0412-1234567'
// 			id='to'
// 			error={error}
// 			inputProps={{
// 				type: 'tel',
// 				pattern: '[0-9]{4}-[0-9]{7}',
// 				required: true,
// 				endAdornment: (
// 					<InputAdornment position='end'>
// 						<PhoneForwarded className={classes.inputIconsColor} />
// 					</InputAdornment>
// 				),
// 				onChange: handlePhone,
// 				value: to,
// 			}}
// 		/>
// 	);
// }
