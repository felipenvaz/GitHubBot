import express from 'express';
import { PORT } from './env';
import { push } from './gitHandlers/push';
import logger, { ELogType } from './logger';
import IPush from './interfaces/IPush';
import { createBranch } from './api/branch';
import { createPullRequest } from './api/pullRequest';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`I'm a bot`);
});

app.post('/github', async (req, res) => {
    try {
        const eventType = req.get('X-GitHub-Event');
        if (eventType)
            switch (eventType) {
                case 'push':
                    const pushBody = req.body as IPush;
                    await logger.log(`Push event on branch ${pushBody.repository.full_name}`);
                    await push(pushBody);
                    break;
            }
        res.sendStatus(200);
    } catch (exception) {
        logger.log(`Internal Error: ${JSON.stringify(exception)}`, ELogType.error);
        res.sendStatus(500);
    }
});

app.listen(PORT, () => logger.log(`App listening on port ${PORT}`));

/* (async () => {
    const response = await createPullRequest({
        owner: 'HippoCMMS',
        repository: 'LoginSite',
        base: 'release',
        head: 'test/bot',
        title: 'test pr'
    });
    console.log(response);
})(); */