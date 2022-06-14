import React from 'react';
import { instance as axios } from '../../axios.config';
import { PostFormProps } from './types';
import { useAlertsDispatcher } from '../../contexts/AlertsContext';
import FocusTrap from 'focus-trap-react';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const PostForm = (props: PostFormProps) => {
    const { open, handleClose } = props;
    const setAlertsContext = useAlertsDispatcher();

    const [postText, setPostText] = React.useState('');
    const [canSubmit, setCanSubmit] = React.useState(false);

    React.useEffect(() => {
        if (postText.trim() === '') {
            setCanSubmit(false);
        } else {
            setCanSubmit(true);
        }
    }, [postText]);

    const submit = async () => {
        try {
            const res = await axios.post('/posts', { text: postText });
            if (res.status === 201) {
                setAlertsContext({
                    type: 'success',
                    message: 'La publication a bien été enregistrée !',
                });
                handleClose(true);
            }
        } catch (error) {
            setAlertsContext({
                type: 'error',
                message:
                    "Un problème est survenu, la publication n'a pas pu être enregistrée",
            });
        }
    };

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setPostText(event.target.value);
    };

    return (
        <FocusTrap>
            <Dialog open={open} onClose={handleClose} fullWidth>
                <h2 className="postForm__title">Créer une publication</h2>
                <div className="postForm__content">
                    <TextField
                        multiline
                        minRows={3}
                        maxRows={10}
                        placeholder="Exprimez-vous"
                        fullWidth
                        onChange={(event) => handleChange(event)}
                        autoFocus
                        inputProps={{
                            'data-testid': 'post-form-input',
                        }}
                    />
                    <div className="cancelable-forms__buttons-container">
                        <Button
                            onClick={() => handleClose(true)}
                            className="cancelable-forms__button"
                            variant="outlined"
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={submit}
                            disabled={!canSubmit}
                            className="cancelable-forms__button"
                            variant="contained"
                            data-testid="submit-post"
                        >
                            Publier
                        </Button>
                    </div>
                </div>
            </Dialog>
        </FocusTrap>
    );
};

export default PostForm;
