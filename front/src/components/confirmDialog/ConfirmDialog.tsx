import React from 'react';
import { ConfirmDialogProps } from './types';
import { instance as axios } from '../../axios.config';
import { useAlertsDispatcher } from '../../contexts/AlertsContext';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const ConfirmDialog = (props: ConfirmDialogProps) => {
    const {
        open,
        handleClose,
        title,
        buttonText,
        submit,
        handleSubmit,
        email,
        setSelectedForm,
    } = props;

    const setAlertsContext = useAlertsDispatcher();
    const inputRef = React.useRef<HTMLInputElement>(null);

    const [password, setPassword] = React.useState('');

    React.useEffect(() => {
        if (open) {
            if (inputRef && inputRef.current) {
                inputRef.current.focus();
            }
        }
    }, [open]);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setPassword(event.target.value);
    };

    const confirm = async () => {
        try {
            const credentials = { email, password };
            const res = await axios.post('/auth/login', credentials);
            if (res.status === 201) {
                if (handleSubmit) {
                    handleSubmit(submit)();
                } else {
                    submit();
                }
                setSelectedForm(null);
            }
        } catch (error) {
            setAlertsContext({
                type: 'error',
                message: 'Le mot de passe est incorrect, veuillez réessayer',
            });
            if (inputRef && inputRef.current) {
                inputRef.current.focus();
            }
            setPassword('');
        }
    };

    return (
        <>
            <h3>{title}</h3>
            <TextField
                name="password"
                onChange={handleChange}
                value={password}
                label="Mot de passe"
                fullWidth
                type="password"
                inputRef={inputRef}
            />
            <div className="cancelable-forms__buttons-container">
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    className="cancelable-forms__button"
                >
                    Annuler
                </Button>

                <Button
                    onClick={confirm}
                    disabled={!password}
                    className="cancelable-forms__button"
                    variant="contained"
                    data-testid="confirmSubmit"
                >
                    {buttonText}
                </Button>
            </div>
        </>
    );
};

export default ConfirmDialog;
