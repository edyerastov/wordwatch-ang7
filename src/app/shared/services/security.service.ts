import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class SecutiryService {
  constructor(private httpClient: HttpClient) {}

  public licenseDetails: any = null;

  // To get locense details roles
  getLicenseDetails() {
    const promise = this.httpClient
      .get('/licensing')
      .toPromise()
      .then(response => {
        this.licenseDetails = response;
        return response;
      });
    return promise;
  }
}
