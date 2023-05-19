export type CrumbType = { name: string; route: string };

export type addressType = `0x${string}`;

export type NftType = "NGM1155" | "NGM721PSI" | "NGMTINY721";

export type CollectionCardType = {
  chain: string;
  collection_name: string;
  contract_address: string;
  owner_address: string;
  symbol: string;
  transactionhash: string;
  type: string;
  __v: number;
  _id: string;
  baseuri: string;
  imageuri: string[];
};

export type CollectionCardTypes = {
  chain: string;
  collection_name: string;
  contract_address: string;
  owner_address: string;
  symbol: string;
  transactionhash: string;
  createdAt: string;
  type: string;
  description: string;
  __v: number;
  _id: string;
  baseuri: string;
  imageuri: string[];
};
// export type CollectionCardType = {
//   chain: number
//   name: string
//   imageFront: string
//   imageMiddle: string
//   imageBack: string
// }

export type selectDataType = {
  name: string;
  value: string;
};

// export type AvatarType = {
//   name: string
//   img: string
//   tokenId: number
//   contractAddress: string
//   isOnAuction: boolean
// }

// export type AvatarType = {
//   name: string
//   img: string
//   contract_address: string
//   contract_type: string
//   createdAt: string
//   is_in_auction: boolean
//   is_in_sale: boolean
//   meta_data_url: string
//   token_id: string
//   token_owner: string
//   updatedAt: string
//   __v: number
//   _id: string
//   contract_details: {
//     _id: string
//     symbol: string
//     chain: string
//     type: string
//     transactionhash: string
//     baseuri: string
//     createdAt: string
//     updatedAt: string
//     __v: number
//     description: string
//     imageuri: string[]
//     owner_address: string
//     collection_name: string
//     contract_address: string
//   }
// }

// export type AvatarType = {
//   contract_details: {
//     _id: string
//     symbol: string
//     owner_address: string
//     collection_name: string
//     chain: string
//     type: string
//     transactionhash: string
//     contract_address: string
//     description: string
//     baseuri: string
//     imageuri: string[]
//     createdAt: string
//     updatedAt: string
//     __v: number
//   }
//   nft: {
//     _id: string
//     contract_address: string
//     contract_type: string
//     token_id: string
//     meta_data_url: string
//     is_in_auction: boolean
//     is_in_sale: boolean
//     token_owner: string
//     createdAt: string
//     updatedAt: string
//     __v: number
//   }
// }

export type AvatarType = {
  _id: string;
  contract_address: string;
  contract_type: string;
  token_id: string;
  meta_data_url: string;
  number_of_tokens?: number;
  listed_tokens?: number;
  is_in_auction: boolean;
  is_in_sale: boolean;
  token_owner: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  meta_data: {
    name: string;
    image: string;
    description: string;
    external_uri: string;
    attributes: { name: string; value: string }[];
  };
};

export type NftContractType = {
  _id: string;
  symbol: string;
  owner_address: string;
  collection_name: string;
  chain: {
    id: any;
    name: string;
  };
  type: string;
  transactionhash: string;
  contract_address: string;
  description: string;
  baseuri: string;
  imageuri: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type nftAuctionBodyType = {
  token_owner: string;
  contract_address: string;
  token_id: string;
  start_date: string;
  end_date: string;
  min_price: number;
  sign: string;
};

export type NftBidBodyType = {
  bidder_address: string;
  contract_address: string;
  token_id: string;
  bid_amount: number;
  sign: string;
};

export type BidType = {
  _id: string;
  auction_id: string;
  bidder_address: string;
  contract_address: string;
  token_id: string;
  bid_amount: number;
  is_auction_ended: boolean;
  createdAt: string;
  updatedAt: string;
  status: string;
  __v: number;
};

export type AuctionType = {
  _id: string;
  token_owner: string;
  contract_address: string;
  token_id: string;
  start_date: string;
  end_date: string;
  min_price: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  __v: number;
};

export type nftCancelbidType = {
  bidder_address: string;
  token_id: string;
  contract_address: string;
  sign: string;
};

export type CollectionNftsBodyType = {
  contract_address?: string;
  token_owner?: string;
  listed_in?: string;
  page_number: number;
  items_per_page: number;
  order: "NewToOld" | "OldToNew";
  alphabetical_order: "AtoZ" | "ZtoA";
  nftType?: NftType;
};

export type NftSaleBodyType = {
  token_owner: string;
  contract_address: string;
  token_id: string;
  start_date: string;
  end_date: string;
  price: number;
  sign: string;
};

export type Nft1155SaleBodyType = {
  token_owner: any;
  contract_address: string;
  token_id: number;
  number_of_tokens: number;
  start_date: string;
  end_date: string;
  per_unit_price: number;
  sign: string;
};

export type NftOfferBodyType = {
  contract_address: string;
  token_id: string;
  offer_price: string;
  offer_person_address: string;
  sign: string;
};

export type NftCancelOfferBodyType = {
  contract_address: string;
  token_id: string;
  offer_person_address: any;
  caller: string;
  sign: string;
};

export type OfferType = {
  _id: string;
  sale_id: string;
  contract_address: string;
  token_id: string;
  offer_price: string;
  offer_person_address: string;
  createdAt: string;
  updatedAt: string;
  offer_status: string;
  status: string;
  __v: number;
};

export type SaleType = {
  _id: string;
  token_owner: string;
  contract_address: string;
  token_id: string;
  price: string;
  start_date: string;
  end_date: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  __v: number;
};

export type Sale1155Type = {
  _id: string;
  token_owner: string;
  contract_address: string;
  token_id: string;
  number_of_tokens: number;
  start_date: string;
  end_date: string;
  per_unit_price: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  __v: number;
};
export type ActivityType = {
  id: any;
  driver: string;
  traveller: string;
  distance: any;
  from: string;
  to: string;
  costPerKM: any;
  status: any;
};

export type NftAcceptOfferBodyType = {
  contract_address: string;
  token_id: string;
  offer_person_address: any;
  token_owner: string;
};

export type UserType = {
  _id: string;
  username: string;
  wallet_address: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  banner_image?: string;
  profile_image?: string;
  __v: number;
};

export type Make1155Offer = {
  offer_person_address: string;
  contract_address: string;
  token_id: number;
  number_of_tokens: number;
  per_unit_price: number;
  sign: string;
};

export type Cancel1155Offer = {
  offer_person_address: string;
  contract_address: string;
  token_id: number;
  sign: string;
};

export type Accept1155Offer = {
  offer_person_address: string;
  contract_address: string;
  token_owner: string;
  token_id: number;
  number_of_tokens: number;
  sign: string;
};

export type ListingType = {
  contract_address: string;
  createdAt: string;
  end_date: string;
  number_of_tokens: number;
  per_unit_price: number;
  start_date: string;
  status: string;
  token_id: string;
  token_owner: string;
  updatedAt: string;
  __v: number;
  _id: string;
};
