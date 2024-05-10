import dotenv from 'dotenv';
dotenv.config();

if(!process.env.OPENSEA_API_KEY) {
    console.log('Error: Opensea API)KEY is not provided.');
    process.exit(1);
}

const options = {
    method: 'GET',
    headers: {accept: 'application/json', 'x-api-key': process.env.OPENSEA_API_KEY}
};

const GetCollectionFromAddress = async(address: string, chain: string) => {

    fetch(`https://api.opensea.io/api/v2/chain/${chain}/contract/${address}`, options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
} 

const GetBestListingsByCollection = async(collection: string) => {
    fetch(`https://api.opensea.io/api/v2/listings/collection/${collection}/best?limit=1`,options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
}

console.log(GetCollectionFromAddress('0x251BE3A17Af4892035C37ebf5890F4a4D889dcAD','matic'))
console.log(GetBestListingsByCollection('courtyard-nft'));