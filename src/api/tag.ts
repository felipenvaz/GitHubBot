import { fetch } from '../fetch';
import EHttpCode from '../enums/EHttpCode';
import { GITHUB_URL } from '../constants';

export interface ICreateTagParams {
    owner: string;
    repository: string;
    sha: string;
    version: string;
}

export const createTag = async ({ owner, repository, sha, version }: ICreateTagParams): Promise<boolean> => {
    return fetch(`${GITHUB_URL}repos/${owner}/${repository}/git/tags`, {
        method: 'POST',
        body: JSON.stringify({
            tag: version,
            message: version,
            object: sha,
            type: 'commit'
        })
    }).then(async res => {
        if (res.status === EHttpCode.created) {
            const body = await res.json();
            const sha = body.sha;
            const { status } = await fetch(`${GITHUB_URL}repos/${owner}/${repository}/git/refs`, {
                method: 'POST',
                body: JSON.stringify({
                    sha,
                    ref: `refs/tags/${version}`
                })
            });

            return status === EHttpCode.created;
        }

        return false;
    })
}