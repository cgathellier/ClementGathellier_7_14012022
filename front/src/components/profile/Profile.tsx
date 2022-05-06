import React from 'react';
import classes from './Profile.module.css';
import { useParams } from 'react-router-dom';
import { instance as axios } from '../../axios.config';
import { UserInfosState } from './types';
import { PostType } from '../post/types';
import { UserContext } from '../../contexts/UserContext';
import { useAlertsDispatcher } from '../../contexts/AlertsContext';
import FocusTrap from 'focus-trap-react';
import Feed from '../feed/Feed';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import {
    EditInfos,
    EditPassword,
    DeleteAccount,
} from '../editProfileForms/EditProfileForms';

const Profile = () => {
    const { userContext } = React.useContext(UserContext);
    const setAlertsContext = useAlertsDispatcher();

    const params = useParams();
    const actionRef = React.useRef<any>(null);

    const [userInfos, setUserInfos] = React.useState<UserInfosState | null>();
    const [posts, setPosts] = React.useState<PostType[]>([]);
    const [showEditMenu, setShowEditMenu] = React.useState(false);
    const [selectedForm, setSelectedForm] = React.useState<string | null>(null);
    const [formShow, setFormShown] = React.useState<JSX.Element>();

    const getUserInfos = React.useCallback(async () => {
        try {
            const res = await axios.get(`/users/${params.userId}`);
            if (res.status === 200) {
                const { posts, ...userInfos } = res.data;
                setUserInfos(userInfos);
                setPosts(posts);
            } else if (res.status === 500) {
                setAlertsContext({
                    type: 'error',
                    message:
                        'Impossible de charger les informations du profil, merci de réessayer plus tard',
                });
            }
        } catch (error) {}
    }, [params.userId, setAlertsContext]);

    React.useEffect(() => {
        getUserInfos();
    }, [params, getUserInfos]);

    React.useEffect(() => {
        switch (selectedForm) {
            case 'infos':
                setFormShown(<EditInfos setSelectedForm={setSelectedForm} />);
                break;
            case 'password':
                setFormShown(
                    <EditPassword setSelectedForm={setSelectedForm} />,
                );
                break;
            case 'delete':
                setFormShown(
                    <DeleteAccount setSelectedForm={setSelectedForm} />,
                );
                break;
            default:
                break;
        }
    }, [selectedForm]);

    const toggleEditMenu = () => {
        setShowEditMenu((prevState) => !prevState);
        setTimeout(() => {
            setSelectedForm(null);
        }, 500);
    };

    const unmountTrap = () => {
        setSelectedForm(null);
        setShowEditMenu(false);
    };

    const handleFocus = () => {
        if (actionRef && actionRef.current) {
            actionRef.current.focusVisible();
        }
    };

    return (
        <div className={classes.profile}>
            {userInfos && (
                <div className={classes.userInfosContainer}>
                    <div className={classes.userIconContainer}>
                        <AccountCircleIcon fontSize="inherit" />
                    </div>
                    <span className={classes.userName}>
                        {userInfos.firstName} {userInfos.lastName}
                    </span>
                    {userContext?.id === userInfos.id && (
                        <div className={classes.openEditMenuButtonContainer}>
                            <Button
                                onClick={toggleEditMenu}
                                variant="contained"
                                startIcon={<EditIcon />}
                            >
                                Gérer le compte
                            </Button>
                        </div>
                    )}
                </div>
            )}
            <div className={classes.feedContainer}>
                <Feed
                    posts={posts}
                    profileId={userInfos?.id}
                    updateProfile={getUserInfos}
                />
            </div>
            {userContext?.id === userInfos?.id && (
                <>
                    <div
                        className={
                            showEditMenu
                                ? `${classes.backdropHidden} ${classes.backdropShown}`
                                : `${classes.backdropHidden}`
                        }
                    ></div>
                    <div
                        className={`${classes.editMenuContainer} ${
                            showEditMenu && classes.editMenuShown
                        }`}
                    >
                        {showEditMenu && (
                            <FocusTrap
                                focusTrapOptions={{
                                    onDeactivate: unmountTrap,
                                    checkCanFocusTrap: (containers) => {
                                        return new Promise(
                                            (resolve: () => void): void => {
                                                const interval = setInterval(
                                                    () => {
                                                        resolve();
                                                        clearInterval(interval);
                                                    },
                                                    500,
                                                );
                                            },
                                        );
                                    },
                                    clickOutsideDeactivates: true,
                                }}
                            >
                                <div
                                    className={classes.editMenuContentContainer}
                                >
                                    {selectedForm ? (
                                        <div>{formShow}</div>
                                    ) : (
                                        <div
                                            className={
                                                classes.editMenuButtonsContainer
                                            }
                                        >
                                            <Button
                                                onClick={() =>
                                                    setSelectedForm('infos')
                                                }
                                                variant="contained"
                                                fullWidth
                                                action={actionRef}
                                                onFocus={handleFocus}
                                            >
                                                Modifier mes informations
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    setSelectedForm('password')
                                                }
                                                variant="contained"
                                                fullWidth
                                            >
                                                Modifier le mot de passe
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    setSelectedForm('delete')
                                                }
                                                variant="contained"
                                                fullWidth
                                            >
                                                Supprimer le compte
                                            </Button>
                                        </div>
                                    )}
                                    <Button
                                        onClick={toggleEditMenu}
                                        sx={{ color: '#091f43' }}
                                        className={
                                            classes.closeEditMenuIconContainer
                                        }
                                        aria-label="Fermer le menu"
                                    >
                                        <CloseIcon
                                            className={classes.closeIcon}
                                        />
                                    </Button>
                                </div>
                            </FocusTrap>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Profile;
