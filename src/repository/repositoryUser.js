import axios from 'axios';

export function repositoryUser() {
    const registerUser = async (createUserDTO) => {
        console.log(createUserDTO);
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
        
        return res.data;
    };

    return {registerUser: registerUser}
};