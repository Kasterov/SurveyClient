import axios from 'axios';
import store from '@/store';
import apiUrl from '@/config.js';

export function repositoryVote() {
    const token = store.getters.getToken
    const createVoteList = async (createVoteListDTO) => {
        let res = await axios.post(
            `${apiUrl}Vote/vote-list`,
            createVoteListDTO,
            {
                headers: {
                    'Content-Type': 'application/json-patch+json',
                    'accept': '*/*',
                    'Authorization': `Bearer ${token}`
                }
            }
        ).catch(error => {
            console.error('Error occured:', error);
        });
        
        if(res){
            return res.data; 
        }

        return null;
    };

    return {createVoteList: createVoteList}
};