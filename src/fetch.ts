import nodeFetch, { RequestInit } from 'node-fetch';
import { PERSONAL_TOKEN } from './env';

export const fetch = async (url: string, params: RequestInit = {}) => {
    params = {
        ...params,
        headers: {
            ...params.headers,
            Authorization: `token ${PERSONAL_TOKEN}`
        }
    };
    return nodeFetch(url, params)
}