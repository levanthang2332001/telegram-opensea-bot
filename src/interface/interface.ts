interface Price {
    current: {
        currency: string;
        decimals: number;
        value: string;
    }
}

interface Offer {
    itemType: number;
    token: string;
    identifierOrCriteria: string;
    startAmount: string;
    endAmount: string;
    recipient?: string;
}

interface ProtocolData {
    parameters: {
        offerer: string;
        offer: Offer[];
        consideration: Offer[];
        startTime: string;
        endTime: string;
        orderType: number;
        zone: string;
        zoneHash: string;
        salt: string;
        conduitKey: string;
        totalOriginalConsiderationItems: number;
        counter: number;
    };
    signature: any;
}

interface Listing {
    order_hash: string;
    chain: string;
    type: string;
    price: Price;
    protocol_data: ProtocolData;
    protocol_address: string;
}

interface ResponseData {
    listings: Listing[];
    next: string;
}

interface CollectionData {
    address: string;
    chain: string;
    collection: string;
    contract_standard: string;
    name: string;
    total_supply: number;
}

interface ChatState {
    waitingForAddress?: boolean;
    waitingForAlert?: boolean;
}


type NFTType = {
    price: string;
    currency: string;
} & Partial<CollectionData>;

/* -------------------------------------------------------------- */

type User = {
    user_id: number,
    username: string,
    name: string
}

type NFTAlert = {
    collection_name: string;
    address: string;
    currency: string | null;
    chain: string | null;
}

type NFTAlertWithPrice = NFTAlert & {
    nft_id: number;
    targetprice: number;
    is_alert: boolean;
    user_id: number;
}

export type { 
    ResponseData, 
    CollectionData, 
    ChatState, 
    NFTType, 
    User, 
    NFTAlert,
    NFTAlertWithPrice
};