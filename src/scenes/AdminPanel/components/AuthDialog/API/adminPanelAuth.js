import axios from "axios";

export function login(data){
    return axios.post(process.env.REACT_APP_API_URL+'/login', data);
}

export function signUp(data){
    return axios.post(process.env.REACT_APP_API_URL+'/register', data)
}

export function logout(){
    return axios.get(process.env.REACT_APP_API_URL+'/logout');
}