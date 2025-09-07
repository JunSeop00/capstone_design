import axios from 'axios';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 0,
});

export const getLog = async (experiment) => {
    try {
        const res = await api.get(`expr_log`, {
            headers:{'ngrok-skip-browser-warning': true},
            params: {experiment: experiment},
        });
        return (res.data);
    } catch (e) {

    }
}

export const predict = async (experiment, drug, protein) => {
    try {
        const res = await api.get('interaction', {
            headers:{'ngrok-skip-browser-warning': true},
            params: {experiment: experiment, drug: drug, protein: protein}
        })
        return (res.data);
    }catch (e){

    }
}