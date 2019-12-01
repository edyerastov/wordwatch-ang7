import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Shell } from '@app/shell/shell.service';
import { Subscription } from 'rxjs';
import { GroupService } from '@app/groups/services/group.service';

@Component({
  selector: 'app-group-new',
  templateUrl: './group-new.component.html',
  styleUrls: ['./group-new.component.scss']
})
export class GroupNewComponent implements OnInit {
  public groupNewForm: FormGroup;
  public showCancelConfirmation: Boolean = false;
  public subscription: Subscription;
  public groupDetails: any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private groupService: GroupService,
    public shellService: Shell
  ) {
    this.subscription = this.shellService.getConfirmation().subscribe(message => {
      this.showCancelConfirmation = message;
    });
  }

  ngOnInit() {
    this.groupNewForm = this.fb.group({
      groupName: [null, [Validators.maxLength(32), Validators.required]],
      groupType: null
    });
  }

  onGroupCreate() {
    this.groupDetails = {
      name: this.groupNewForm.value.groupName,
      type: this.groupNewForm.value.groupType
    };

    this.groupService.newGroup(this.groupDetails).subscribe((data: any) => {
      this.router.navigateByUrl('/groups');
    });
  }

  confirm() {
    if (this.shellService.isPrevRoute) {
      this.router.navigate([this.shellService.getRoute()], { replaceUrl: true });
    } else {
      this.router.navigateByUrl('/groups');
    }
    this.shellService.setConfirmation(false, '/home');
  }

  onCancel() {
    if (this.router.url === '/newGroup') {
      if (this.groupNewForm.value.groupName !== null || this.groupNewForm.value.groupType !== null) {
        this.shellService.changeState(false);
        this.showCancelConfirmation = true;
      } else {
        this.router.navigateByUrl('/groups');
      }
    }
  }
}
