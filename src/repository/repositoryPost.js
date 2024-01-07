import axios from 'axios';
import store from '@/store';
import router from '@/router/index.js'
import { useToast } from 'primevue/usetoast';

export function repositoryPost() {
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

    const getLitePostById = async (id) => {
        let res = await axios.get(`https://localhost:7213/Post/postlite?id=${id}`)
        .catch(error => {
            handleRequestError(error);
        });
        
        return res.data;
    };

    const getLitePostList = async () => {
        let res = await axios.get(`https://localhost:7213/Post/postlitelist`)
        .catch(error => {
            handleRequestError(error);
        });
        
        return res.data;
    };

    const getPostMenu = async () => {
        const token = store.getters.getToken
        let res = await axios.get(`https://localhost:7213/Post/postmenu`,
        {
            headers: {
                'Content-Type': 'application/json-patch+json',
                'accept': '*/*',
                'Authorization': `Bearer ${token}`
              }
        })
        .catch(error => {
            handleRequestError(error);
        });
        
        return res.data;
    };

    const getPoolOptionListByPostId = async (id) => {
        let res = await axios.get(`https://localhost:7213/Post/pooloptionlist?id=${id}`)
        .catch(error => {
            handleRequestError(error);
        });
        
        return res.data;
    };

    const createPost = async (createPostDTO) => {
        const token = store.getters.getToken
        let res = await axios.post(
            'https://localhost:7213/Post/post',
            createPostDTO,
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

    const deletePost = async (id) => {
        const token = store.getters.getToken;
    
        try {
            const res = await axios.delete(
                `https://localhost:7213/Post/post?id=${id}`,
                {
                    headers: {
                        'Content-Type': 'application/json-patch+json',
                        'Accept': '*/*',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
    
            return res.data;
        } catch (error) {
            handleRequestError(error);
        }
    };

    return {
            getLitePostById: getLitePostById,
            getLitePostList: getLitePostList,
            createPost: createPost,
            getPoolOptionListByPostId: getPoolOptionListByPostId,
            getPostMenu: getPostMenu,
            deletePost: deletePost
        }
};