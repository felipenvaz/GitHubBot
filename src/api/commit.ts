import { GITHUB_URL } from '../constants';
import { fetch } from '../fetch';
import EHttpCode from '../enums/EHttpCode';

export interface IGetCommitParams {
    owner: string;
    repository: string;
    sha: string;
}

export const getCommit = ({ owner, repository, sha }: IGetCommitParams) => {
    return fetch(`${GITHUB_URL}repos/${owner}/${repository}/commits/${sha}`).then(async res => {
        if (res.status !== EHttpCode.success) return null;

        const body = await res.json();
        return body;
    });
};