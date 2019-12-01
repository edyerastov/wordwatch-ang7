import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, tap } from 'rxjs/operators';
import { RetentionService } from '@app/retention-rules/services/retention.service';

@Component({
  selector: 'app-retention-selected',
  templateUrl: './retention-selected.component.html',
  styleUrls: ['./retention-selected.component.scss']
})
export class RetentionSelectedComponent implements OnInit {
  public isDefault = true;
  private ruleId = '';

  constructor(private router: Router, private route: ActivatedRoute, private retentionService: RetentionService) {}

  ngOnInit() {
    this.ruleId = this.route.snapshot.params['id'];
    this.retentionService
      .getRetentionDetails(this.ruleId)
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
