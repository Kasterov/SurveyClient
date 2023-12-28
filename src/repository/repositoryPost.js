import axios from 'axios';

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

    const getPoolOptionListByPostId = async (id) => {
        let res = await axios.get(`https://localhost:7213/Post/pooloptionlist?id=${id}`)
        .catch(error => {
            console.error('Error occured:', error);
        });
        
        return res.data;
    };

    const createPost = async (createPostDTO) => {
        console.log(createPostDTO);
        let res = await axios.post(
            'https://localhost:7213/Post/post',
            createPostDTO,
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

    return {
            getLitePostById: getLitePostById,
            getLitePostList: getLitePostList,
            createPost: createPost,
            getPoolOptionListByPostId: getPoolOptionListByPostId
        }
};