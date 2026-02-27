import {Component, OnInit, inject, signal} from '@angular/core';
import {TableModule} from 'primeng/table';
import {Tag} from 'primeng/tag';
import {Header} from '@shared/components/header/header';
import {AppButton} from '@shared/components/app-button/app-button';
import {Drawer} from 'primeng/drawer';
import {EventForm} from '@pages/event-management/event-form/event-form';
import {NoData} from '@shared/components/no-data/no-data';
import {EventManagementService} from '@pages/event-management/event-management-service';
import {Event} from '@shared/interfaces/event.interface';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ToastModule} from 'primeng/toast';
import {DatePipe} from '@angular/common';
import {SearchInput} from '@shared/components/search-input/search-input';
import {Tooltip} from 'primeng/tooltip';

@Component({
  selector: 'app-event-management',
  imports: [
    TableModule,
    Tag,
    Header,
    AppButton,
    Drawer,
    EventForm,
    NoData,
    ConfirmDialogModule,
    ToastModule,
    DatePipe,
    SearchInput,
    Tooltip
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './event-management.html',
  styleUrl: './event-management.scss',
})
export class EventManagement implements OnInit {
  private eventService = inject(EventManagementService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  events = signal<Event[]>([]);
  loading = signal<boolean>(false);
  showEventForm = false;
  isEditMode = signal<boolean>(false);
  formData = signal<Record<string, any>>({});

  totalRecords = signal<number>(0);
  rows = signal<number>(10);
  first = signal<number>(0);
  searchQuery = signal<string>('');
  sortField = signal<string>('');
  sortOrder = signal<number>(1);

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.loading.set(true);
    const page = this.first() / this.rows();
    const sort = this.sortField() ? `${this.sortField()},${this.sortOrder() === 1 ? 'asc' : 'desc'}` : undefined;
    this.eventService.getAllEvents(page, this.rows(), this.searchQuery() || undefined, sort).subscribe({
      next: (res) => {
        this.events.set(res.records);
        this.totalRecords.set(res.totalRecords);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onLazyLoad(event: any) {
    this.first.set(event.first);
    this.rows.set(event.rows);
    if (event.sortField) {
      this.sortField.set(event.sortField);
      this.sortOrder.set(event.sortOrder);
    }
    this.loadEvents();
  }

  onSearch(query: string) {
    this.searchQuery.set(query);
    this.first.set(0);
    this.loadEvents();
  }

  createNewEvent() {
    this.formData.set({});
    this.isEditMode.set(false);
    this.showEventForm = true;
  }

  editEvent(event: Event) {
    this.formData.set({...event});
    this.isEditMode.set(true);
    this.showEventForm = true;
  }

  deleteEvent(event: Event) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete event "${event.name}"?`,
      header: 'Confirmation',
      closable: true,
      icon: 'fa fa-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary'
      },
      acceptButtonProps: {
        label: 'Yes, Delete',
        severity: 'danger'
      },
      accept: () => {
        this.eventService.deleteEvent(event.id).subscribe({
          next: () => {
            this.loadEvents();
            this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Event Deleted', life: 3000});
          },
          error: (err) => {
            if (err.status !== 403) {
              this.messageService.add({severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed to delete event'});
            }
          }
        });
      }
    });
  }

  onFormSubmit(model: any) {
    const action = this.isEditMode()
      ? this.eventService.updateEvent(model.id, model)
      : this.eventService.createEvent(model);

    action.subscribe({
      next: () => {
        this.loadEvents();
        this.showEventForm = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: this.isEditMode() ? 'Event Updated' : 'Event Created',
          life: 3000
        });
      },
      error: (err) => {
        if (err.status !== 403) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed to save event'});
        }
      }
    });
  }

  getStatusSeverity(status: string): 'success' | 'danger' | 'warn' | 'info' | 'secondary' {
    switch (status) {
      case 'Finalized': return 'success';
      case 'Processing': return 'warn';
      case 'Uploaded': return 'info';
      default: return 'secondary';
    }
  }
}
