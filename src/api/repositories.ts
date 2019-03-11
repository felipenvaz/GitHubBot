import { fetch } from './../fetch';
import { GITHUB_URL } from './../constants';
import IRepository from '../interfaces/IRepository';
import logger, { ELogType } from '../logger';

export const listRepositories = async (organization: string): Promise<Array<IRepository>> => {
    return fetch(`${GITHUB_URL}orgs/${organization}/repos?per_page=100`).then(async res => {
        const repositories = await res.json();
        if (!Array.isArray(repositories)) logger.log(`Respositories response is not a list: ${JSON.stringify(repositories)}`, ELogType.error);
        return repositories;
    });
}