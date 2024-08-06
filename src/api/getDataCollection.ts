import { GetBestListingsByCollection, GetCollectionFromAddress } from "./opensea";
import { ChatState, CollectionData, NFTType } from "../interface";
import { Chain } from "../commands/index";


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
const getPriceCollection = async ( nft: string, chain: string) => {
    try {
        const bestListings = await GetBestListingsByCollection(nft);
        console.log("bestListings",bestListings);
        
        const price = convertToEth(Number(bestListings.listings[0].price.current.value)) + bestListings.listings[0].price.current.currency;
        return price
    } catch (error) {
        return `Error: ${error}`;
    }
}


/**
 * Get data nft for contract
 * @param {string} address
 * @param {string} chain
 * @return {*} 
 */
const getDataContract = async ( address: string, chain: string) => {
    // console.log(address, chain);
    
    try {
        const collection: CollectionData = await GetCollectionFromAddress(address, chain);
        
        const data = await GetBestListingsByCollection(collection.collection);
        const priceNFT = convertToEth(Number(data.listings[0].price.current.value)).toString();
        const currency = data.listings[0].price.current.currency;

        if(!collection) { return `Collection not found` }
        if(!data) { return `Data not found` }

        const nft: NFTType = {
            address: collection.address,
            chain: collection.chain,
            collection: collection.collection,
            name: collection.name,
            price: priceNFT,
            currency: currency,
        }

        return nft;
        
    } catch (error) {
        return `There was an error: ${error}`;
    }
}

export { getPriceCollection, getDataContract};
