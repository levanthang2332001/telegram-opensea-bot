export interface IUser {
    userId: number;
    username: string;
    nft: [
        {
            collection: string;
            address: string;
            chain: string;
            targetPrice: number;
            currency: string;
        }
    ];
}

