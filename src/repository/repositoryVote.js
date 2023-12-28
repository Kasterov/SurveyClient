import axios from 'axios';

export function repositoryVote() {
    const createVoteList = async (createVoteListDTO) => {
        let res = await axios.post(
            'https://localhost:7213/Vote/votelist',
            createVoteListDTO,
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

    return {createVoteList: createVoteList}
};