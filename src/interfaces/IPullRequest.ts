export default interface IPullRequest {
    number: number;
    head: {
        ref: string; // without refs/heads
    },
    base: {
        ref: string; // without refs/heads
    }
}