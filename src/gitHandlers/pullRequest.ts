import IPullRequestEvent from '../interfaces/IPullRequestEvent';
import EBranch from '../enums/EBranch';
import { deleteBranch } from '../api/branch';
import { createReviewRequest, addComment, approvePR } from '../api/pullRequest';
import { ENABLE_PR_QUOTES } from '../env';
import { getMembers } from '../api/teams';
const appSettings = require('../../appSettings.json');
const prQuotes = require('../../prQuotes.json');

export const pullRequest = async ({ action, pull_request }: IPullRequestEvent) => {
    switch (action) {
        case "closed":
            if (pull_request.merged) {
                const { head: { ref, repo: { name: repository, owner } } } = pull_request;
                if (ref === EBranch.develop || ref === EBranch.release || ref === EBranch.master) return;
                await deleteBranch(owner.login, repository, ref);
            }
            break;
        case "opened":
        case "reopened":
        case "synchronize":
            const { head: { ref, repo: { name, owner } }, number, user } = pull_request;
            const getDevelopmentMembers = await getMembers();
            await createReviewRequest({
                owner: owner.login,
                repository: name,
                number,
                reviewers: [...getDevelopmentMembers.map(u => u.login).filter(u => u !== user.login)]
            });

            if (appSettings.approve_prs.includes(user.login)) {
                await approvePR({
                    owner: owner.login,
                    repository: name,
                    issueNumber: number,
                })
            }

            if (action === "opened" && ENABLE_PR_QUOTES && prQuotes.coolGuys.includes(user.login)) {
                const quotes: string[] = prQuotes.quotes;
                const pos = Math.floor(Math.random() * quotes.length);
                await addComment({
                    owner: owner.login,
                    repository: name,
                    issueNumber: number,
                    comment: quotes[pos]
                })
            }
            break;
    }
}