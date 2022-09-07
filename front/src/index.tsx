import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserContextProvider } from './contexts/UserContext';
import { AlertsContextProvider } from './contexts/AlertsContext';
import Spinner from './components/Spinner';
import App from './App';
const LoginForm = React.lazy(() => import('./components/LoginForm'));
const SignupForm = React.lazy(() => import('./components/SignupForm'));
const Feed = React.lazy(() => import('./components/Feed'));
const Profile = React.lazy(() => import('./components/Profile'));

ReactDOM.render(
    <UserContextProvider>
        <AlertsContextProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />}>
                        <Route
                            path="login"
                            element={
                                <React.Suspense fallback={<Spinner />}>
                                    <LoginForm />
                                </React.Suspense>
                            }
                        />
                        <Route
                            path="signup"
                            element={
                                <React.Suspense fallback={<Spinner />}>
                                    <SignupForm />
                                </React.Suspense>
                            }
                        />
                        <Route
                            path="feed"
                            element={
                                <React.Suspense fallback={<Spinner />}>
                                    <Feed />
                                </React.Suspense>
                            }
                        />
                        <Route
                            path="profile/:userId"
                            element={
                                <React.Suspense fallback={<Spinner />}>
                                    <Profile />
                                </React.Suspense>
                            }
                        />
                        <Route
                            path="*"
                            element={
                                <React.Suspense fallback={<Spinner />}>
                                    <Feed />
                                </React.Suspense>
                            }
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AlertsContextProvider>
    </UserContextProvider>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
