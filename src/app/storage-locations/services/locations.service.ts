import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PAGE_SIZE } from '@app/shared/constant/constant';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class LocationsService {
  public changeState = new BehaviorSubject({ state: false });

  constructor(private httpClient: HttpClient) {}

  getLocationsByPrm(obj: any) {
    let url = `/locations?pageSize=${obj.pageSize ? obj.pageSize : PAGE_SIZE.mainList}`;
    delete obj['pageSize'];

    for (let key in obj) {
      let value = obj[key];
      url = url + `&${key}=${value}`;
    }

    return this.httpClient.get(url);
  }

  updateLocationDetails(id: string, data: any) {
    return this.httpClient.put('/locations/' + id, data);
  }

  newLocation(data: any) {
    return this.httpClient.post('/locations', data);
  }

  getLocationDetails(id: string) {
    return this.httpClient.get('/locations/' + id);
  }

  sendUpdate(state: any) {
    this.changeState.next(state);
  }

  getUpdate(): Observable<any> {
    return this.changeState.asObservable();
  }
}
