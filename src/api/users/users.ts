import db from '../../libs/mongoose';
import User from '../../models/User';

import { IUser } from '../../interface';

const POST = async ( user: IUser) => {
    const { userId, username, nft } = user;
    
    await db.connect();

    try {
        const newUser = new User({
            userId,
            username,
            nft: [
                {
                    collection: nft[0].collection,
                    address: nft[0].address,
                    chain: nft[0].chain,
                    targetPrice: nft[0].targetPrice,
                    currency: nft[0].currency
                }
                ]
        });

        await newUser.save();
    } catch (error) {
        console.error(error);
    }
}