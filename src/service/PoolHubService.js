import { repositoryPost } from '@/repository/repositoryPost';

const { getLitePostList} = repositoryPost();
let documentStyle = getComputedStyle(document.documentElement);

const truncateString = (inputString, maxLength) => {
    if (inputString.length > maxLength) {
        return inputString.substring(0, maxLength - 3) + '...';
    } else {
    return inputString;
    }
}

export default class PoolhubService {
    async getPoolHubList(paginationReqeust) {
        let pagnationResponseDTO = await getLitePostList(paginationReqeust);

        let mappedPagnationResponseDTO = {
            totalCount: pagnationResponseDTO.totalCount,
            responseList: []
        };

        pagnationResponseDTO.responseList.map(pool => {
            let tempData = {
                id: pool.id,
                author: pool.author,
                title: pool.title,
                created: pool.created,
                totalCount: pool.totalCount,
                labels: pool.votes.map(x => truncateString(x.option, 40)),
                datasets: [
                    {
                        data: pool.votes.map(x => x.count),
                        backgroundColor: [documentStyle.getPropertyValue('--blue-700'), documentStyle.getPropertyValue('--red-700'), documentStyle.getPropertyValue('--green-700'),  documentStyle.getPropertyValue('--purple-700'),  documentStyle.getPropertyValue('--indigo-700'), documentStyle.getPropertyValue('--pink-700'), documentStyle.getPropertyValue('--orange-700')],
                        hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-600'), documentStyle.getPropertyValue('--red-600'), documentStyle.getPropertyValue('--green-600'),  documentStyle.getPropertyValue('--purple-600'),  documentStyle.getPropertyValue('--indigo-600'), documentStyle.getPropertyValue('--pink-600'), documentStyle.getPropertyValue('--orange-600')]
                    }
                ],
            }; 
            
            mappedPagnationResponseDTO.responseList.push(tempData); 
        });

        return mappedPagnationResponseDTO;
    }
}
