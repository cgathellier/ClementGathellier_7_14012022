import React from 'react';
import { instance as axios } from '../../axios.config';
import { PostFormProps } from './types';
import classes from './PostForm.module.css';
import { useAlertsDispatcher } from '../../contexts/AlertsContext';
import FocusTrap from 'focus-trap-react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const PostForm = (props: PostFormProps) => {
	const { open, handleClose } = props;
	const [postText, setPostText] = React.useState('');
	const setAlertsContext = useAlertsDispatcher();

	const submit = async () => {
		try {
			const res = await axios.post('/posts', { text: postText });
			if (res.status === 201) {
				setAlertsContext({ type: 'success', message: 'La publication a bien été enregistrée !' });
				handleClose(true);
			}
		} catch (error) {
			setAlertsContext({
				type: 'error',
				message: "Un problème est survenu, la publication n'a pas pu être enregistrée",
			});
		}
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setPostText(event.target.value);
	};

	return (
		<FocusTrap>
			<Dialog open={open} onClose={handleClose} fullWidth>
				<DialogTitle className={classes.title}>Créer une publication</DialogTitle>
				<DialogContent className={classes.dialogContent}>
					<TextField
						multiline
						minRows={3}
						maxRows={10}
						placeholder='Exprimez-vous'
						fullWidth
						onChange={event => handleChange(event)}
						autoFocus
					/>
				</DialogContent>
				<DialogActions className={classes.buttonContainer}>
					<Button onClick={() => handleClose(true)} className={classes.button} variant='outlined'>
						Annuler
					</Button>
					<Button
						onClick={submit}
						disabled={!postText}
						className={classes.button}
						variant='contained'
					>
						Publier
					</Button>
				</DialogActions>
			</Dialog>
		</FocusTrap>
	);
};

export default PostForm;
