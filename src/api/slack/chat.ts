import { WebClient } from '@slack/web-api';
import { SLACK_TOKEN } from '../../env';

export interface IPostMessageParams {
    channel: string;
    text: string;
}

export const postMessage = async (params: IPostMessageParams) => {
    const web = new WebClient(SLACK_TOKEN);
    return await web.chat.postMessage(params);
}