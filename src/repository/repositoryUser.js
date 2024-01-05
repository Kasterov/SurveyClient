import axios from 'axios';
import store from '@/store';

export function repositoryUser() {
    const registerUser = async (createUserDTO) => {
        let res = await axios.post(
            'https://localhost:7213/User/user',
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
            'https://localhost:7213/User/signin',
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
            return res.data; 
        }

        return null;
    };

    return {
        registerUser: registerUser,
        signInUser: signInUser
    }
};