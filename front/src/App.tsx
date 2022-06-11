import React from 'react';
import './prefixed/style.css';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from './contexts/UserContext';
import { useAlertsDispatcher } from './contexts/AlertsContext';
import { instance as axios } from './axios.config';
import GroupomaniaLogo from './logo/icon-left-font-monochrome-white.svg';
import CustomizedSnackbars from './components/alerts/Alert';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';

function App() {
    const { userContext, setUserContext } = React.useContext(UserContext);
    const setAlertsContext = useAlertsDispatcher();

    const navigate = useNavigate();
    const location = useLocation();

    const goToMyProfile = () => {
        if (userContext) {
            const { id } = userContext;
            navigate(`/profile/${id}`);
        }
    };

    const goBackToFeed = () => {
        navigate('/feed');
    };

    const logout = React.useCallback(() => {
        setUserContext(null);
        localStorage.removeItem('gpmToken');
        navigate('/login');
    }, [navigate, setUserContext]);

    React.useEffect(() => {
        const token = localStorage.getItem('gpmToken');

        const checkToken = async () => {
            try {
                const res = await axios.post('/users/checkToken');
                setUserContext(res.data);
                if (
                    ['/', '/login', '/signup'].includes(location.pathname) ||
                    location.key === 'default'
                ) {
                    navigate('/feed');
                }
            } catch (error) {
                if (token) {
                    setAlertsContext({
                        type: 'info',
                        message: 'Votre session a expiré',
                    });
                }
                logout();
            }
        };

        if (
            !userContext &&
            !['/login', '/signup'].includes(location.pathname)
        ) {
            checkToken();
        }
    }, [
        userContext,
        setUserContext,
        navigate,
        setAlertsContext,
        location,
        logout,
    ]);

    return (
        <div className="app">
            {location.pathname.includes('profile') ? (
                <>
                    <header className="header--min">
                        <Button
                            onClick={goBackToFeed}
                            sx={{ color: 'white' }}
                            className="header--min__back-button"
                            startIcon={<ArrowBackIosIcon />}
                            aria-label="Retour au fil d'actualité"
                        >
                            Retour
                        </Button>
                    </header>
                    <div className="content--max">
                        <Outlet />
                    </div>
                </>
            ) : (
                <>
                    <header className="header">
                        <img
                            src={GroupomaniaLogo}
                            alt="Logo Groupomania"
                            className="header__logo"
                        />
                        {userContext && (
                            <>
                                <Button
                                    onClick={goToMyProfile}
                                    className="header__account-button"
                                    startIcon={
                                        <AccountCircleIcon className="header__account-icon" />
                                    }
                                    aria-label="Aller à mon profil"
                                />
                                <Button
                                    onClick={logout}
                                    className="header__logout-button"
                                    startIcon={
                                        <LogoutIcon className="header__logout-icon" />
                                    }
                                    aria-label="Se déconnecter"
                                />
                            </>
                        )}
                    </header>
                    <div className="content">
                        <Outlet />
                    </div>
                </>
            )}
            <CustomizedSnackbars />
        </div>
    );
}

export default App;
