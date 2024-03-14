import axios from 'axios';
import store from '@/store';
import apiUrl from '@/config.js';

export function repositoryUser() {
    const registerUser = async (createUserDTO) => {
        let res = await axios.post(
            `${apiUrl}User/user`,
            createUserDTO,
            {
                headers: {
                    'Content-Type': 'application/json-patch+json',
                    'accept': '*/*'
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

    const signInUser = async (signInUserDTO) => {
        let res = await axios.post(
            `${apiUrl}User/sign-in`,
            signInUserDTO,
            {
                headers: {
                    'Content-Type': 'application/json-patch+json',
                    'accept': '*/*'
                }
            }
        ).catch(error => {
            console.error('Error occured:', error);
        });

        if(res){
            const token = res.data;
            store.dispatch('saveToken', token);
            return true; 
        } else {
            return false;
        }
    };

    const getProfileViewData = async (userId) => {
        let res = await axios.get(`${apiUrl}User/profile-view?id=${userId}`)
        .catch(error => {
            handleRequestError(error);
        });
        
        return res.data;
    };

    return {
        getProfileViewData: getProfileViewData,
        registerUser: registerUser,
        signInUser: signInUser
    }
};