import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '@app/groups/services/group.service';
import { debounceTime, finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.scss']
})
export class GroupEditComponent implements OnInit, OnDestroy {
  public groupEditForm: FormGroup;
  public groupList: Array<any>;
  public groupType: string;
  public onInputSearch: Subject<string> = new Subject();
  public searchStr: string = '';
  public groupId = '';

  private routerSubscriber: any;
  private groupDetailsForm: FormGroup;

  public userSelect2Options = {
    multiple: false,
    searchable: true,
    width: '100%',
    allowClear: 'true',
    value: '',
    searchOnFocus: true
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private groupService: GroupService
  ) {
    this.routerSubscriber = this.route.parent.params.subscribe(params => {
      this.groupId = params['id'];
      if (this.groupId !== undefined) {
        this.getGroupDetails({ id: this.groupId });
      }
    });

    this.onInputSearch.pipe(debounceTime(0)).subscribe(value => {
      this.getGroupDetails({ id: this.groupId, query: this.searchStr });
    });
  }

  ngOnInit() {
    this.groupEditForm = this.fb.group({
      user: null,
      userSearch: null,
      devices: null,
      deviceSearch: null,
      searchInput: null
    });
  }

  ngOnDestroy() {
    this.routerSubscriber.unsubscribe();
    if (
      this.router.url.includes('/roles/selected/') &&
      (this.router.url.includes('/edit') || this.router.url.includes('/delete'))
    ) {
      return;
    }
  }

  getGroupDetails(obj: any): void {
    this.groupService
      .getGroupDetails(obj)
      .pipe(
        tap((data: any) => {
          this.groupList = data['_embedded']['collection'];
          this.groupType = data.type;
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  onAddItem(user: any): void {
    this.groupService
      .editGroupAdd({ groupId: this.groupId, itemId: user.id })
      .pipe(
        tap((data: any) => {
          this.getGroupDetails({ id: this.groupId });
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  deleteItem(item: any, index: number) {
    this.groupList.splice(index, 1);
    this.groupService.editGroupDelete({ groupId: this.groupId, itemId: item.id }).subscribe();
  }
}
