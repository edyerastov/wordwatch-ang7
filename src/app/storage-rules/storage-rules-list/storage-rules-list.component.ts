import * as FileSaver from 'file-saver';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { tap, finalize } from 'rxjs/operators';
import { PaginationInfo } from '@app/shared/model/pagination-info.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { StorageRulesService } from '../services/storage-rules.service';
import {
  IStorageRule,
  IStorageRulesRequestConfig,
  ITableHeader,
  STORAGE_RULES_TABLE_HEADERS
} from '../storage-rules.model';

@Component({
  selector: 'app-storage-rules-list',
  templateUrl: './storage-rules-list.component.html',
  styleUrls: ['./storage-rules-list.component.scss']
})
export class StorageRulesListComponent implements OnInit, OnDestroy {
  public storageRulesListForm: FormGroup;
  public subscription: Subscription;
  public list = new BehaviorSubject({ selected: null });
  public storageRulesList: IStorageRule[];
  public paginationInfo = new PaginationInfo();
  public selectedStorageRule: IStorageRule = {};
  public storageRuleItemSelected: any = null;
  public tableHeaders = STORAGE_RULES_TABLE_HEADERS;
  private reverseList = false;

  constructor(private router: Router, private storageRulesService: StorageRulesService, private fb: FormBuilder) {
    this.subscription = storageRulesService.getUpdate().subscribe(state => {
      if (state) {
        if (state.deleted !== undefined) {
          this.getRulesByPrm(this.getFilteredObj());
        }
        if (state.active !== undefined) {
          this.storageRuleItemSelected.active = state.active;
        }
        if (state.name !== undefined) {
          this.storageRuleItemSelected.name = state.name;
        }
      }
    });
  }

  ngOnInit() {
    this.storageRulesListForm = this.fb.group({
      storageRules: null,
      storageRuleSearch: null,
      storageRuleStatus: null
    });

    this.getRulesByPrm(this.getFilteredObj());

    this.list.subscribe(x => {
      if (x.selected === null) {
        this.storageRuleItemSelected = null;
      } else {
        this.storageRuleItemSelected = this.list.getValue();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getRulesByPrm(obj: any): void {
    this.storageRulesService
      .getRulesByPrm(obj)
      .pipe(
        tap((data: any) => {
          this.storageRulesList = data['_embedded']['collection'];
          this.paginationInfo = (({ pageNumber, pageSize, totalPages, totalResults }) => ({
            pageNumber,
            pageSize,
            totalPages,
            totalResults
          }))(data);
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  getFilteredObj(): IStorageRulesRequestConfig {
    setTimeout(() => {
      this.storageRuleItemSelected = null;
    }, 0);
    const obj: any = {};
    obj.orderBy = 'Name';
    obj.ascending = this.reverseList === false;
    if (this.selectedStorageRule.active !== undefined) {
      obj.storageRuleStatus = this.selectedStorageRule.active;
    }
    if (this.selectedStorageRule.id) {
      obj.storageRuleId = this.selectedStorageRule.id;
    }
    if (this.paginationInfo.pageNumber) {
      obj.page = this.paginationInfo.pageNumber;
    }
    if (this.paginationInfo.pageSize) {
      obj.pageSize = this.paginationInfo.pageSize;
    }
    return obj;
  }

  add() {
    this.router.navigate(['/newStorageRule'], { replaceUrl: true });
  }

  downloadCsv() {
    FileSaver.saveAs('/api/storagerules.csv', 'storagerules.csv');
  }

  clear() {
    setTimeout(() => {
      this.storageRuleItemSelected = null;
    }, 0);
    this.tableHeaders.forEach(item => {
      item.sort = false;
    });
    this.storageRulesListForm.controls.storageRuleSearch.reset();
    this.storageRulesListForm.controls.storageRuleStatus.reset();
    this.storageRulesListForm.controls.storageRules.reset();
    this.onStorageRulePickerClear();
  }

  onStorageRulePickerClear(): void {
    this.paginationInfo.pageNumber = 0;
    this.selectedStorageRule = {};

    this.getRulesByPrm(this.getFilteredObj());
  }

  onstorageRuleStatusSelect(isActive: boolean): void {
    setTimeout(() => {
      this.storageRuleItemSelected = null;
    }, 0);
    this.paginationInfo.pageNumber = 0;
    this.selectedStorageRule.active = isActive;
    this.getRulesByPrm(this.getFilteredObj());
  }

  onStorageRuleSelect(id: string): void {
    setTimeout(() => {
      this.storageRuleItemSelected = null;
    }, 0);
    this.paginationInfo.pageNumber = 0;
    this.selectedStorageRule.id = id;
    this.getRulesByPrm(this.getFilteredObj());
  }

  onSearch() {
    setTimeout(() => {
      this.storageRuleItemSelected = null;
    }, 0);

    this.getRulesByPrm(this.getFilteredObj());
  }

  invertStorageRulesList(header: ITableHeader) {
    if (header.sort === false) {
      header.sort = true;
      this.tableHeaders.forEach(item => {
        if (item.orderBy !== header.orderBy) {
          item.sort = false;
        }
      });
    }
    header.reverseList = !header.reverseList;
    this.getRulesByPrm({ orderBy: header.orderBy, ascending: !header.reverseList });
  }

  onRowSelect(item: any) {
    if (this.storageRuleItemSelected === item) {
      setTimeout(() => {
        this.storageRuleItemSelected = null;
      }, 0);
    } else {
      this.storageRuleItemSelected = null;

      setTimeout(() => {
        this.list.next(item);
        this.router.navigate(['/storage/selected/' + item.id + '/details'], {
          replaceUrl: true,
          skipLocationChange: true
        });
      }, 0);
    }
  }

  onPageChange(data: any): void {
    if (data.type === 'next') {
      this.paginationInfo.pageNumber = data.data.pageNumber;
    } else if (data.type === 'previous') {
      this.paginationInfo.pageNumber = data.data.pageNumber;
    }

    this.getRulesByPrm(this.getFilteredObj());
  }

  onPageSizeSelect(data: any): void {
    this.paginationInfo.pageNumber = 0;
    this.paginationInfo.pageSize = data.pageSize;

    this.getRulesByPrm(this.getFilteredObj());
  }
}
