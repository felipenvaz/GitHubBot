import IActor from './IActor';

export default interface IPushEvent {
    type: 'PushEvent';
    actor: IActor;
    payload: {
        ref: string;
    }
}