import { listRepositories } from './api/repositories';
import IRepository from './interfaces/IRepository';
import { ORGANIZATION } from './env';
import { getBranch, deleteBranch } from './api/branch';
import EBranch from './enums/EBranch';


(async () => {
    const repositories: IRepository[] = await listRepositories(ORGANIZATION);

    for (const repository of repositories) {
        const {
            owner,
            name
        } = repository;

        const branch = await getBranch(owner.login, name, 'beta');
        if (branch) {
            await deleteBranch(owner.login, name, `beta`);
        }
    }
})();