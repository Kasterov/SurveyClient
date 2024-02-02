import axios from 'axios';
import store from '@/store';
import router from '@/router/index.js'

export function repositoryProfile() {
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

    const getListJob = async () => {
        let res = await axios.get(`https://localhost:7213/Job/jobs`)
        .catch(error => {
            handleRequestError(error);
        });
        
        return res.data;
    };

    const getListEducation = async () => {
        let res = await axios.get(`https://localhost:7213/Education/educations`)
        .catch(error => {
            handleRequestError(error);
        });
        
        return res.data;
    };

    const getListCountry = async () => {
        let res = await axios.get(`https://localhost:7213/Country/countries`)
        .catch(error => {
            handleRequestError(error);
        });
        
        return res.data;
    };

    const getListHobby = async () => {
        let res = await axios.get(`https://localhost:7213/Hobby/hobbies`)
        .catch(error => {
            handleRequestError(error);
        });
        
        return res.data;
    };

    const addProfileData = async (profileDTO) => {
        const token = store.getters.getToken
        let res = await axios.post(
            'https://localhost:7213/Profile/profile',
            profileDTO,
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

    const getProfileByUserId = async () => {
        const token = store.getters.getToken
        let res = await axios.get(
            'https://localhost:7213/Profile/profile',
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
        getListJob: getListJob,
        getListEducation: getListEducation,
        getListCountry: getListCountry,
        getListHobby: getListHobby,
        addProfileData: addProfileData,
        getProfileByUserId: getProfileByUserId
    }
};