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
    const url = `https://api.opensea.io/api/v2/chain/${chain}/contract/${address}`;
    return fetchData<CollectionData>(url, 'Failed to fetch collection data');
};

export const GetBestListingsByCollection = async (collection: string): Promise<ResponseData> => {
    const url = `https://api.opensea.io/api/v2/listings/collection/${collection}/best?limit=1`;
    return fetchData<ResponseData>(url, 'Failed to fetch best listings');
};

async function fetchData<T>(url: string, errorMessage: string): Promise<T> {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json() as T;
    } catch (err) {
        console.error(err);
        throw new Error(errorMessage);
    }
}
