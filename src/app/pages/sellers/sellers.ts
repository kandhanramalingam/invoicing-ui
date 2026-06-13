import {Component, OnInit, inject, signal} from '@angular/core';
import {TableModule} from 'primeng/table';
import {Header} from '@shared/components/header/header';
import {NoData} from '@shared/components/no-data/no-data';
import {ActivatedRoute} from '@angular/router';
import {EventManagementService} from '@pages/event-management/event-management-service';
import {Event, Seller} from '@shared/interfaces/event.interface';
import {tap} from 'rxjs/operators';
import {of} from 'rxjs';

import {AppButton} from '@shared/components/app-button/app-button';
import {Tooltip} from 'primeng/tooltip';
import {DialogModule} from 'primeng/dialog';
import {InputNumberModule} from 'primeng/inputnumber';
import {FormsModule} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';

@Component({
  selector: 'app-sellers',
  imports: [
    TableModule,
    Header,
    NoData,
    AppButton,
    Tooltip,
    DialogModule,
    InputNumberModule,
    FormsModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './sellers.html',
  styleUrl: './sellers.scss',
})
export class Sellers implements OnInit {
  private route = inject(ActivatedRoute);
  private eventService = inject(EventManagementService);
  private messageService = inject(MessageService);

  eventId = signal<string | null>(null);
  event = signal<Event | null>(null);
  sellers = signal<Seller[]>([]);
  loading = signal<boolean>(false);

  totalRecords = signal<number>(0);
  rows = signal<number>(10);
  first = signal<number>(0);

  showEditDialog = signal<boolean>(false);
  selectedSeller = signal<Seller | null>(null);
  newCommission = signal<number>(0);
  saving = signal<boolean>(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('eventId');
    this.eventId.set(id);

    if (id) {
      this.loadEventAndSellers(id);
    }
  }

  loadEventAndSellers(eventId: string) {
    this.loading.set(true);

    const event$ = this.event() && this.event()?.id === eventId
      ? of(this.event()!)
      : this.eventService.getEventById(eventId).pipe(tap(event => this.event.set(event)));

    event$.subscribe({
      next: (event) => {
        if (!event.auctionId) {
          this.sellers.set([]);
          this.totalRecords.set(0);
          this.loading.set(false);
          return;
        }

        const page = this.first() / this.rows();
        const size = this.rows();
        this.eventService.getSellersByAuctionId(event.auctionId, page, size).subscribe({
          next: (res) => {
            this.sellers.set(res.records);
            this.totalRecords.set(res.totalRecords);
            this.loading.set(false);
          },
          error: () => {
            this.loading.set(false);
          }
        });
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  onLazyLoad(event: any) {
    this.first.set(event.first);
    this.rows.set(event.rows);
    const id = this.eventId();
    if (id) {
      this.loadEventAndSellers(id);
    }
  }

  editSeller(seller: Seller) {
    this.selectedSeller.set(seller);
    this.newCommission.set(seller.commission);
    this.showEditDialog.set(true);
  }

  saveCommission() {
    const seller = this.selectedSeller();
    if (seller) {
      this.saving.set(true);
      this.eventService.updateSellerCommission(seller.sellerInfoAutoid, this.newCommission()).subscribe({
        next: () => {
          this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Commission Updated', life: 3000});
          this.showEditDialog.set(false);
          this.saving.set(false);
          const id = this.eventId();
          if (id) {
            this.loadEventAndSellers(id);
          }
        },
        error: (err) => {
          this.saving.set(false);
          this.messageService.add({severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed to update commission'});
        }
      });
    }
  }

  deleteSeller(seller: Seller) {
    console.log('Delete Seller', seller);
  }
}
