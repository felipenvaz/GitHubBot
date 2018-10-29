import IRepository from './IRepository';
import ICommit from './ICommit';

export default interface IPush {
    ref: string;
    commits: ICommit[];
    created: boolean;
    deleted: boolean;
    forced: boolean;
    repository: IRepository;
    pusher: { name: string };
    head_commit?: { id: string; }
}