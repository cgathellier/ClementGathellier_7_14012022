import React from 'react';
import { instance as axios } from '../../axios.config';
import { LoginFormValues } from './types';
import { Link, useNavigate } from 'react-router-dom';
import { useAlertsDispatcher } from '../../contexts/AlertsContext';
import { useForm, Controller, useWatch } from 'react-hook-form';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TextFieldController from '../textFieldController/TextFieldController';

const LoginForm = () => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<LoginFormValues>({
        mode: 'onSubmit',
        criteriaMode: 'all',
    });

    const setAlertsContext = useAlertsDispatcher();
    const navigate = useNavigate();
    const watchAllFields = useWatch({ control });
    const errorsNumber = Object.keys(errors).length;

    const [canSubmit, setCanSubmit] = React.useState(false);

    React.useEffect(() => {
        const { email, password } = watchAllFields;
        if (
            email?.trim() === '' ||
            password?.trim() === '' ||
            errorsNumber > 0
        ) {
            setCanSubmit(false);
        } else {
            setCanSubmit(true);
        }
    }, [watchAllFields, errorsNumber]);

    const submit = async (data: LoginFormValues) => {
        try {
            delete data.submit;
            const res = await axios.post('/auth/login', data);
            if (res.status === 201) {
                localStorage.setItem('gpmToken', res.data.accessToken);
                axios.defaults.headers.common[
                    'Authorization'
                ] = `Bearer ${res.data.accessToken}`;
                navigate('/feed');
            }
        } catch (error) {
            setAlertsContext({
                type: 'error',
                message: 'Aucun compte ne correspond à ces identifiants',
            });
        }
    };

    return (
        <div className="auth-form__frame">
            <Paper elevation={3} className="auth-form__container">
                <h2 className="auth-form__title">Se connecter</h2>
                <form onSubmit={handleSubmit(submit)} className="auth-form">
                    <TextFieldController
                        name="email"
                        label="Email"
                        defaultValue=""
                        control={control}
                        rules={{
                            required:
                                "Veuillez d'indiquer l'adresse mail du compte",
                        }}
                        type="email"
                        inputProps={{
                            'data-cy': 'email',
                        }}
                    />
                    <TextFieldController
                        name="password"
                        label="Mot de passe"
                        defaultValue=""
                        control={control}
                        rules={{
                            required: 'Veuillez entrer un mot de passe',
                            minLength: {
                                value: 8,
                                message:
                                    'Votre mot de passe doit faire 8 caractères minimum',
                            },
                            maxLength: {
                                value: 20,
                                message:
                                    'Votre mot de passe doit faire moins de 20 caractères',
                            },
                        }}
                        helperText="Votre mot de passe doit faire entre 8 et 20 caractères"
                        type="password"
                        inputProps={{
                            'data-cy': 'password',
                        }}
                    />
                    <FormControl margin="normal">
                        <Controller
                            name="submit"
                            control={control}
                            render={() => (
                                <Button
                                    variant="outlined"
                                    className="auth-form__submit-button"
                                    type="submit"
                                    disabled={!canSubmit}
                                    data-cy="submit"
                                >
                                    Envoyer
                                </Button>
                            )}
                        />
                    </FormControl>
                    <div className="auth-form__links-container">
                        Vous n'avez pas encore de compte ?
                        <Link
                            to="/signup"
                            className="auth-form__link"
                            data-cy="toSignup"
                        >
                            Inscrivez-vous <ChevronRightIcon />
                        </Link>
                    </div>
                </form>
            </Paper>
        </div>
    );
};

export default LoginForm;
