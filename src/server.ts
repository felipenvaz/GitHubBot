import express from 'express';
import { PORT } from './env';
import { push } from './gitHandlers/push';
import logger, { ELogType } from './logger';
import IPush from './interfaces/IPush';
import { isValidSecret } from './util';
import { pullRequest } from './gitHandlers/pullRequest';
import bodyParser from 'body-parser';
import * as fs from 'fs';

const dir = './logs';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.get('/', (req, res) => {
    res.send(`I'm a bot`);
});

app.post('/github', async (req, res) => {
    try {
        const secret = req.get('X-Hub-Signature');
        if (!isValidSecret(secret, req.body)) {
            res.sendStatus(401);
            return;
        }

        const eventType = req.get('X-GitHub-Event');
        if (eventType)
            switch (eventType) {
                case 'push':
                    const pushBody = req.body as IPush;
                    await logger.log(`Push event on branch ${pushBody.repository.full_name}`);
                    await push(pushBody);
                    break;
                case 'pull_request':
                    await pullRequest(req.body);
                    break;
            }
        res.sendStatus(200);
    } catch (exception) {
        logger.log(`Internal Error: ${JSON.stringify(exception)}`, ELogType.error);
        res.sendStatus(500);
    }
});

const port = PORT || 31435;
app.listen(port, () => logger.log(`App listening on port ${port}`));
