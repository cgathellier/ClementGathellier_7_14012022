import React from 'react';
import { TextFieldControllerProps } from './types';
import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

const muiStyles = {
	textField: {
		marginBottom: '4px !important',
		marginTop: '12px !important',
	},
	helperText: {
		margin: '0px !important',
	},
};

const TextFieldController = ({
	name,
	label,
	defaultValue,
	control,
	rules,
	helperText,
	type,
}: TextFieldControllerProps) => {
	return (
		<Controller
			name={name}
			control={control}
			defaultValue={defaultValue}
			rules={rules}
			render={({ field: { ref, ...restField }, fieldState: { error } }) => (
				<FormControl fullWidth error={!!error}>
					<TextField
						type={type || 'text'}
						label={label}
						margin='normal'
						fullWidth
						inputRef={ref}
						sx={muiStyles.textField}
						{...restField}
					/>
					{error ? (
						<FormHelperText sx={muiStyles.helperText}>
							{!!error?.message && error.message}
						</FormHelperText>
					) : helperText ? (
						<FormHelperText sx={muiStyles.helperText}>{helperText}</FormHelperText>
					) : (
						<FormHelperText sx={muiStyles.helperText}> </FormHelperText>
					)}
				</FormControl>
			)}
		/>
	);
};

export default TextFieldController;
