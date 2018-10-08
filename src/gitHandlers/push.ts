import IPush from '../interfaces/IPush';
import { BOT_NAME } from '../env';
import { getBranchType } from '../util';
import EBranch from '../enums/EBranch';
import { merge } from '../api/merge';
import IRepository from '../interfaces/IRepository';
import logger from '../logger';
import ICommit from '../interfaces/ICommit';
import { createBranch } from '../api/branch';
import { createPullRequest, addAssignees } from '../api/pullRequest';

export const push = async ({ pusher, ref, repository, commits, head_commit }: IPush) => {
    if (pusher.name === BOT_NAME) {
        logger.log(`Bot ${pusher.name} was the push author`);
        return;
    }

    const branchType = getBranchType(ref);
    let mergeSuccess = true;
    const autoMergeFn = autoMerge(repository, commits, head_commit.id);
    if (branchType === EBranch.master) {
        mergeSuccess = await autoMergeFn(EBranch.release, EBranch.master);
    }

    if (mergeSuccess && (branchType === EBranch.master || branchType === EBranch.release)) {
        await autoMergeFn(EBranch.develop, EBranch.release);
    }
};

const autoMerge = (repository: IRepository, commits: ICommit[], head_sha: string) => async (base: EBranch, head: EBranch): Promise<boolean> => {
    const response = await merge({
        owner: repository.owner.login,
        repository: repository.name,
        base,
        head
    });

    if (response.conflict) {
        const newBranch = `conflict/${head}`;
        const { ref } = await createBranch(repository.owner.login, repository.name, `refs/heads/${newBranch}`, head_sha);
        if (ref) {
            const { pullRequest } = await createPullRequest({
                owner: repository.owner.login,
                repository: repository.name,
                base,
                head: newBranch,
                title: `Merge conflict ${newBranch} into ${base}`
            });
            if (pullRequest) {
                await addAssignees({
                    owner: repository.owner.login,
                    repository: repository.name,
                    issueNumber: pullRequest.number,
                    assignees: commits.map(c => c.committer.username).filter(u => u !== 'web-flow')
                });
            }
        }
        return false;
    } else
        return true;
};