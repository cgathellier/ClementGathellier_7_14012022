import React from 'react';
import {
    EditProfileFormsProps,
    EditInfosFormValues,
    EditPasswordFormValues,
} from './types';
import classes from './EditProfileForms.module.css';
import { instance as axios } from '../../axios.config';
import { UserContext } from '../../contexts/UserContext';
import { useAlertsDispatcher } from '../../contexts/AlertsContext';
import { useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextFieldController from '../textFieldController/TextFieldController';
import ConfirmDialog from '../confirmDialog/ConfirmDialog';

export const EditInfos = (props: EditProfileFormsProps) => {
    const { setSelectedForm } = props;

    const { userContext, setUserContext } = React.useContext(UserContext);
    const setAlertsContext = useAlertsDispatcher();

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<EditInfosFormValues>({
        mode: 'onChange',
        criteriaMode: 'all',
    });

    const watchAllFields = useWatch({ control });
    const errorsNumber = Object.keys(errors).length;

    const [openConfirm, setOpenConfirm] = React.useState(false);
    const [canSubmit, setCanSubmit] = React.useState(false);

    React.useEffect(() => {
        if (Object.keys(watchAllFields).length && userContext) {
            const { email, firstName, lastName } = watchAllFields;
            if (
                (email?.trim() === userContext.email?.trim() &&
                    firstName?.trim() === userContext.firstName?.trim() &&
                    lastName?.trim() === userContext.lastName?.trim()) ||
                errorsNumber > 0
            ) {
                setCanSubmit(false);
            } else {
                setCanSubmit(true);
            }
        }
    }, [watchAllFields, userContext, errorsNumber]);

    const toggleConfirmDialog = () => {
        setOpenConfirm((prevState) => !prevState);
    };

    const submit = async (model?: EditInfosFormValues) => {
        try {
            const res = await axios.patch('/users/infos', model);
            if (res.status === 200) {
                const [tokenObj, userContext] = res.data;

                localStorage.setItem('gpmToken', tokenObj.accessToken);
                axios.defaults.headers.common[
                    'Authorization'
                ] = `Bearer ${tokenObj.accessToken}`;

                setUserContext(userContext);

                setAlertsContext({
                    type: 'success',
                    message:
                        'Le changement de vos informations a bien été pris en compte !',
                });

                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
        } catch (error) {
            setAlertsContext({
                type: 'error',
                message: 'Une erreur est intervenue, merci de réessayer',
            });
        }
    };

    return (
        <>
            <div
                className={`${classes.formContainer} ${
                    openConfirm && classes.hidden
                }`}
            >
                <h2 className={classes.title}>Modifier mes informations</h2>
                <form className={classes.form}>
                    <TextFieldController
                        name="email"
                        label="Email"
                        defaultValue={userContext?.email || ''}
                        control={control}
                        rules={{
                            required: 'Veuillez indiquer votre adresse mail',
                        }}
                    />
                    <TextFieldController
                        name="firstName"
                        label="Prénom"
                        defaultValue={userContext?.firstName || ''}
                        control={control}
                        rules={{ required: 'Veuillez entrer votre prénom' }}
                    />
                    <TextFieldController
                        name="lastName"
                        label="Nom"
                        defaultValue={userContext?.lastName || ''}
                        control={control}
                        rules={{ required: 'Veuillez entrer votre nom' }}
                    />
                </form>
                <div className={classes.buttonsContainer}>
                    <Button
                        onClick={() => setSelectedForm(null)}
                        variant="outlined"
                        className={classes.button}
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={toggleConfirmDialog}
                        disabled={!canSubmit}
                        variant="contained"
                        className={classes.button}
                        data-testid="submitEditInfos"
                    >
                        Valider
                    </Button>
                </div>
            </div>
            <div className={`${!openConfirm && classes.hidden}`}>
                <ConfirmDialog
                    open={openConfirm}
                    handleClose={toggleConfirmDialog}
                    title="Confirmez en entrant votre mot de passe"
                    buttonText="Envoyer"
                    submit={submit}
                    handleSubmit={handleSubmit}
                    email={userContext?.email || ''}
                    setSelectedForm={setSelectedForm}
                />
            </div>
        </>
    );
};

export const EditPassword = (props: EditProfileFormsProps) => {
    const { setSelectedForm } = props;

    const { userContext } = React.useContext(UserContext);
    const setAlertsContext = useAlertsDispatcher();

    const {
        handleSubmit,
        control,
        formState: { errors },
        setError,
        setFocus,
    } = useForm<EditPasswordFormValues>({
        mode: 'onSubmit',
        criteriaMode: 'all',
    });

    const watchAllFields = useWatch({ control });
    const errorsNumber = Object.keys(errors).length;

    const [canSubmit, setCanSubmit] = React.useState(false);

    React.useEffect(() => {
        if (Object.keys(watchAllFields).length) {
            const { password, newPassword, confirmPassword } = watchAllFields;
            if (
                !password ||
                !newPassword ||
                !confirmPassword ||
                errorsNumber > 0
            ) {
                setCanSubmit(false);
            } else {
                setCanSubmit(true);
            }
        }
    }, [watchAllFields, errorsNumber]);

    const checkErrorsAndCredentials = async (model: EditPasswordFormValues) => {
        const { password, newPassword, confirmPassword } = model;
        if (password === newPassword) {
            return setError('newPassword', {
                message:
                    "Le nouveau mot de passe doit être différent de l'actuel",
            });
        } else if (newPassword !== confirmPassword) {
            return setError('confirmPassword', {
                message:
                    'La confirmation est différente du nouveau mot de passe',
            });
        } else {
            try {
                const credentials = {
                    email: userContext?.email || '',
                    password,
                };
                const res = await axios.post('/auth/login', credentials);
                if (res.status === 201) {
                    submit(newPassword);
                    setSelectedForm(null);
                }
            } catch (error) {
                setAlertsContext({
                    type: 'error',
                    message:
                        'Le mot de passe est incorrect, veuillez réessayer',
                });
                setFocus('password');
            }
        }
    };

    const submit = async (newPassword: string) => {
        try {
            const res = await axios.patch('/users/password', {
                password: newPassword,
            });
            if (res.status === 200) {
                localStorage.setItem('gpmToken', res.data.accessToken);
                axios.defaults.headers.common[
                    'Authorization'
                ] = `Bearer ${res.data.accessToken}`;

                setAlertsContext({
                    type: 'success',
                    message:
                        'Le changement de votre mot de passe a bien été pris en compte !',
                });
            }
        } catch (error) {
            setAlertsContext({
                type: 'error',
                message: 'Une erreur est intervenue, merci de réessayer',
            });
        }
    };

    return (
        <div className={classes.formContainer}>
            <h2 className={classes.title}>Modifier le mot de passe</h2>
            <form className={classes.form}>
                <TextFieldController
                    name="password"
                    label="Mot de passe actuel"
                    defaultValue=""
                    control={control}
                    rules={{
                        required: 'Veuillez entrer le mot de passe actuel',
                    }}
                    type="password"
                />
                <TextFieldController
                    name="newPassword"
                    label="Nouveau mot de passe"
                    defaultValue=""
                    control={control}
                    rules={{
                        required: 'Veuillez entrer le nouveau mot de passe',
                    }}
                    type="password"
                />
                <TextFieldController
                    name="confirmPassword"
                    label="Confirmez le nouveau mot de passe"
                    defaultValue=""
                    control={control}
                    rules={{
                        required: 'Veuillez confirmer le nouveau mot de passe',
                    }}
                    type="password"
                />
            </form>
            <div className={classes.buttonsContainer}>
                <Button
                    onClick={() => setSelectedForm(null)}
                    variant="outlined"
                    className={classes.button}
                >
                    Annuler
                </Button>
                <Button
                    onClick={handleSubmit(checkErrorsAndCredentials)}
                    variant="contained"
                    className={classes.button}
                    disabled={!canSubmit}
                    data-testid="submitEditPassword"
                >
                    Valider
                </Button>
            </div>
        </div>
    );
};

export const DeleteAccount = (props: EditProfileFormsProps) => {
    const { setSelectedForm } = props;

    const { userContext, setUserContext } = React.useContext(UserContext);
    const setAlertsContext = useAlertsDispatcher();
    const navigate = useNavigate();

    const [openConfirm, setOpenConfirm] = React.useState(false);

    const toggleConfirmDialog = () => {
        setOpenConfirm((prevState) => !prevState);
    };

    const submit = async () => {
        try {
            const res = await axios.delete('/users');
            if (res.status === 200) {
                localStorage.removeItem('gpmToken');
                axios.defaults.headers.common['Authorization'] = '';

                setUserContext(null);
                setAlertsContext({
                    type: 'success',
                    message: 'Votre compte a bien été supprimé !',
                });
                navigate('/login');
            }
        } catch (error) {
            setAlertsContext({
                type: 'error',
                message: 'Une erreur est intervenue, merci de réessayer',
            });
        }
    };

    return (
        <>
            <div
                className={`${classes.formContainer} ${
                    openConfirm && classes.hidden
                }`}
            >
                <h2 className={classes.title}>Supprimer le compte</h2>
                <div className={classes.infoText}>
                    <span>
                        <strong>Attention</strong> : la suppression du compte
                        est définitive.
                    </span>
                    <span>
                        Souhaitez-vous vraiment supprimer votre compte ?
                    </span>
                </div>
                <div className={classes.buttonsContainer}>
                    <Button
                        onClick={() => setSelectedForm(null)}
                        variant="outlined"
                        className={classes.button}
                    >
                        Non
                    </Button>
                    <Button
                        onClick={toggleConfirmDialog}
                        variant="contained"
                        className={classes.button}
                        data-testid="confirm"
                    >
                        Oui
                    </Button>
                </div>
            </div>
            <div className={`${!openConfirm && classes.hidden}`}>
                <ConfirmDialog
                    open={openConfirm}
                    handleClose={toggleConfirmDialog}
                    title="Confirmez en entrant votre mot de passe"
                    buttonText="Envoyer"
                    submit={submit}
                    email={userContext?.email || ''}
                    setSelectedForm={setSelectedForm}
                />
            </div>
        </>
    );
};
