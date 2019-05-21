import { fetch } from './../fetch';
import { GITHUB_URL } from './../constants';
import EHttpCode from '../enums/EHttpCode';
import IPullRequest from '../interfaces/IPullRequest';
import logger, { ELogType } from '../logger';

export interface ICreatePullRequestParams {
    owner: string;
    repository: string;
    base: string,
    head: string;
    title: string;
    body?: string;
}

export interface ICreatePullRequestResponse {
    errors?: any[];
    pullRequest?: IPullRequest;
}

export const createPullRequest = async ({ owner, repository, base, head, title, body }: ICreatePullRequestParams): Promise<ICreatePullRequestResponse> => {
    logger.log(`Creating PR from ${head} into ${base}`);
    return fetch(`${GITHUB_URL}repos/${owner}/${repository}/pulls`, {
        method: 'POST',
        body: JSON.stringify({
            base,
            head,
            title,
            body
        })
    }).then(async res => {
        const content = await res.json();
        if (res.status === EHttpCode.created) {
            logger.log(`PR created`);
            return { pullRequest: content };
        } else {
            logger.log(`PR creation failed: ${JSON.stringify(content.errors)}`, ELogType.warning);
            return { errors: content.errors };
        }
    });
};

export interface ICreateReviewRequestParams {
    owner: string;
    repository: string;
    number: number;
    reviewers?: string[];
    team_reviewers?: string[];
}

export interface ICreateReviewRequestResponse {
    errors?: any[];
    pullRequest?: IPullRequest;
}

export const createReviewRequest = async ({ owner, repository, reviewers, team_reviewers, number }: ICreateReviewRequestParams): Promise<ICreateReviewRequestResponse> => {
    logger.log(`${repository}: Adding reviewers to PR #${number}`);
    return fetch(`${GITHUB_URL}repos/${owner}/${repository}/pulls/${number}/requested_reviewers`, {
        method: 'POST',
        body: JSON.stringify({
            reviewers,
            team_reviewers
        })
    }).then(async res => {
        const content = await res.json();
        if (res.status === EHttpCode.created) {
            logger.log(`${repository}: Added reviewers to PR #${number}`);
            return { pullRequest: content };
        } else {
            logger.log(`${repository}: Errors when adding reviewers to PR #${number}. ${JSON.stringify(content)}`);
            return { errors: content.errors };
        }
    });
};

export interface IAddAssigneesParams {
    owner: string;
    repository: string;
    assignees: string[];
    issueNumber: number;
}

export interface IAddAssigneesResponse {
    errors?: any[];
}

export const addAssignees = async ({ owner, repository, assignees, issueNumber }: IAddAssigneesParams): Promise<IAddAssigneesResponse> => {
    logger.log(`Adding assignes to PR(${issueNumber}): ${assignees.join(', ')}`);
    return fetch(`${GITHUB_URL}repos/${owner}/${repository}/issues/${issueNumber}/assignees`, {
        method: 'POST',
        body: JSON.stringify({
            assignees
        })
    }).then(async res => {
        const content = await res.json();
        if (res.status === EHttpCode.created) {
            logger.log(`Assignees added`);
            return {};
        } else {
            logger.log(`Fail when adding assignees`);
            return { errors: content.errors };
        }
    });
};

export interface IAddCommentParams {
    owner: string;
    repository: string;
    comment: string;
    issueNumber: number;
}

export const addComment = async ({ owner, repository, comment, issueNumber }: IAddCommentParams) => {
    return fetch(`${GITHUB_URL}repos/${owner}/${repository}/issues/${issueNumber}/comments`, {
        method: 'POST',
        body: JSON.stringify({
            body: comment
        })
    }).then(async res => {
        const content = await res.json();
        return { status: res.status, content };
    });
}

export interface IApprovePRParams {
    owner: string;
    repository: string;
    comment?: string;
    issueNumber: number;
}

export const approvePR = async ({ owner, repository, comment, issueNumber }: IApprovePRParams) => {
    return fetch(`${GITHUB_URL}repos/${owner}/${repository}/pulls/${issueNumber}/reviews`, {
        method: 'POST',
        body: JSON.stringify({
            body: comment,
            event: 'APPROVE'
        })
    }).then(async res => {
        const content = await res.json();
        return { status: res.status, content };
    });
}

export interface IGetPRsParams {
    owner: string;
    repository: string;
}

export const getPRs = ({ owner, repository }: IGetPRsParams): Promise<{ status: number; content: IPullRequest[] }> => {
    return fetch(`${GITHUB_URL}repos/${owner}/${repository}/pulls`, {
        method: 'GET',
    }).then(async res => {
        const content = await res.json();
        return { status: res.status, content };
    });
}

export interface IGetPRReviewsParams {
    owner: string;
    repository: string;
    number: number;
}

export const getPRReviews = ({ owner, repository, number }: IGetPRReviewsParams): Promise<{ status: number; content: any[] }> => {
    return fetch(`${GITHUB_URL}repos/${owner}/${repository}/pulls/${number}/reviews`, {
        method: 'GET',
    }).then(async res => {
        const content = await res.json();
        return { status: res.status, content };
    });
}