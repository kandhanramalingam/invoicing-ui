import {Component, OnInit, inject, signal, computed} from '@angular/core';
import {TableModule} from 'primeng/table';
import {ToggleSwitchModule} from 'primeng/toggleswitch';
import {FormsModule} from '@angular/forms';
import {Header} from '@shared/components/header/header';
import {NoData} from '@shared/components/no-data/no-data';
import {ActivatedRoute} from '@angular/router';
import {EventManagementService} from '@pages/event-management/event-management-service';
import {Event, Lot} from '@shared/interfaces/event.interface';
import {switchMap, tap, map} from 'rxjs/operators';
import {of} from 'rxjs';
import {Button} from 'primeng/button';
import {Tooltip} from 'primeng/tooltip';
import {TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-lots',
  imports: [
    TableModule,
    ToggleSwitchModule,
    FormsModule,
    Header,
    NoData,
    Button,
    Tooltip,
    TitleCasePipe
  ],
  templateUrl: './lots.html',
  styleUrl: './lots.scss',
})
export class Lots implements OnInit {
  private route = inject(ActivatedRoute);
  private eventService = inject(EventManagementService);

  eventId = signal<string | null>(null);
  event = signal<Event | null>(null);
  lots = signal<Lot[]>([]);
  loading = signal<boolean>(false);

  groupByBuyer = signal<boolean>(true);
  groupBySeller = signal<boolean>(false);

  totalRecords = signal<number>(0);
  rows = signal<number>(10);
  first = signal<number>(0);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('eventId');
    this.eventId.set(id);

    if (id) {
      this.loadEventAndLots(id);
    }
  }

  loadEventAndLots(eventId: string) {
    this.loading.set(true);
    const isBuyerGrouped = this.groupByBuyer();
    const isSellerGrouped = this.groupBySeller();

    const event$ = this.event() && this.event()?.id === eventId
      ? of(this.event()!)
      : this.eventService.getEventById(eventId).pipe(tap(event => this.event.set(event)));

    event$.pipe(
      switchMap(event => {
        if (!event.auctionId) {
          return of({records: [], totalRecords: 0, totalPages: 0, page: 0, perPage: 10} as any);
        }

        if (isBuyerGrouped) {
          return this.eventService.getGroupedLotsByAuctionId(event.auctionId).pipe(
            map(groupedData => {
              // Flatten grouped data for the table while keeping it compatible with row grouping
              const flattened: Lot[] = [];
              groupedData.forEach(group => {
                group.lots.forEach(lot => {
                  // Ensure data from group is available on each lot if needed for grouping
                  lot.user_id = group.userId;
                  lot.firstName = group.firstName;
                  lot.lastName = group.lastName;
                  lot.bidder_no = group.bidderNo;
                  flattened.push(lot);
                });
              });
              return {records: flattened, totalRecords: flattened.length};
            })
          );
        } else if (isSellerGrouped) {
          return this.eventService.getGroupedBySellerLotsByAuctionId(event.auctionId).pipe(
            map(groupedData => {
              const flattened: Lot[] = [];
              groupedData.forEach(group => {
                group.lots.forEach(lot => {
                  lot.seller_id = group.userId;
                  lot.seller_name = group.firstName; // Assuming firstName holds seller name for now
                  flattened.push(lot);
                });
              });
              return {records: flattened, totalRecords: flattened.length};
            })
          );
        } else {
          // Both toggles off - return empty list as requested
          return of({records: [], totalRecords: 0});
        }
      })
    ).subscribe({
      next: (res: any) => {
        this.lots.set(res.records);
        this.totalRecords.set(res.totalRecords);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  onLazyLoad(event: any) {
    if (this.groupByBuyer() || this.groupBySeller()) {
      return; // No lazy loading when grouped
    }
    this.first.set(event.first);
    this.rows.set(event.rows);
    const id = this.eventId();
    if (id) {
      this.loadEventAndLots(id);
    }
  }

  toggleGroupByBuyer(value: boolean) {
    if (!value && !this.groupBySeller()) {
      // At least one must be selected
      return;
    }
    this.groupByBuyer.set(value);
    if (value) {
      this.groupBySeller.set(false);
    }
    this.first.set(0); // Reset to first page when toggling
    const id = this.eventId();
    if (id) {
      this.loadEventAndLots(id);
    }
  }

  toggleGroupBySeller(value: boolean) {
    if (!value && !this.groupByBuyer()) {
      // At least one must be selected
      return;
    }
    this.groupBySeller.set(value);
    if (value) {
      this.groupByBuyer.set(false);
    }
    this.first.set(0); // Reset to first page when toggling
    const id = this.eventId();
    if (id) {
      this.loadEventAndLots(id);
    }
  }

  createQuoteForBuyer(buyer: any) {
    console.log('Create Quote for Buyer', buyer);
  }

  createInvoiceForBuyer(buyer: any) {
    console.log('Create Invoice for Buyer', buyer);
  }

  createInvoiceForSeller(seller: any) {
    console.log('Create Invoice for Seller', seller);
  }

  createQuoteForSeller(seller: any) {
    console.log('Create Quote for Seller', seller);
  }

  showInvoice(lot: Lot) {
    console.log('Show Invoice', lot);
  }

  createQuote(lot: Lot) {
    console.log('Create Quote', lot);
  }
}
