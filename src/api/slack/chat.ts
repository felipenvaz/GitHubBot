import { SLACK_URL } from '../../constants';
import { slackFetch } from './slackFetch';


export const getChatList = () => {
    return slackFetch(`${SLACK_URL}conversations.list?types=public_channel,private_channel`, {
        method: 'GET',
    }).then(async res => {
        const response = await res.json();
        console.log(response);
    });
}