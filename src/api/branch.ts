import { fetch } from '../fetch';
import { GITHUB_URL } from '../constants';
import EHttpCode from '../enums/EHttpCode';
import logger, { ELogType } from '../logger';
import IBranch from '../interfaces/IBranch';

export const createBranch = async (owner: string, repository: string, ref: string, sha: string) => {
    logger.log(`Creating branch ${repository}/${ref}`);
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
    logger.log(`Trying to delete branch ${ref} on ${repository}`);
    return fetch(`${GITHUB_URL}repos/${owner}/${repository}/git/refs/heads/${ref}`, {
        method: 'DELETE'
    }).then(async res => {
        if (res.status === EHttpCode.noContent) {
            logger.log(`Branch ${repository}/${ref} deleted`);
            return true;
        } else {
            logger.log(`There was an error deleting branch ${repository}/${ref}`, ELogType.warning);
            return false;
        }
    });
}

export const getBranch = async (owner: string, repository: string, branch: string): Promise<IBranch> => {
    return fetch(`${GITHUB_URL}repos/${owner}/${repository}/branches/${branch}`, {
        method: 'GET'
    }).then(async res => {
        if (res.status === EHttpCode.success) return await res.json();
        else null;
    });
}