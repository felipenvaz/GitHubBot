import { fetch } from './../fetch';
import { GITHUB_URL } from './../constants';
import { DEBUG } from '../env';
import EHttpCode from '../enums/EHttpCode';

export interface ICreatePullRequestParams {
    owner: string;
    repository: string;
    base: string,
    head: string;
    title: string;
    body?: string;
}

export interface ICreatePullRequestResult {

}

export const createPullRequest = async ({ owner, repository, base, head, title, body }: ICreatePullRequestParams): Promise<ICreatePullRequestResult> => {
    return fetch(`${GITHUB_URL}repos/${owner}/${repository}/pulls`, {
        method: 'POST',
        body: JSON.stringify({
            base,
            head,
            title,
            body
        })
    }).then(res => {
        return {};
    });
}