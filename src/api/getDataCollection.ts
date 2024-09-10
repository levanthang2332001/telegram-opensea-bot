import { GetBestListingsByCollection, GetCollectionFromAddress } from "./opensea";
import { ChatState, CollectionData, NFTType } from "../interface";

const convertToEth = (price: number) => {
    return price / Math.pow(10, 18);
}
    
/**
 * Get data nft for collection
 *
 * @param {number} chatId
 * @param {string} nft
 * @param {ChatState} state
 * @param {Chain} chain
 */
const getPriceCollection = async (nft: string, chain: string): Promise<string> => {
    try {
        const bestListings = await GetBestListingsByCollection(nft);
        
        if (!bestListings.listings || bestListings.listings.length === 0) {
            throw new Error('No listings found');
        }
        
        const { value, currency } = bestListings.listings[0].price.current;
        const priceInEth = convertToEth(Number(value)).toFixed(6);
        
        return `${priceInEth} ${currency}`;
    } catch (error) {
        console.error('Error in getPriceCollection:', error);
        return `Error: ${error instanceof Error ? error.message : String(error)}`;
    }
}


/**
 * Get data nft for contract
 * @param {string} address
 * @param {string} chain
 * @return {*} 
 */
const getDataContract = async (address: string, chain: string): Promise<NFTType | string> => {
    try {
        const collection = await GetCollectionFromAddress(address, chain);
        if (!collection) {
            throw new Error('Collection not found');
        }

        const data = await GetBestListingsByCollection(collection.collection);
        if (!data || !data.listings || data.listings.length === 0) {
            throw new Error('No listings found for the collection');
        }

        const { value, currency } = data.listings[0].price.current;
        const priceNFT = convertToEth(Number(value)).toFixed(6)

        return {
            address: collection.address,
            chain: collection.chain,
            collection: collection.collection,
            name: collection.name,
            price: priceNFT,
            currency,
        };
    } catch (error) {
        console.error('Error in getDataContract:', error);
        return `There was an error: ${error instanceof Error ? error.message : String(error)}`;
    }
}

export { getPriceCollection, getDataContract};
