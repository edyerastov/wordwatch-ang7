import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ShellComponent } from './shell.component';
import { HeaderComponent } from './header/header.component';
import { Shell } from '@app/shell/shell.service';
import { ShellRouting } from '@app/shell/shell-routing.module';

@NgModule({
  imports: [CommonModule, TranslateModule, NgbModule, RouterModule, ShellRouting],
  declarations: [HeaderComponent, ShellComponent],
  providers: [Shell]
})
export class ShellModule {}
