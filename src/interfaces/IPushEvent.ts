import IActor from './IActor';
import IEvent from './IEvent';

export default interface IPushEvent extends IEvent {
    type: 'PushEvent';
    actor: IActor;
    payload: {
        ref: string;
    }
}