import axios from 'axios';


export function getUpcomingIdos() {
    return axios.get(process.env.REACT_APP_API_URL + 'projects');
}