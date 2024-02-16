import { repositoryPost } from '@/repository/repositoryPost';

const { getLitePostList} = repositoryPost();

export default class PoolhubService {
    async getPoolHubList(paginationReqeust) {
        return await getLitePostList(paginationReqeust);
    }
}
