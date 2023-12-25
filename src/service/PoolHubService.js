import { repositoryPost } from '@/repository/repositoryPost';

const { getLitePostList} = repositoryPost();

export default class PoolhubService {
    async getPoolHubList() {
        return await getLitePostList();
    }
}
