export default interface IBranch {
    name: string;
    commit: { sha: string; };
}