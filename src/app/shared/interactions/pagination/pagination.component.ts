import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PaginationInfo } from '../../model/pagination-info.model';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() paginationInfo: PaginationInfo;
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  // To handle previous page click event
  onPreviousPageClick(): void {
    if (this.paginationInfo.pageNumber !== 0) {
      this.paginationInfo.pageNumber--;
      this.onChange.emit({ type: 'previous', data: this.paginationInfo });
    }
  }

  // To handle next page click event
  onNextPageClick(): void {
    if (this.paginationInfo.pageNumber !== this.paginationInfo.totalPages - 1) {
      this.paginationInfo.pageNumber++;
      this.onChange.emit({ type: 'next', data: this.paginationInfo });
    }
  }
}
