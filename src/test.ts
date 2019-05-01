import { getUserList } from './api/slack/user';
import { postMessage } from './api/slack/chat';

(async () => {
    await postMessage({
        channel: 'dev',
        text: ':kyle:'
    });
})();
