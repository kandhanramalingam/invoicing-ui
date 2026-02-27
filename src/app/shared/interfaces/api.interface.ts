export interface ResponseDto<T> {
  data: T;
  message: string;
}

export interface PaginatedDetailsDto<T> {
  page: number;
  perPage: number;
  totalPages: number;
  totalRecords: number;
  records: T[];
}
