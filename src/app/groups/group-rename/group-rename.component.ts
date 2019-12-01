import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupService } from '@app/groups/services/group.service';
import { Subscription } from 'rxjs';
import { Shell } from '@app/shell/shell.service';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-group-rename',
  templateUrl: './group-rename.component.html',
  styleUrls: ['./group-rename.component.scss']
})
export class GroupRenameComponent implements OnInit, OnDestroy, DoCheck {
  public showCancelConfirmation = false;
  public subscription: Subscription;

  public renameGroupForm: FormGroup;
  public groupName: string;
  public defaultGroupName = '';
  public formValid: boolean = true;
  private groupId = '';
  private routerSubscriber: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private groupService: GroupService,
    private shellService: Shell
  ) {
    this.routerSubscriber = this.route.parent.params.subscribe(params => {
      this.groupId = params['id'];
      this.groupName = '';
      if (this.groupId !== undefined) {
        this.getGroupName();
      }
      this.subscription = this.shellService.getConfirmation().subscribe(message => {
        this.showCancelConfirmation = message;
      });
    });
  }

  ngOnInit() {
    this.renameGroupForm = this.fb.group({
      groupName: [null, [Validators.required]]
    });

    this.getGroupName();

    setTimeout(() => {
      this.defaultGroupName = this.renameGroupForm.value.groupName;
    }, 300);
  }

  ngDoCheck(): void {
    if (this.defaultGroupName !== this.renameGroupForm.value.groupName) {
      this.formValid = false;
    } else if (this.defaultGroupName === this.renameGroupForm.value.groupName) {
      this.formValid = true;
    }
  }

  ngOnDestroy() {
    this.routerSubscriber.unsubscribe();
    if (this.router.url.includes('/groups/selected/') && this.router.url.includes('/rename')) {
      return;
    }
  }

  getGroupName(): void {
    this.groupService
      .getGroupDetails({ id: this.groupId })
      .pipe(
        tap((data: any) => {
          this.groupName = data.name;
          this.renameGroupForm.controls.groupName.setValue(data.name);
          if (this.defaultGroupName === null) {
            this.defaultGroupName = this.groupName;
          }
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  onGroupUpdate() {
    this.groupName = this.renameGroupForm.value.groupName;

    this.groupService.updateGroupDetails(this.groupId, { name: this.groupName }).subscribe((data: any) => {
      this.groupService.sendUpdate({ state: true, name: this.groupName });
      this.router.navigate(['/groups/selected/' + this.groupId + '/details'], {
        replaceUrl: true,
        skipLocationChange: true
      });
    });
  }

  onCancel() {
    if (this.router.url === `/groups/selected/${this.groupId}/rename`) {
      console.log(this.groupName + ' + ' + this.defaultGroupName);
      if (this.groupName === this.defaultGroupName) {
        this.router.navigate(['../details'], { relativeTo: this.route, skipLocationChange: true });
        return;
      } else {
        this.shellService.changeState(false);
        this.showCancelConfirmation = true;
        return false;
      }
    }
  }

  back() {
    this.shellService.changeState(true);
    this.router.navigate(['../details'], { relativeTo: this.route, skipLocationChange: true });
  }
}
