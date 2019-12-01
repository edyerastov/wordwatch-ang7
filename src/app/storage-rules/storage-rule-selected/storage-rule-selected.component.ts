import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageRulesService } from '@app/storage-rules/services/storage-rules.service';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-storage-rule-selected',
  templateUrl: './storage-rule-selected.component.html',
  styleUrls: ['./storage-rule-selected.component.scss']
})
export class StorageRuleSelectedComponent implements OnInit {
  public isDefault = true;
  private roleId = '';

  constructor(private router: Router, private route: ActivatedRoute, private rulesService: StorageRulesService) {}

  ngOnInit() {
    this.roleId = this.route.snapshot.params['id'];
    this.rulesService
      .getRuleDetails(this.roleId)
      .pipe(
        tap((data: any) => {
          this.isDefault = data.isDefault;
        }),
        finalize(() => {})
      )
      .subscribe();
  }

  onSelect(prm: string): void {
    this.router.navigate([prm], { relativeTo: this.route, skipLocationChange: true });
  }
}
