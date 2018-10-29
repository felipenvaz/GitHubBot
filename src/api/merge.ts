import { fetch } from './../fetch';
import { GITHUB_URL } from './../constants';
import EHttpCode from '../enums/EHttpCode';
import logger from '../logger';

export interface IMergeParams {
    owner: string;
    repository: string;
    base: string,
    head: string;
    commit_message?: string;
}

export interface IMergeResult {
    conflict: boolean;
    nothingToMerge: boolean;
    sha?: string;
    created: boolean;
}

export const merge = async ({ owner, repository, base, head, commit_message }: IMergeParams): Promise<IMergeResult> => {
    logger.log(`Trying to merge ${head} into ${base} on ${repository}`);

    return fetch(`${GITHUB_URL}repos/${owner}/${repository}/merges`, {
        method: 'POST',
        body: JSON.stringify({
            base,
            head,
            commit_message
        })
    }).then(async res => {
        let nothingToMerge = false;
        let sha = null;
        switch (res.status) {
            case EHttpCode.created:
                const body = await res.json();
                sha = body.sha;
                logger.log(`Merge commit created`);
                break;
            case EHttpCode.noContent:
                nothingToMerge = true;
                logger.log(`There was nothing to merge`);
                break;
            case EHttpCode.conflict:
                logger.log(`There was a merge conflict`);
                break;
        }

        return {
            conflict: res.status === EHttpCode.conflict,
            created: res.status === EHttpCode.created,
            nothingToMerge,
            sha
        };
    });
}