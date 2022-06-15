import React from 'react';
import { instance as axios } from '../../axios.config';
import { SignupFormValues } from './types';
import { useAlertsDispatcher } from '../../contexts/AlertsContext';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller, useWatch } from 'react-hook-form';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TextFieldController from '../textFieldController/TextFieldController';

const SignupForm = () => {
    const {
        handleSubmit,
        control,
        setError,
        setFocus,
        clearErrors,
        formState: { errors },
    } = useForm<SignupFormValues>({
        mode: 'onSubmit',
        criteriaMode: 'all',
    });

    const setAlertsContext = useAlertsDispatcher();
    const navigate = useNavigate();
    const watchAllFields = useWatch({ control });
    const errorsNumber = Object.keys(errors).length;

    const [canSubmit, setCanSubmit] = React.useState(false);

    React.useEffect(() => {
        const { email, firstName, lastName, password } = watchAllFields;
        if (
            email?.trim() === '' ||
            firstName?.trim() === '' ||
            lastName?.trim() === '' ||
            password?.trim() === '' ||
            errorsNumber > 0
        ) {
            setCanSubmit(false);
        } else {
            setCanSubmit(true);
        }
    }, [watchAllFields, errorsNumber]);

    const validateMail = (email) => {
        if (
            email === '' ||
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)
        ) {
            clearErrors('email');
            return true;
        } else {
            setError('email', { message: "L'email indiqué n'est pas valide" });
            setFocus('email');
            return false;
        }
    };

    const submit = async (data: SignupFormValues) => {
        try {
            if (!validateMail(data.email)) return;

            delete data.submit;
            const res = await axios.post('/auth/signup', data);
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
                message:
                    'Un compte est déjà enregistré avec cette adresse email',
            });
        }
    };

    return (
        <div className="auth-form__frame">
            <Paper elevation={3} className="auth-form__container">
                <h2 className="auth-form__title">Créer un compte</h2>
                <form onSubmit={handleSubmit(submit)} className="auth-form">
                    <TextFieldController
                        name="firstName"
                        label="Prénom"
                        defaultValue=""
                        control={control}
                        rules={{
                            required: 'Veuillez entrer votre prénom',
                            validate: (value) =>
                                value.trim() !== '' ||
                                'Les espaces ne sont pas valables',
                        }}
                        inputProps={{
                            'data-cy': 'firstName',
                        }}
                    />
                    <TextFieldController
                        name="lastName"
                        label="Nom"
                        defaultValue=""
                        control={control}
                        rules={{
                            required: 'Veuillez entrer votre nom',
                            validate: (value) =>
                                value.trim() !== '' ||
                                'Les espaces ne sont pas valables',
                        }}
                        inputProps={{
                            'data-cy': 'lastName',
                        }}
                    />
                    <TextFieldController
                        name="email"
                        label="Email"
                        defaultValue=""
                        control={control}
                        rules={{
                            required: 'Veuillez indiquer votre adresse mail',
                            validate: (value) =>
                                value.trim() !== '' ||
                                'Les espaces ne sont pas valables',
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
                        type="password"
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
                            validate: (value) =>
                                value.trim() !== '' ||
                                'Les espaces ne sont pas valables',
                        }}
                        helperText="Votre mot de passe doit faire entre 8 et 20 caractères"
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
                        Vous avez déjà un compte ?
                        <Link
                            to="/login"
                            className="auth-form__link"
                            data-cy="toLogin"
                        >
                            Connectez-vous <ChevronRightIcon />
                        </Link>
                    </div>
                </form>
            </Paper>
        </div>
    );
};

export default SignupForm;
