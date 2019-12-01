import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { tap, finalize } from 'rxjs/operators';
import { GroupService } from '@app/groups/services/group.service';
import { PaginationInfo } from '@app/shared/model/pagination-info.model';
import * as FileSaver from 'file-saver';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-groups-list',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.scss'],
  styles: [
    `
      .angle-hided {
        display: none;
      }
    `
  ]
})
export class GroupsListComponent implements OnInit, OnDestroy {
  showSearchPanel: Boolean;

  public list = new BehaviorSubject({ selected: null });

  public groupListForm: FormGroup;
  public selectedGroup: any = {};
  public selectedRowId: string;
  public type: string = '';
  public groupList: Array<any> = [];
  public reverseGroupList: boolean = false;
  public sort: boolean = false;
  public groupItemSelected: any = null;
  public groupName: string;

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
  public profileSelect2Options = {
    multiple: false,
    closeOnSelect: true,
    width: '100%',
    minimumResultsForSearch: -1,
    placeholder: 'Any'
  };
  public paginationInfo = new PaginationInfo();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private groupService: GroupService
  ) {
    this.subscription = groupService.getUpdate().subscribe(group => {
      if (group) {
        if (group.deleted) {
          this.getGroupsByPrm(this.getFilteredObj());
        }
        if (group.name !== undefined) {
          this.groupItemSelected.name = group.name;
        }
        if (group.type !== undefined) {
          this.groupItemSelected.type = group.type;
        }
      }
    });
  }

  ngOnInit() {
    this.groupListForm = this.fb.group({
      groups: null,
      groupSearch: null,
      groupType: null
    });

    this.getGroupsByPrm(this.getFilteredObj());

    this.list.subscribe(x => {
      if (x.selected === null) {
        this.groupItemSelected = null;
      } else {
        this.groupItemSelected = this.list.getValue();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  clear(event: any) {
    setTimeout(() => {
      this.groupItemSelected = null;
    }, 0);
    this.groupListForm.controls.groupSearch.reset();
    this.groupListForm.controls.groupType.reset();
    this.onGroupNameClear(event);
    this.groupListForm.controls.groups.reset();
  }

  add() {
    this.router.navigate(['/newGroup'], { replaceUrl: true });
  }

  // TO handle row click event
  onRowSelect(item: any) {
    this.selectedRowId = item.id;
    if (this.groupItemSelected === item) {
      setTimeout(() => {
        this.groupItemSelected = null;
      }, 0);
    } else {
      this.groupItemSelected = null;
      setTimeout(() => {
        this.list.next(item);
        this.router.navigate(['/groups/selected/' + item.id + '/details'], {
          replaceUrl: true,
          skipLocationChange: true
        });
      }, 0);
    }
  }

  onSearch() {
    setTimeout(() => {
      this.groupItemSelected = null;
    }, 0);
    if (this.selectedGroup) {
      this.onGroupNameChange(this.selectedGroup);
    }
    if (this.type) {
      this.onTypeSelect(this.type);
    }
  }

  // To handle name selection change event
  onGroupNameChange(obj: any): void {
    setTimeout(() => {
      this.groupItemSelected = null;
    }, 0);
    this.paginationInfo.pageNumber = 0;
    this.selectedGroup = obj;
    this.getGroupsByPrm(this.getFilteredObj());
  }

  // To handle clear role name event
  onGroupNameClear(obj: any): void {
    this.paginationInfo.pageNumber = 0;
    this.selectedGroup = {};
    this.getGroupsByPrm(this.getFilteredObj());
  }

  // To handle profile selection change event
  onTypeSelect(obj: any): void {
    setTimeout(() => {
      this.groupItemSelected = null;
    }, 0);
    this.getGroupsByPrm(this.getFilteredObj());
  }

  // To get roles list based on prm
  getGroupsByPrm(obj: any): void {
    this.groupService
      .getGroupsByPrm(obj)
      .pipe(
        tap((data: any) => {
          this.groupList = data['_embedded']['collection'];
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
    this.getGroupsByPrm(this.getFilteredObj());
  }

  // To handle page number change event
  onPageSizeSelect(data: any): void {
    this.paginationInfo.pageNumber = 0;
    this.paginationInfo.pageSize = data.pageSize;
    this.getGroupsByPrm(this.getFilteredObj());
  }

  // To set filtered object data
  getFilteredObj(): Object {
    setTimeout(() => {
      this.groupItemSelected = null;
    }, 0);
    const obj: any = {};
    if (this.groupListForm.controls.groupType.value !== null) {
      obj.groupType = this.groupListForm.value.groupType;
    }
    obj.ascending = this.reverseGroupList === false;
    obj.orderBy = 'Name';
    if (this.selectedGroup.id) {
      obj.groupId = this.selectedGroup.id;
    }
    if (this.paginationInfo.pageNumber) {
      obj.page = this.paginationInfo.pageNumber;
    }
    if (this.paginationInfo.pageSize) {
      obj.pageSize = this.paginationInfo.pageSize;
    }
    return obj;
  }

  invertGroupList() {
    if (this.sort === false) {
      this.sort = true;
      return;
    }
    this.reverseGroupList = !this.reverseGroupList;
    this.getGroupsByPrm(this.getFilteredObj());
  }

  downloadCsv() {
    FileSaver.saveAs('/api/groups.csv', 'groups.csv');
  }
}
