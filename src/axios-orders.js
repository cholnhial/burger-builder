import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-builder-d3b53.firebaseio.com/'
});

export default instance;
