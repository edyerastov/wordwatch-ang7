import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, map, tap } from 'rxjs/operators';
import { PAGE_SIZE, BASE_URL } from '@app/shared/constant/constant';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable()
export class DeviceService {
  public list = new Subject();
  public changeState = new BehaviorSubject({ state: false });

  constructor(private httpClient: HttpClient) {}

  getDevices() {
    return this.httpClient.get(`/devices?pageSize=${PAGE_SIZE.mainList}`);
  }

  getDevicesByPrm(obj: any) {
    let url = `/devices?pageSize=${obj.pageSize ? obj.pageSize : PAGE_SIZE.mainList}`;
    delete obj['pageSize'];
    for (let key in obj) {
      let value = obj[key];
      url = url + `&${key}=${value}`;
    }
    console.log(url);
    return this.httpClient.get(url);
  }

  // To get user details based on id
  getDeviceDetails(id: string) {
    return this.httpClient.get('/devices/' + id);
  }

  updateDeviceDetails(id: string, data: any) {
    return this.httpClient.put('/devices/' + id, data);
  }

  newDevice(data: any) {
    return this.httpClient.post('/devices', data);
  }

  addUser(deviceId: string, userId: string) {
    return this.httpClient.put('/devices/' + deviceId + '/user/' + userId, {});
  }

  deleteDevice(id: string) {
    return this.httpClient.delete('/devices/' + id);
  }

  sendUpdate(state: any) {
    this.changeState.next(state);
  }

  getUpdate(): Observable<any> {
    return this.changeState.asObservable();
  }
}
