import { fetch } from './../fetch';
import { GITHUB_URL } from './../constants';
import { DEBUG } from '../env';
import EHttpCode from '../enums/EHttpCode';
import IPullRequest from '../interfaces/IPullRequest';

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
            return content;
        } else {
            return { errors: content.errors };
        }
    });
};

export interface ICreateReviewRequestParams {
    owner: string;
    repository: string;
    reviewers?: string[];
    team_reviewers?: string[];
}

export interface ICreateReviewRequestResponse {
    errors?: any[];
    pullRequest?: IPullRequest;
}

export const createReviewRequest = async ({ owner, repository, reviewers, team_reviewers }: ICreateReviewRequestParams): Promise<ICreateReviewRequestResponse> => {
    return fetch(`${GITHUB_URL}repos/${owner}/${repository}/pulls`, {
        method: 'POST',
        body: JSON.stringify({
            reviewers,
            team_reviewers
        })
    }).then(async res => {
        const content = await res.json();
        if (res.status === EHttpCode.created) {
            return { pullRequest: content };
        } else {
            return { errors: content.errors };
        }
    });
};