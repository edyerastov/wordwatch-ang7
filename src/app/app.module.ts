import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '@env/environment';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { HTTPInterceptor } from './shared/interceptors/http.interceptor';
import { HomeModule } from './home/home.module';
import { ShellModule } from './shell/shell.module';
import { AboutModule } from './about/about.module';
import { LoginModule } from './login/login.module';
import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { RolesModule } from './roles/roles.module';
import { DeviceModule } from '@app/devices/device.module';
import { UserModule } from '@app/users/user.module';
import { GroupModule } from '@app/groups/group.module';
import { SecutiryService } from './shared/services/security.service';
import { StorageLocationsModule } from './storage-locations/locations.module';
import { StorageRulesModule } from './storage-rules/storage-rules.module';
import { RetentionRulesModule } from '@app/retention-rules/retention-rules.module';

export function security_app(secutiryService: SecutiryService) {
  return () => secutiryService.getLicenseDetails();
}

@NgModule({
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    NgbModule,
    CoreModule,
    SharedModule,
    ShellModule,
    HomeModule,
    AboutModule,
    LoginModule,
    RolesModule,
    StorageLocationsModule,
    StorageRulesModule,
    DeviceModule,
    UserModule,
    GroupModule,
    RetentionRulesModule,
    AppRoutingModule // must be imported as the last module as it contains the fallback route,
  ],
  declarations: [AppComponent],
  providers: [
    SecutiryService,
    { provide: APP_INITIALIZER, useFactory: security_app, deps: [SecutiryService], multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HTTPInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
