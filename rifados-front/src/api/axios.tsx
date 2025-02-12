import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 0,
    headers: {'X-Custom-Header': 'foobar'}
});

export default instance;