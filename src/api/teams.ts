import { fetch } from '../fetch';
import { GITHUB_URL } from '../constants';
import { ORGANIZATION, HIPPO_DEVELOPMENT } from '../env';

export const getMembers = async (team = HIPPO_DEVELOPMENT): Promise<any> => {
    return fetch(`${GITHUB_URL}teams/${team}/members`, {
        method: 'GET',
    }).then(async res => {
        const body = await res.json();
        console.log(body);

        return body;
    })
}

export const getTeams = async (): Promise<any> => {
    return fetch(`${GITHUB_URL}orgs/${ORGANIZATION}/teams`, {
        method: 'GET',
    }).then(async res => {
        const body = await res.json();
        console.log(body);

        return body;
    })
}