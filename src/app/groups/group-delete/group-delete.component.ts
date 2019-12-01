import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, finalize } from 'rxjs/operators';
import { GroupService } from '@app/groups/services/group.service';

@Component({
  selector: 'app-group-delete',
  templateUrl: './group-delete.component.html',
  styleUrls: ['./group-delete.component.scss']
})
export class GroupDeleteComponent implements OnInit, OnDestroy {
  public groupDetails: any = {};
  public routerSubscriber: any;
  public groupList: Array<any>;

  private groupId: string = '';

  constructor(private route: ActivatedRoute, private groupService: GroupService, public router: Router) {
    this.routerSubscriber = this.route.parent.params.subscribe(params => {
      this.groupId = params['id'];
      if (this.groupId !== undefined) {
        this.getGroupDetails();
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.routerSubscriber.unsubscribe();
  }

  getGroupDetails(): void {
    this.groupService
      .getGroupDetails({ id: this.groupId })
      .pipe(
        tap((data: any) => {
          this.groupDetails = data;
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  onGroupDelete(): void {
    if (this.groupDetails.id) {
      this.groupService
        .deleteGroup(this.groupDetails.id)
        .pipe(
          tap((data: any) => {
            this.groupService.sendUpdate({ state: true, deleted: true });
            this.router.navigate(['/groups'], { relativeTo: this.route, skipLocationChange: true });
          }),
          finalize(() => {})
        )
        .subscribe();
    }
  }

  onCancel(): void {
    this.router.navigate(['/groups/selected/' + this.groupDetails.id + '/details'], {
      replaceUrl: true,
      skipLocationChange: true
    });
  }
}
