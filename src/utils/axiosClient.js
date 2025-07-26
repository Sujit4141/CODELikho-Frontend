import axios from "axios"

const axiosClient =  axios.create({
    baseURL: 'https://codelikho.onrender.com',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});


export default axiosClient;

