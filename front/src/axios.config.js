import axios from 'axios';

const AUTH_TOKEN = localStorage.getItem('gpmToken');

const instance = axios.create({
	baseURL: 'http://localhost:3000',
	timeout: 1000,
});

instance.defaults.headers.common['Authorization'] = `Bearer ${AUTH_TOKEN}`;

instance.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

export { instance };
