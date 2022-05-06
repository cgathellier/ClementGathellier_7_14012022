import React from 'react';
import classes from './App.module.css';
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
        <div className={classes.app}>
            {location.pathname.includes('profile') ? (
                <>
                    <header className={classes.minHeader}>
                        <Button
                            onClick={goBackToFeed}
                            sx={{ color: 'white' }}
                            className={classes.backButton}
                            startIcon={<ArrowBackIosIcon />}
                        >
                            Retour
                        </Button>
                    </header>
                    <div
                        className={`${classes.content} ${classes.heightWithMinHeader}`}
                    >
                        <Outlet />
                    </div>
                </>
            ) : (
                <>
                    <header className={classes.header}>
                        <img
                            src={GroupomaniaLogo}
                            alt="Logo Groupomania"
                            className={classes.logo}
                        />
                        {userContext && (
                            <>
                                <Button
                                    onClick={goToMyProfile}
                                    sx={{ color: 'white' }}
                                    className={classes.accountButton}
                                    startIcon={
                                        <AccountCircleIcon
                                            className={classes.accountIcon}
                                        />
                                    }
                                />
                                <Button
                                    onClick={logout}
                                    sx={{ color: 'white' }}
                                    className={classes.logoutButton}
                                    startIcon={
                                        <LogoutIcon
                                            className={classes.logoutIcon}
                                        />
                                    }
                                />
                            </>
                        )}
                    </header>
                    <div
                        className={`${classes.content} ${classes.defaultHeight}`}
                    >
                        <Outlet />
                    </div>
                </>
            )}
            <CustomizedSnackbars />
        </div>
    );
}

export default App;
