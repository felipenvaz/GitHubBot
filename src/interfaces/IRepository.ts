import IOwner from './IOwner';

export default interface IRepository {
    name: string;
    full_name: string;
    owner: IOwner;
    archived: boolean;
}