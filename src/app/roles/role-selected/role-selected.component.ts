import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RoleService } from '@app/roles/services/role.service';

@Component({
  selector: 'app-role-selected',
  templateUrl: './role-selected.component.html',
  styleUrls: ['./role-selected.component.scss']
})
export class RoleSelectedComponent implements OnInit {
  roleId: string = '';

  constructor(private router: Router, private route: ActivatedRoute, private roleService: RoleService) {}

  ngOnInit() {
    this.roleId = this.route.snapshot.params['id'];
  }

  onClickOutside(e: Event) {
    this.roleService.setOutsideClick(this.roleId);
  }

  // To handle tab change event
  onSelect(prm: string): void {
    this.router.navigate([prm], { relativeTo: this.route, skipLocationChange: true });
  }
}
