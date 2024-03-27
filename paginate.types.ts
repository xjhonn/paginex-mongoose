import mongoose from 'mongoose';

export interface PaginateOptions {
  query?: object;
  options?: {
    page?: number;
    pageSize?: number;
    additionalAggregations?: any[];
  };
}

export interface PaginateResult<T> {
  docs: T[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  page: number;
  pageSize: number;
  totalDocs: number;
  totalPages: number;
}

export interface PaginateModel<T extends mongoose.Document> extends mongoose.Model<T> {
  paginateCollection(opts: PaginateOptions): Promise<PaginateResult<T>>;
}