import IActor from './IActor';
import IEvent from './IEvent';
import IPush from './IPush';

export default interface IPushEvent extends IEvent {
    type: 'PushEvent';
    actor: IActor;
    payload: IPush;
}