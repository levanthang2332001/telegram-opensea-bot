export type Account = {
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
    updatedAt: string
}