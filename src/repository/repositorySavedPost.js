import axios from 'axios';
import store from '@/store';
import apiUrl from '@/config.js';

export function repositorySavedPost() {
    const createSavedPost = async (createdSavedPost) => {
        const token = store.getters.getToken;
        let res = await axios.post(
            `${apiUrl}SavedPost/saved-post`,
            createdSavedPost,
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

    const deleteSavedPost = async (deleteSavedPost) => {
        const token = store.getters.getToken;
        let res = await axios.delete(
            `${apiUrl}SavedPost/saved-post`,
            deleteSavedPost,
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
    };

    const isSavedPost = async (postId) => {
        const token = store.getters.getToken;
        let res = await axios.get(`${apiUrl}SavedPost/saved-post?postId=${postId}`, {
            headers: {
                'Content-Type': 'application/json-patch+json',
                'accept': '*/*',
                'Authorization': `Bearer ${token}`
              }
        })
        .catch(error => {
            handleRequestError(error);
        });

        return res;
    };

    return {
        createSavedPost: createSavedPost,
        deleteSavedPost: deleteSavedPost,
        isSavedPost: isSavedPost
    }
};