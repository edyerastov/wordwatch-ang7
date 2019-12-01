import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, finalize, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GroupService } from '@app/groups/services/group.service';

@Component({
  selector: 'app-group-picker',
  templateUrl: './group-picker.component.html',
  styleUrls: ['./group-picker.component.scss']
})
export class GroupPickerComponent implements OnInit, OnChanges {
  @Input() groups: Array<any> = [];
  @Input() selected: Array<any> = [];
  @Input() options: any = null;
  @Input() group: FormGroup;
  @Output() onChangeGroups: EventEmitter<any> = new EventEmitter<any>();
  @Output() onClearGroups: EventEmitter<any> = new EventEmitter<any>();

  public groupList: Array<any> = [];
  public searchStr: string = '';
  public onInputSearch: Subject<string> = new Subject();

  public groupListBuffer: Array<any> = [];
  public loading = false;
  public page = 0;

  constructor(router: Router, route: ActivatedRoute, private groupService: GroupService) {
    this.onInputSearch.pipe(debounceTime(0)).subscribe(value => {
      this.groupListBuffer = [];
      this.getGroups({ query: this.searchStr, page: 0, _: 1558087664383 });
    });
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {}

  onGroupSelect(data: any): void {
    if (data !== undefined) {
      if (data && data.type === 'focus') {
        setTimeout(() => {
          this.getGroups({ query: this.searchStr, page: 0, _: 1558087664383 });
        }, 0);
      } else {
        if (data.name && data.id) {
          this.onChangeGroups.emit(data);
          this.searchStr = '';
        }
      }
    }
  }

  onGroupClear(event: any) {
    this.onClearGroups.emit('clear');
  }

  onScrollToEnd() {
    if (this.loading || this.groupList.length < 25) {
      return;
    }
    this.fetchMore();
  }

  fetchMore() {
    this.page++;
    this.loading = true;
    // using timeout here to simulate backend API delay
    setTimeout(() => {
      this.getGroups({ query: this.searchStr, page: this.page, _: 1558087664383 });
      this.loading = false;
    }, 400);
  }

  getGroups(obj: any): void {
    this.groupService
      .getGroupsByPrm(obj)
      .pipe(
        tap((data: any) => {
          this.groupList = data['_embedded']['collection'].map((item: any) => {
            return {
              id: item.id,
              name: item.name,
              type: item.type
            };
          });
          this.groupListBuffer = this.groupListBuffer.concat(this.groupList);
        }),
        finalize(() => {})
      )
      .subscribe();
  }
}
