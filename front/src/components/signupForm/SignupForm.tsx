import React from 'react';
import classes from './SignupForm.module.css';
import { instance as axios } from '../../axios.config';
import { SignupFormValues } from './types';
import { useAlertsDispatcher } from '../../contexts/AlertsContext';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TextFieldController from '../textFieldController/TextFieldController';

const SignupForm = () => {
    const { handleSubmit, control, setError, setFocus, clearErrors } =
        useForm<SignupFormValues>({
            mode: 'onSubmit',
            criteriaMode: 'all',
        });

    const setAlertsContext = useAlertsDispatcher();
    const navigate = useNavigate();

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
        <div className={classes.frame}>
            <Paper elevation={3} className={classes.container}>
                <h2 className={classes.title}>Créer un compte</h2>
                <form onSubmit={handleSubmit(submit)} className={classes.form}>
                    <TextFieldController
                        name="firstName"
                        label="Prénom"
                        defaultValue=""
                        control={control}
                        rules={{ required: 'Veuillez entrer votre prénom' }}
                    />
                    <TextFieldController
                        name="lastName"
                        label="Nom"
                        defaultValue=""
                        control={control}
                        rules={{ required: 'Veuillez entrer votre nom' }}
                    />
                    <TextFieldController
                        name="email"
                        label="Email"
                        defaultValue=""
                        control={control}
                        rules={{
                            required: 'Veuillez indiquer votre adresse mail',
                        }}
                        type="email"
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
                        }}
                        helperText="Votre mot de passe doit faire entre 8 et 20 caractères"
                    />
                    <FormControl margin="normal">
                        <Controller
                            name="submit"
                            control={control}
                            render={() => (
                                <Button
                                    variant="outlined"
                                    className={classes.submitBtn}
                                    type="submit"
                                >
                                    Envoyer
                                </Button>
                            )}
                        />
                    </FormControl>
                    <div className={classes.linkContainer}>
                        Vous avez déjà un compte ?
                        <Link to="/login" className={classes.link}>
                            Connectez-vous <ChevronRightIcon />
                        </Link>
                    </div>
                </form>
            </Paper>
        </div>
    );
};

export default SignupForm;
