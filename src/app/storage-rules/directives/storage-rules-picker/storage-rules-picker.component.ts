import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IStorageRule } from '@app/storage-rules/storage-rules.model';
import { Subject } from 'rxjs';
import { StorageRulesService } from '@app/storage-rules/services/storage-rules.service';
import { debounceTime, tap, finalize } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-storage-rules-picker',
  templateUrl: './storage-rules-picker.component.html',
  styleUrls: ['./storage-rules-picker.component.scss']
})
export class StorageRulesPickerComponent implements OnInit {
  @Input() storageRules: IStorageRule[];
  @Input() group: FormGroup;
  @Output() changeStorageRuleName: EventEmitter<any> = new EventEmitter<any>();
  @Output() clearStorageRuleName: EventEmitter<any> = new EventEmitter<any>();

  public storageRulesList: IStorageRule[] = [];
  public storageRulesListBuffer: IStorageRule[] = [];
  public searchStr = '';
  public onInputSearch: Subject<string> = new Subject();
  public loading = false;
  public page = 0;

  constructor(private storageRulesService: StorageRulesService) {}

  ngOnInit(): void {
    this.onInputSearch.pipe(debounceTime(0)).subscribe(() => {
      this.storageRulesListBuffer = [];
      this.getStorageRules({ query: this.searchStr, page: 0, _: 1558087664383 });
    });
  }

  onStorageRuleSelect(data: any): void {
    if (data !== undefined) {
      if (data && data.type === 'focus') {
        setTimeout(() => {
          this.storageRulesListBuffer = [];
          this.getStorageRules({ query: this.searchStr, page: 0, _: 1558087664383 });
        }, 0);
      } else {
        if (data.id) {
          this.changeStorageRuleName.emit(data.id);
          this.searchStr = '';
        }
      }
    }
  }

  onStorageRuleClear() {
    this.clearStorageRuleName.emit();
  }

  onScrollToEnd() {
    if (this.loading || this.storageRulesList.length < 25) {
      return;
    }

    this.page++;
    this.getStorageRules({ query: this.searchStr, page: this.page, _: 1558087664383 });
  }

  getStorageRules(obj: any): void {
    this.loading = true;
    this.storageRulesService
      .getRulesByPrm(obj)
      .pipe(
        tap((data: any) => {
          this.storageRulesList = data['_embedded']['collection'].map((item: IStorageRule) => {
            return {
              id: item.id,
              name: item.name
            };
          });
          this.storageRulesListBuffer = this.storageRulesListBuffer.concat(this.storageRulesList);
          this.loading = false;
        }),
        finalize(() => {})
      )
      .subscribe();
  }
}
