export default interface IPullRequest {
    number: number;
    head: {
        ref: string; // without refs/heads
        repo: {
            name: string;
            owner: {
                login: string;
            }
        }
    },
    base: {
        ref: string; // without refs/heads
    },
    merged: boolean,
    user: {
        login: string;
    }
}