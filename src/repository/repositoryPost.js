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

    return {getLitePostById: getLitePostById, getLitePostList: getLitePostList}
};