export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
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
}
