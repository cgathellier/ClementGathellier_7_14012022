import React from 'react';
import { EditTextFormProps } from './types';
import classes from './EditTextForm.module.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const EditTextForm = (props: EditTextFormProps) => {
	const { updatedText, handleChange, hideUpdate, submitUpdate, text } = props;

	const textAreaRef = React.useRef<any>(null);

	React.useEffect(() => {
		if (textAreaRef && textAreaRef.current) {
			textAreaRef.current.focus();
		}
	}, []);

	const handleFocus = () => {
		if (textAreaRef && textAreaRef.current) {
			textAreaRef.current.setSelectionRange(updatedText.length, updatedText.length);
		}
	};

	return (
		<>
			<TextField
				fullWidth
				multiline
				value={updatedText}
				onChange={event => handleChange(event)}
				inputRef={textAreaRef}
				onFocus={handleFocus}
			/>
			<div className={classes.buttonsContainer}>
				<Button
					variant='outlined'
					onClick={hideUpdate}
					disabled={!updatedText}
					className={classes.updateButtons}
				>
					Annuler
				</Button>
				<Button
					variant='contained'
					onClick={submitUpdate}
					disabled={!updatedText || updatedText.trim() === text.trim()}
					className={classes.updateButtons}
				>
					Enregistrer
				</Button>
			</div>
		</>
	);
};

export default EditTextForm;
