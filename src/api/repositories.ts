import { fetch } from './../fetch';
import { GITHUB_URL } from './../constants';

export const listRepositories = async (organization: string) => {
    return fetch(`${GITHUB_URL}orgs/${organization}/repos`).then(res => res.json());
}