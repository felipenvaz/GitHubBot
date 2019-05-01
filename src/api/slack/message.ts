import { SLACK_URL } from '../../constants';
import { slackFetch } from './slackFetch';

interface ISendMessageParams {
    text: string;
    channel: string;
}

export const sendMessage = ({ text, channel }: ISendMessageParams) => {
    const body = JSON.stringify({
        text,
        channel,
    });
    return slackFetch(`${SLACK_URL}chat.postMessage`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body
    }).then(async res => {
        const response = await res.json();
        console.log(body);
        console.log(response);
    });
}