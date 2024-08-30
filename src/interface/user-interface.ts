export interface IUser {
    userId: number;
    username: string;
    name: string;
    nfts: [
        {
            collection: string;
            address: string;
            chain: string;
            targetPrice: number;
            currency: string;
        }
    ];
}

