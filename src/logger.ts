import * as fs from 'fs';
import * as util from 'util';
import { DEBUG } from './env';

export enum ELogType {
    info = 0,
    warning,
    error
}

export default new class Logger {
    public async log(log: string, type: ELogType = ELogType.info) {
        log = `${(new Date()).toLocaleTimeString()}: ${log}`;
        if (!DEBUG && type === ELogType.info) return;
        if (type === ELogType.error) console.error(log);
        else console.log(log);

        await this.writeToLogFile(log);
    }

    private async writeToLogFile(log: string) {
        let fileDescriptor: number = null;
        try {
            fileDescriptor = await util.promisify(fs.open)(this.getLogFileName(), 'a');
            await util.promisify(fs.appendFile)(fileDescriptor, log + '\n');
        } catch (exception) {
            console.log(exception);
        } finally {
            if (fileDescriptor !== null)
                await util.promisify(fs.close)(fileDescriptor);
        }
    }

    private getLogFileName() {
        return `logs/${(new Date()).toLocaleDateString().replace(/\//g, '-')}.txt`;
    }
}