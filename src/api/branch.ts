import { fetch } from '../fetch';
import { GITHUB_URL } from '../constants';
import EHttpCode from '../enums/EHttpCode';
import logger, { ELogType } from '../logger';

export const createBranch = async (owner: string, repository: string, ref: string, sha: string) => {
    logger.log(`Creating branch ${ref} on ${repository}`);
    return fetch(`${GITHUB_URL}repos/${owner}/${repository}/git/refs`, {
        method: 'POST',
        body: JSON.stringify({
            ref,
            sha
        })
    }).then(async res => {
        const content = await res.json();
        if (res.status === EHttpCode.created) {
            logger.log(`Branch ${content.ref} created`);
            return { ref: content.ref };
        } else {
            logger.log(JSON.stringify(content.message), ELogType.warning);
            return { error: content.message, already_exists: res.status === EHttpCode.unprocessableEntity };
        }
    });
}

export const deleteBranch = async (owner: string, repository: string, ref: string) => {
    return fetch(`${GITHUB_URL}repos/${owner}/${repository}/git/refs/heads/${ref}`, {
        method: 'DELETE'
    }).then(async res => {
        if (res.status === EHttpCode.noContent) return true;
        else return false;
    });
}