interface PaginationInfoProps {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalResults: number;
}

export class PaginationInfo {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalResults: number;

  constructor(props: PaginationInfoProps = {} as PaginationInfoProps) {
    ({
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      totalPages: this.totalPages,
      totalResults: this.totalResults
    } = props);
  }
}
