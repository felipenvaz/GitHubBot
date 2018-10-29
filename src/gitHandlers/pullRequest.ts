import IPullRequestEvent from '../interfaces/IPullRequestEvent';
import EBranch from '../enums/EBranch';
import { deleteBranch } from '../api/branch';
import { createReviewRequest } from '../api/pullRequest';
const appSettings = require('../../appSettings.json');

export const pullRequest = async ({ action, pull_request }: IPullRequestEvent) => {
    switch (action) {
        case "closed":
            if (pull_request.merged) {
                const { head: { ref, repo: { name, owner } } } = pull_request;
                if (ref === EBranch.develop || ref === EBranch.release || ref === EBranch.master) return;
                await deleteBranch(owner.login, name, ref);
            }
            break;
        case "opened":
        case "reopened":
            const { head: { ref, repo: { name, owner } }, number, user } = pull_request;
            await createReviewRequest({
                owner: owner.login,
                repository: name,
                number,
                reviewers: [...appSettings.default_reviewers.filter(u => u !== user.login)]
            })
            break;
    }
}