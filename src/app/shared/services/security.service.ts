import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class SecutiryService {
  constructor(private httpClient: HttpClient) {}

  public licenseDetails: any = null;

  // To get locense details roles
  getLicenseDetails() {
    const httpOptions = {
      headers: new HttpHeaders({ content: 'application/json', 'content-type': 'application/json;charset=UTF-8' }),
      responseType: 'text' as 'json'
    };

    const promise = this.httpClient
      .get('/licensing', httpOptions)
      .toPromise()
      .then(response => {
        this.licenseDetails = response;
        return response;
      });
    return promise;
  }
}
