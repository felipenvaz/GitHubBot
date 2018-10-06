import { fetch } from './../fetch';
import { GITHUB_URL } from './../constants';
import IRepository from '../interfaces/IRepository';

export const listRepositories = async (organization: string): Promise<Array<IRepository>> => {
    return fetch(`${GITHUB_URL}orgs/${organization}/repos`).then(res => res.json());
}