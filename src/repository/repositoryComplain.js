import axios from 'axios';
import store from '@/store';
import router from '@/router/index.js'
import { useToast } from 'primevue/usetoast';
import apiUrl from '@/config.js';

export function repositoryComplain() {
    // const toast = useToast();
    const handleRequestError = (error) => {
        switch (error.response.status) {
            case 401:
                router.push({ path: 'auth/signin' });
                break;
        
            case 400:
                console.log("400");
                // toast.add({ severity: 'error', summary: 'WTF!!!', detail: 'WTF are you doing?', life: 3000 });
                break;

            case 404:
                // toast.add({ severity: 'error', summary: 'WTF!!!', detail: 'WTF are you doing?', life: 3000 });
                break;
        
            case 500:
                //toast.add({ severity: 'error', summary: 'Server is down', detail: 'server is sleaping', life: 3000 });
                break;
        
            default:
                //toast.add({ severity: 'error', summary: 'Error', detail: 'I have no idea what just happend :D', life: 3000 });
                break;
        }

        return null;
    };

    const createComplain = async (createComplainDTO) => {
        const token = store.getters.getToken
        let res = await axios.post(
            `${apiUrl}Complain/Complain`,
            createComplainDTO,
            {
                headers: {
                    'Content-Type': 'application/json-patch+json',
                    'accept': '*/*',
                    'Authorization': `Bearer ${token}`
                  }
            }
        ).catch(error => {
            handleRequestError(error);
        });
        
        if(res){
            return res.data; 
        }

        return null;
    };

    return {
        createComplain: createComplain
    }
};