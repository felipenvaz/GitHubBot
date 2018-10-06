import { fetch } from './../fetch';
import { GITHUB_URL } from './../constants';
import IEvent from '../interfaces/IEvent';
import EHttpCode from '../enums/EHttpCode';

export interface IListRepositoryEventsParams {
    owner: string;
    repository: string;
    eTag?: string;
}

export default interface IListRepositoryEventsResponse {
    xPollInterval: number;
    eTag: string;
    events: IEvent[];
    notModified?: boolean;
}

export const listRepositoryEvents = async ({ owner, repository, eTag }: IListRepositoryEventsParams): Promise<IListRepositoryEventsResponse> => {
    return fetch(`${GITHUB_URL}repos/${owner}/${repository}/events`, {
        headers: {
            'If-None-Match': eTag || ''
        }
    }).then(async res => {
        const xPollInterval = parseInt(res.headers.get('x-poll-interval') || '60', 10);
        const events = (res.status === 200 ? await res.json() : []);
        return {
            events,
            eTag: res.headers.get('etag') as string,
            xPollInterval: xPollInterval,
            notModified: res.status === EHttpCode.notModified
        }
    });
};