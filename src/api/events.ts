import { fetch } from './../fetch';
import { GITHUB_URL } from './../constants';
import IEvent from '../interfaces/IEvent';
import { DEBUG } from '../env';

export interface IListRepositoryEventsParams {
    owner: string;
    repository: string;
    eTag?: string;
}

export default interface IListRepositoryEventsResponse {
    xPollInterval: number;
    eTag: string;
    events: IEvent[];
}

export const listRepositoryEvents = async ({ owner, repository, eTag }: IListRepositoryEventsParams): Promise<IListRepositoryEventsResponse> => {
    return fetch(`${GITHUB_URL}repos/${owner}/${repository}/events`, {
        headers: {
            ETag: eTag || ''
        }
    }).then(async res => {
        const events = await res.json();
        const xPollIntervalString = res.headers.get('x-poll-interval');
        if (DEBUG)
            console.log(`${repository} returned a ${xPollIntervalString} polling interval`);

        return {
            events,
            eTag: res.headers.get('etag') as string,
            xPollInterval: parseInt(xPollIntervalString || '60', 10)
        }
    });
};