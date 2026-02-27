import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../../environments/environment';
import { Event } from '@shared/interfaces/event.interface';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environments.baseURL}`;

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.API_URL}/events`);
  }

  getEventById(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.API_URL}/events/${id}`);
  }

  createEvent(event: Partial<Event>): Observable<Event> {
    return this.http.post<Event>(`${this.API_URL}/events`, event);
  }

  updateEvent(id: string, event: Partial<Event>): Observable<Event> {
    return this.http.put<Event>(`${this.API_URL}/events/${id}`, event);
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/events/${id}`);
  }
}
