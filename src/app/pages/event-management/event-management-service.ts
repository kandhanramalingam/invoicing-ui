import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environments} from '@env/environment';
import {Event} from '@shared/interfaces/event.interface';
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
}
