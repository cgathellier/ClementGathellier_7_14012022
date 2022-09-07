import React from 'react';
import { useParams } from 'react-router-dom';
import { instance as axios } from '../axios.config';
import { PostType } from './Post';
import { UserContext } from '../contexts/UserContext';
import { useAlertsDispatcher } from '../contexts/AlertsContext';
import FocusTrap from 'focus-trap-react';
import Feed from './Feed';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { EditInfos, EditPassword, DeleteAccount } from './EditProfileForms';

interface UserInfosState {
    id: number;
    firstName: string;
    lastName: string;
}

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

    const backdropClasses = showEditMenu
        ? 'profile__backdrop--hidden profile__backdrop'
        : 'profile__backdrop--hidden';

    const editProfileMenuClasses = showEditMenu
        ? 'edit-profile-menu edit-profile-menu--show'
        : 'edit-profile-menu';

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
        <div className="profile">
            {userInfos && (
                <div className="profile__user-infos">
                    <div className="profile__user-icon">
                        <AccountCircleIcon fontSize="inherit" />
                    </div>
                    <span className="profile__user-name" data-testid="userName">
                        {userInfos.firstName} {userInfos.lastName}
                    </span>
                    {userContext?.id === userInfos.id && (
                        <div className="profile__open-edit-profile-menu">
                            <Button
                                onClick={toggleEditMenu}
                                variant="contained"
                                startIcon={<EditIcon />}
                                data-testid="openEditProfileMenu"
                            >
                                Gérer le compte
                            </Button>
                        </div>
                    )}
                </div>
            )}
            <div className="profile__feed-container">
                <Feed
                    posts={posts}
                    profileId={userInfos?.id}
                    updateProfile={getUserInfos}
                />
            </div>
            {userContext?.id === userInfos?.id && (
                <>
                    <div className={backdropClasses}></div>
                    <div className={editProfileMenuClasses}>
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
                                <div className="edit-profile-menu__content">
                                    {selectedForm ? (
                                        <div>{formShow}</div>
                                    ) : (
                                        <div className="edit-profile-menu__buttons-container">
                                            <Button
                                                onClick={() =>
                                                    setSelectedForm('infos')
                                                }
                                                variant="contained"
                                                fullWidth
                                                action={actionRef}
                                                onFocus={handleFocus}
                                                data-testid="editInfos"
                                            >
                                                Modifier mes informations
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    setSelectedForm('password')
                                                }
                                                variant="contained"
                                                fullWidth
                                                data-testid="editPassword"
                                            >
                                                Modifier le mot de passe
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    setSelectedForm('delete')
                                                }
                                                variant="contained"
                                                fullWidth
                                                data-testid="deleteAccount"
                                            >
                                                Supprimer le compte
                                            </Button>
                                        </div>
                                    )}
                                    <Button
                                        onClick={toggleEditMenu}
                                        sx={{ color: '#091f43' }}
                                        className="edit-profile-menu__icon"
                                        aria-label="Fermer le menu"
                                    >
                                        <CloseIcon className="edit-profile-menu__close" />
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
