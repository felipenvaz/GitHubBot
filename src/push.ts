import { Context } from 'probot';
import { EBranch, EHttpCode } from './constants';
import { getBranchType, isBotPush } from './util';
import { GitHubAPI } from 'probot/lib/github';

export const push = async (context: Context) => {
    const { ref, repository, pusher } = context.payload;
    if (isBotPush(pusher.name)) return;
    const branchType: EBranch = getBranchType(ref);
    let success = true;
    if (branchType === EBranch.master) {
        success = await merge(context.github, EBranch.release, EBranch.master, repository, pusher.name);
        if (!success) return;
    }
    if (branchType === EBranch.release || branchType === EBranch.master) {
        success = await merge(context.github, EBranch.develop, EBranch.release, repository, pusher.name);
        if (!success) return;
    }
};

const merge = (github: GitHubAPI, base: EBranch, head: EBranch, repository: any, pusherName: string) => {
    console.log(`trying to merge ${head} into ${base}`);
    return github.repos.merge({
        owner: repository.owner.name,
        base,
        head,
        repo: repository.name
    }).then(() => {
        return true;
    }).catch(error => {
        if (error.code === EHttpCode.conflict) {
            github.pullRequests.create({
                base,
                head,
                owner: repository.owner.name,
                repo: repository.name,
                title: `Merge conflict: ${head} into ${base}`
            }).then(response => {
                github.pullRequests.createReviewRequest({
                    owner: repository.owner.name,
                    repo: repository.name,
                    reviewers: [pusherName],
                    number: response.data.number
                });
            });
        }
        return false;
    });
};