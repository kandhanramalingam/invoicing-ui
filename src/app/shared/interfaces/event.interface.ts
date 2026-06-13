export interface Event {
  id: string;
  name: string;
  auctionId?: number;
  location: string;
  type: string;
  status: string;
  depositAmount: number;
  seller: number;
  sellerCommissionType: boolean;
  sellerAuctionFee: number;
  sellerEventFee: number;
  sellerClubFee: number;
  sellerVeterinaryFee: number;
  sellerMarketingFee: number;
  buyer: number;
  buyerCommissionType: boolean;
  buyerAuctionFee: number;
  buyerEventFee: number;
  buyerClubFee: number;
  buyerVeterinaryFee: number;
  buyerMarketingFee: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  auction?: Auction;
}

export interface Auction {
  id: number;
  nameOfAuction: string;
  dateOfAuction: string;
  status: string;
  gpsCord1?: string;
  gpsCord2?: string;
}

export interface Lot {
  id: number;
  mainLotNo: string;
  mainlotno?: string; // from user old code
  wildlifeType?: string;
  description: string;
  price: string;
  sumTotal: number;
  sum_total?: number; // from user old code
  vmStatus: string;
  VMStatus?: string; // from user old code
  firstName: string | null;
  lastName: string;
  userId: number;
  user_id?: number;
  bidder_no?: string;
  seller_id?: number;
  seller_name?: string;
  auctionId: number;
  [key: string]: any;
}

export interface GroupedLot {
  userId: number;
  firstName: string;
  lastName: string;
  bidderNo: string;
  lots: Lot[];
}

export interface Seller {
  sellerInfoAutoid: number;
  auctionId: number;
  sellerId: number;
  sellerName: string;
  companyName: string;
  email: string;
  contact: string;
  sellerLogo: string;
  commission: number;
  createdOn: string;
}
