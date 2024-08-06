import dotenv from 'dotenv';
import  { ResponseData, CollectionData } from '../interface/index';
dotenv.config();

if(!process.env.OPENSEA_API_KEY) {
    console.log('Error: Opensea API)KEY is not provided.');
    process.exit(1);
}

const options = {
    method: 'GET',
    headers: {accept: 'application/json', 'x-api-key': process.env.OPENSEA_API_KEY}
};

/**
 * Get contract data from address
 * src: https://docs.opensea.io/reference/get_contract
 */

export const GetCollectionFromAddress = async (address: string, chain: string): Promise<CollectionData> => {
    try {
        const response = await fetch(`https://api.opensea.io/api/v2/chain/${chain}/contract/${address}`, options);
        const data = await response.json();
        return data as CollectionData;
    } catch (err) {
        console.error(err);
        throw new Error('Failed to fetch collection data');
    }
};

export const GetBestListingsByCollection = async (collection: string) => {
    try {
        const response = await fetch(`https://api.opensea.io/api/v2/listings/collection/${collection}/best?limit=1`, options);
        const data = await response.json();
        return data as ResponseData;
    } catch (err) {
        console.error(err);
        throw new Error('Failed to fetch best listings');
    }
};
