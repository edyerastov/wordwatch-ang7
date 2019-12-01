import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, finalize, tap } from 'rxjs/operators';
import { GroupService } from '@app/groups/services/group.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss']
})
export class GroupDetailsComponent implements OnInit, OnDestroy {
  public groupList: Array<any>;
  public groupType: string;
  public onInputSearch: Subject<string> = new Subject();
  public searchStr: string = '';
  public groupId = '';

  private routerSubscriber: any;
  private groupDetailsForm: FormGroup;

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
    this.groupDetailsForm = this.fb.group({
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
}
