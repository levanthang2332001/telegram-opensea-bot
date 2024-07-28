import { GetBestListingsByCollection, GetCollectionFromAddress } from "./opensea";
import { ChatState, CollectionData, NFTType } from "../interface";
import { Chain } from "../../botCommands";


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

const getDataContract = async ( address: string, chain: string) => {
    // console.log(address, chain);
    
    try {
        const collection: CollectionData = await GetCollectionFromAddress(address, chain);
        const data = await GetBestListingsByCollection(collection.collection);

        if(!collection) { return `Collection not found` }
        if(!data) { return `Data not found` }

        const nft: NFTType = {
            address: collection.address,
            chain: collection.chain,
            collection: collection.collection,
            name: collection.name,
            price: convertToEth(Number(data.listings[0].price.current.value)).toString(),
            currency: data.listings[0].price.current.currency,
        }

        return nft;
        
    } catch (error) {
        return `Error: ${error}`;
    }
}

export { getPriceCollection, getDataContract};
