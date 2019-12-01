import { Component, Input, Output, EventEmitter } from '@angular/core';
import { tap, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { RetentionService } from '@app/retention-rules/services/retention.service';

@Component({
  selector: 'app-retention-picker',
  templateUrl: './retention-picker.component.html',
  styleUrls: ['./retention-picker.component.scss']
})
export class RetentionPickerComponent {
  @Input() options: any = null;
  @Input() group: FormGroup;
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onClear: EventEmitter<any> = new EventEmitter<any>();

  public data: Array<any> = [];
  public searchStr: string = '';
  public onInputSearch: Subject<string> = new Subject();

  public retentionListBuffer: Array<any> = [];
  public loading = false;
  public page = 0;

  constructor(private retentionService: RetentionService) {
    this.onInputSearch.pipe(debounceTime(0)).subscribe(value => {
      this.retentionListBuffer = [];
      this.getRetentionsName({ query: this.searchStr, page: 0, _: 1558087664383 });
    });
  }

  // On item select from dropdown
  onItemSelect(data: any): void {
    if (data !== undefined) {
      if (data && data.type === 'focus') {
        this.getRetentionsName({ query: this.searchStr, page: 0, _: 1558087664383 });
      } else {
        if (data.label && data.id) {
          // this.shellService.changeState(false);
          this.onChange.emit(data);
          this.searchStr = '';
        }
      }
    }
  }

  // To handle clear event
  onItemClear() {
    this.onClear.emit('clear');
  }

  onScrollToEnd() {
    if (this.loading || this.data.length < 25) {
      this.page = 0;
      return;
    }
    this.fetchMore();
  }

  fetchMore() {
    this.page++;
    this.loading = true;
    // using timeout here to simulate backend API delay
    setTimeout(() => {
      this.getRetentionsName({ query: this.searchStr, page: this.page, _: 1558087664383 });
      this.loading = false;
    }, 0);
  }

  // Get and set role name list
  getRetentionsName(obj: any): void {
    this.retentionService
      .getRetentionsByPrm(obj)
      .pipe(
        tap((data: any) => {
          this.data = data['_embedded']['collection'].map((item: any) => {
            return {
              id: item.id,
              label: item.name
            };
          });
          this.retentionListBuffer = this.retentionListBuffer.concat(this.data);
        }),
        finalize(() => {})
      )
      .subscribe();
  }
}
