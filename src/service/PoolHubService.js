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
                        backgroundColor: [documentStyle.getPropertyValue('--indigo-800'), documentStyle.getPropertyValue('--teal-600'), documentStyle.getPropertyValue('--primary-600'),  documentStyle.getPropertyValue('--purple-800')],
                        hoverBackgroundColor: [documentStyle.getPropertyValue('--indigo-700'), documentStyle.getPropertyValue('--teal-500'), documentStyle.getPropertyValue('--primary-500'),  documentStyle.getPropertyValue('--purple-700')]
                    }
                ],
            }; 
            
            mappedPagnationResponseDTO.responseList.push(tempData); 
        });

        return mappedPagnationResponseDTO;
    }
}
