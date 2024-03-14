import axios from 'axios';
import store from '@/store';
import router from '@/router/index.js'
import { useToast } from 'primevue/usetoast';
import apiUrl from '@/config.js';

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
        let res = await axios.get(`${apiUrl}Post/post-full?id=${id}`)
        .catch(error => {
            handleRequestError(error);
        });
        
        return res.data;
    };

    const getLitePostList = async (paginationReqeust) => {
        let res = await axios.get(`${apiUrl}Post/post-lite-list`,
        {
            params: paginationReqeust,
            headers: {
                'Content-Type': 'application/json-patch+json',
                'accept': '*/*',
              }
        })
        .catch(error => {
            handleRequestError(error);
        });
        
        return res.data;
    };

    const getPostMenu = async (params) => {
        const token = store.getters.getToken
        let res = await axios.get(`${apiUrl}Post/post-menu`,
        {
            params: params,
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
        const token = store.getters.getToken
        let auth = token != null ? `Bearer ${token}` : '';

        let res = await axios.get(`${apiUrl}Post/pool-option-list?id=${id}`,
        {
            headers: {
                'Content-Type': 'application/json-patch+json',
                'accept': '*/*',
                'Authorization': auth
              }
        })
        .catch(error => {
            handleRequestError(error);
        });
        
        return res.data;
    };

    const createPost = async (createPostDTO) => {
        const token = store.getters.getToken
        let res = await axios.post(
            `${apiUrl}Post/post`,
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

    const editPost = async (editPostDTO) => {
        const token = store.getters.getToken
        let res = await axios.put(
            `${apiUrl}Post/post`,
            editPostDTO,
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

    const getPostForEdit = async (postId) => {
        let res = await axios.get(`${apiUrl}Post/post?id=${postId}`)
        .catch(error => {
            handleRequestError(error);
        });
        
        return res.data;
    };

    const deletePost = async (id) => {
        const token = store.getters.getToken;
    
        try {
            const res = await axios.delete(
                `${apiUrl}Post/post?id=${id}`,
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
            deletePost: deletePost,
            editPost: editPost,
            getPostForEdit: getPostForEdit
        }
};