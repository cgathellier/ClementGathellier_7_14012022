import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import LoginForm from './components/loginForm/LoginForm';
import SignupForm from './components/signupForm/SignupForm';
import Feed from './components/feed/Feed';
import { UserContextProvider } from './contexts/UserContext';
import { AlertsContextProvider } from './contexts/AlertsContext';
import Profile from './components/profile/Profile';

ReactDOM.render(
	<UserContextProvider>
		<AlertsContextProvider>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<App />}>
						<Route path='login' element={<LoginForm />} />
						<Route path='signup' element={<SignupForm />} />
						<Route path='feed' element={<Feed />} />
						<Route path='profile/:userId' element={<Profile />} />
						<Route path='*' element={<Feed />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</AlertsContextProvider>
	</UserContextProvider>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
