import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { tap, finalize } from 'rxjs/operators';
import { PaginationInfo } from '@app/shared/model/pagination-info.model';
import * as FileSaver from 'file-saver';
import { BehaviorSubject, Subscription } from 'rxjs';
import { RetentionService } from '@app/retention-rules/services/retention.service';

@Component({
  selector: 'app-retention-list',
  templateUrl: './retention-list.component.html',
  styleUrls: ['./retention-list.component.scss'],
  styles: [
    `
      .angle-hided {
        display: none;
      }
    `
  ]
})
export class RetentionListComponent implements OnInit, OnDestroy {
  public list = new BehaviorSubject({ selected: null });

  public retentionListForm: FormGroup;
  public selectedRetention: any = {};
  public selectedRowId: string;
  public type = '';
  public retentionList: Array<any> = [];
  public reverseRetentionList = false;
  public sort = false;
  public retentionItemSelected: any = null;
  public retentionName: string;

  public subscription: Subscription;
  public nameSelect2Options = {
    multiple: false,
    searchable: true,
    width: '100%',
    placeholder: 'Name',
    allowClear: 'true',
    value: '',
    searchOnFocus: true
  };
  public paginationInfo = new PaginationInfo();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private retentionService: RetentionService
  ) {
    this.subscription = retentionService.getUpdate().subscribe(retention => {
      if (retention) {
        if (retention.name !== undefined) {
          this.retentionItemSelected.name = retention.name;
        }
        if (retention.deleted !== undefined) {
          this.getRetentionsByPrm(this.getFilteredObj());
        }
        if (retention.days !== undefined) {
          this.retentionItemSelected.days = retention.days;
        }
        if (retention.active !== undefined) {
          this.retentionItemSelected.active = retention.active;
        }
      }
    });
  }

  ngOnInit() {
    this.retentionListForm = this.fb.group({
      retention: null,
      retentionSearch: null,
      retentionStatus: null
    });

    this.getRetentionsByPrm(this.getFilteredObj());

    this.list.subscribe(x => {
      if (x.selected === null) {
        this.retentionItemSelected = null;
      } else {
        this.retentionItemSelected = this.list.getValue();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  clear(event: any) {
    setTimeout(() => {
      this.retentionItemSelected = null;
    }, 0);
    this.retentionListForm.controls.retentionSearch.reset();
    this.retentionListForm.controls.retentionStatus.reset();
    this.retentionListForm.controls.retention.reset();
    this.onRetentionNameClear();
  }

  add() {
    this.router.navigate(['/newRetentionRule'], { replaceUrl: true });
  }

  // TO handle row click event
  onRowSelect(item: any) {
    this.selectedRowId = item.id;
    if (this.retentionItemSelected === item) {
      setTimeout(() => {
        this.retentionItemSelected = null;
      }, 0);
    } else {
      this.retentionItemSelected = null;
      setTimeout(() => {
        this.list.next(item);
        this.router.navigate(['/retention/selected/' + item.id + '/details'], {
          replaceUrl: true,
          skipLocationChange: true
        });
      }, 0);
    }
  }

  onSearch() {
    setTimeout(() => {
      this.retentionItemSelected = null;
    }, 0);
    if (this.selectedRetention) {
      this.onRetentionNameChange(this.selectedRetention);
    }
    if (this.type) {
      this.onStatusSelect(this.type);
    }
  }

  // To handle name selection change event
  onRetentionNameChange(obj: any): void {
    setTimeout(() => {
      this.retentionItemSelected = null;
    }, 0);
    this.paginationInfo.pageNumber = 0;
    this.selectedRetention = obj;
    this.getRetentionsByPrm(this.getFilteredObj());
  }

  // To handle clear role name event
  onRetentionNameClear(): void {
    this.paginationInfo.pageNumber = 0;
    this.selectedRetention = {};
    this.getRetentionsByPrm(this.getFilteredObj());
  }

  // To handle profile selection change event
  onStatusSelect(obj: any): void {
    setTimeout(() => {
      this.retentionItemSelected = null;
    }, 0);
    this.getRetentionsByPrm(this.getFilteredObj());
  }

  // To get roles list based on prm
  getRetentionsByPrm(obj: any): void {
    this.retentionService
      .getRetentionsByPrm(obj)
      .pipe(
        tap((data: any) => {
          this.retentionList = data['_embedded']['collection'];
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

  // To handle pagination page change event(next and previous)
  onPageChange(data: any): void {
    if (data.type === 'next') {
      this.paginationInfo.pageNumber = data.data.pageNumber;
    } else if (data.type === 'previous') {
      this.paginationInfo.pageNumber = data.data.pageNumber;
    }
    this.getRetentionsByPrm(this.getFilteredObj());
  }

  // To handle page number change event
  onPageSizeSelect(data: any): void {
    this.paginationInfo.pageNumber = 0;
    this.paginationInfo.pageSize = data.pageSize;
    this.getRetentionsByPrm(this.getFilteredObj());
  }

  // To set filtered object data
  getFilteredObj(): Object {
    setTimeout(() => {
      this.retentionItemSelected = null;
    }, 0);
    const obj: any = {};
    if (this.retentionListForm.controls.retentionStatus.value !== null) {
      obj.ruleStatus = this.retentionListForm.value.retentionStatus;
    }
    if (this.selectedRetention.id) {
      obj.ruleId = this.selectedRetention.id;
    }
    if (this.paginationInfo.pageNumber) {
      obj.page = this.paginationInfo.pageNumber;
    }
    if (this.paginationInfo.pageSize) {
      obj.pageSize = this.paginationInfo.pageSize;
    }
    return obj;
  }

  invertRetentionList() {
    if (this.sort === false) {
      this.sort = true;
      return;
    }
    this.reverseRetentionList = !this.reverseRetentionList;
    this.getRetentionsByPrm(this.getFilteredObj());
  }

  downloadCsv() {
    FileSaver.saveAs('/api/retentionrules.csv', 'retentionrules.csv');
  }
}
