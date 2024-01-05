import axios from 'axios';
import store from '@/store';

export function repositoryPost() {
    const getLitePostById = async (id) => {
        let res = await axios.get(`https://localhost:7213/Post/postlite?id=${id}`)
        .catch(error => {
            console.error('Error occured:', error);
        });
        
        return res.data;
    };

    const getLitePostList = async () => {
        let res = await axios.get(`https://localhost:7213/Post/postlitelist`)
        .catch(error => {
            console.error('Error occured:', error);
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
            console.error('Error occured:', error);
        });
        
        return res.data;
    };

    const getPoolOptionListByPostId = async (id) => {
        let res = await axios.get(`https://localhost:7213/Post/pooloptionlist?id=${id}`)
        .catch(error => {
            console.error('Error occured:', error);
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
            console.error('Error occured:', error);
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
            console.error('Error occurred:', error);
            return null;
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