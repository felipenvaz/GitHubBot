import nodeFetch, { RequestInit } from 'node-fetch';
import { SLACK_TOKEN } from '../../env';

export const slackFetch = async (url: string, params: RequestInit = {}) => {
    params = {
        ...params,
        headers: {
            ...params.headers,
            Authorization: `Bearer ${SLACK_TOKEN}`
        }
    };
    return nodeFetch(url, params)
}