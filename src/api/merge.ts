import { fetch } from './../fetch';
import { GITHUB_URL } from './../constants';
import { DEBUG } from '../env';
import EHttpCode from '../enums/EHttpCode';

export interface IMergeParams {
    owner: string;
    repository: string;
    base: string,
    head: string;
    commit_message?: string;
}

export interface IMergeResult {
    conflict: boolean;
}

export const merge = async ({ owner, repository, base, head, commit_message }: IMergeParams): Promise<IMergeResult> => {
    if (DEBUG)
        console.log(`Trying to merge ${head} into ${base} on ${repository}`);

    return fetch(`${GITHUB_URL}repos/${owner}/${repository}/merges`, {
        method: 'POST',
        body: JSON.stringify({
            base,
            head,
            commit_message
        })
    }).then(res => {
        if (DEBUG) {
            switch (res.status) {
                case EHttpCode.created:
                    console.log(`Merge commit created`);
                    break;
                case EHttpCode.noContent:
                    console.log(`There was nothing to merge`);
                    break;
                case EHttpCode.conflict:
                    console.log(`There was a merge conflict happened`);
                    break;
            }
        }
        return { conflict: res.status === EHttpCode.conflict };
    });
}