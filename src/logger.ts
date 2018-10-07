import * as fs from 'fs';
import { DEBUG } from './env';
const logFile = 'log.txt';

export enum ELogType {
    info = 0,
    warning,
    error
}

export default new class Logger {
    public async log(log: string, type: ELogType = ELogType.info) {
        log = `${(new Date()).toLocaleString()}: ${log}`;
        if (!DEBUG && type === ELogType.info) return;
        if (type === ELogType.error) console.error(log);
        else console.log(log);

        await this.writeToLogFile(log);
    }

    private async writeToLogFile(log: string) {
        let fileDescriptor: number = null;
        try {
            fileDescriptor = fs.openSync(logFile, 'a');
            fs.appendFileSync(fileDescriptor, log + '\n');
        } catch (exception) {
            console.log(exception);
        } finally {
            if (fileDescriptor !== null)
                await fs.closeSync(fileDescriptor);
        }
    }
}