import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { PaginationInfo } from '../../model/pagination-info.model';

@Component({
  selector: 'app-page-size-picker',
  templateUrl: './page-size-picker.component.html',
  styleUrls: ['./page-size-picker.component.scss']
})
export class PageSizePickerComponent implements OnInit {
  @Input() paginationInfo: PaginationInfo;
  @Input() options: Array<number>;
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  // To handle option select event
  onOptionSelect(option: number) {
    this.paginationInfo.pageSize = option;
    this.onChange.emit(this.paginationInfo);
  }
}
