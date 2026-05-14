import axios from 'axios';

// Connect with backend APIs using Axios
const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});


export default api;