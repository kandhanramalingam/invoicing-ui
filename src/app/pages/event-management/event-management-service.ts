import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environments} from '@env/environment';
import {Event, Auction, Lot, GroupedLot, Seller} from '@shared/interfaces/event.interface';
import {ResponseDto, PaginatedDetailsDto} from '@shared/interfaces/api.interface';

@Injectable({
  providedIn: 'root',
})
export class EventManagementService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environments.baseURL}`;

  getAllEvents(page: number = 0, size: number = 10, search?: string, sort?: string): Observable<PaginatedDetailsDto<Event>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (search) params = params.set('search', search);
    if (sort) params = params.set('sort', sort);
    return this.http.get<ResponseDto<PaginatedDetailsDto<Event>>>(`${this.API_URL}/events`, {params})
      .pipe(map(res => res.data));
  }

  getEventById(id: string): Observable<Event> {
    return this.http.get<ResponseDto<Event>>(`${this.API_URL}/events/${id}`)
      .pipe(map(res => res.data));
  }

  createEvent(event: Partial<Event>): Observable<Event> {
    return this.http.post<ResponseDto<Event>>(`${this.API_URL}/events`, event)
      .pipe(map(res => res.data));
  }

  updateEvent(id: string, event: Partial<Event>): Observable<Event> {
    return this.http.put<ResponseDto<Event>>(`${this.API_URL}/events/${id}`, event)
      .pipe(map(res => res.data));
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<ResponseDto<void>>(`${this.API_URL}/events/${id}`)
      .pipe(map(() => void 0));
  }

  getAuctions(page: number = 0, size: number = 100, search?: string): Observable<PaginatedDetailsDto<Auction>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('lessDetails', 'true');
    if (search) params = params.set('search', search);
    return this.http.get<ResponseDto<PaginatedDetailsDto<Auction>>>(`${this.API_URL}/auctions`, {params})
      .pipe(map(res => res.data));
  }

  getLotsByAuctionId(auctionId: number, page: number = 0, size: number = 100): Observable<PaginatedDetailsDto<Lot>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ResponseDto<PaginatedDetailsDto<Lot>>>(`${this.API_URL}/lots/auctions/${auctionId}`, {params})
      .pipe(map(res => res.data));
  }

  getGroupedLotsByAuctionId(auctionId: number): Observable<GroupedLot[]> {
    return this.http.get<ResponseDto<GroupedLot[]>>(`${this.API_URL}/lots/auctions/${auctionId}/groupByBuyer`)
      .pipe(map(res => res.data));
  }

  getGroupedBySellerLotsByAuctionId(auctionId: number): Observable<GroupedLot[]> {
    return this.http.get<ResponseDto<GroupedLot[]>>(`${this.API_URL}/lots/auctions/${auctionId}/groupBySeller`)
      .pipe(map(res => res.data));
  }

  getSellersByAuctionId(auctionId: number, page: number = 0, size: number = 10): Observable<PaginatedDetailsDto<Seller>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ResponseDto<PaginatedDetailsDto<Seller>>>(`${this.API_URL}/sellers/auctions/${auctionId}`, {params})
      .pipe(map(res => res.data));
  }

  updateSellerCommission(sellerInfoAutoid: number, commission: number): Observable<void> {
    const params = new HttpParams().set('commission', commission.toString());
    return this.http.put<ResponseDto<void>>(`${this.API_URL}/sellers/${sellerInfoAutoid}/commission`, null, {params})
      .pipe(map(() => void 0));
  }
}
