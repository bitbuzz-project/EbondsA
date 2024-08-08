import axios from 'axios';
import { API_LINK } from '../../../consts/api';

export function createTimelinetail(idoData){
    return axios.post(API_LINK + '/timeline_detail_create', idoData);
}
export function updateTimelinetail(idoData, id){
    return axios.put(API_LINK + '/timeline_detail_update/'+id, idoData);
}