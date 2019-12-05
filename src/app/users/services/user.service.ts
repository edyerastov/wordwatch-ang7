import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PAGE_SIZE } from '@app/shared/constant/constant';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class UserService {
  public changeState = new BehaviorSubject({ state: false });

  constructor(private httpClient: HttpClient) {}

  newUser(data: any) {
    return this.httpClient.post('/users', data, { responseType: 'text' });
  }

  getUsersByPrm(obj: any) {
    let url = `/users?pageSize=${obj.pageSize ? obj.pageSize : PAGE_SIZE.mainList}`;
    delete obj['pageSize'];
    for (let key in obj) {
      let value = obj[key];
      url = url + `&${key}=${value}`;
    }
    return this.httpClient.get(url, { responseType: 'text' });
  }

  // To get user details based on id
  getUserDetails(id: string) {
    return this.httpClient.get('/users/' + id);
  }

  // To get user devices based on id
  getUserDevices(id: string) {
    return this.httpClient.get('/users/' + id + '/devices', { responseType: 'text' });
  }

  // To update user details
  updateUserDetails(id: string, data: any) {
    return this.httpClient.put('/users/' + id, data, { responseType: 'text' });
  }

  activeUserDetails(id: string, data: string) {
    return this.httpClient.put('/users/' + id + '/' + data, {}, { responseType: 'text' });
  }

  updateUserRole(userId: string, roleId: string) {
    return this.httpClient.put('/users/' + userId + '/role/' + roleId, {}, { responseType: 'text' });
  }

  // To delete device by id
  deleteUserDevice(id: string) {
    return this.httpClient.delete('/devices/' + id + '/user', { responseType: 'text' });
  }

  putUserDevice(deviceId: string, userId: string) {
    return this.httpClient.put('/devices/' + deviceId + '/user/' + userId, {}, { responseType: 'text' });
  }

  sendUpdate(state: any) {
    this.changeState.next(state);
  }

  getUpdate(): Observable<any> {
    return this.changeState.asObservable();
  }
}
