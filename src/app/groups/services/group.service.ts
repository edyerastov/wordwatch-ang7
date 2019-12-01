import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PAGE_SIZE } from '@app/shared/constant/constant';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class GroupService {
  public changeState = new BehaviorSubject({ state: false });

  constructor(private httpClient: HttpClient) {}

  getGroups() {
    return this.httpClient.get(`/groups?pageSize=${PAGE_SIZE.mainList}`);
  }

  getGroupsByPrm(obj: any) {
    let url = `/groups?pageSize=${obj.pageSize ? obj.pageSize : PAGE_SIZE.mainList}`;
    delete obj['pageSize'];
    for (let key in obj) {
      let value = obj[key];
      url = url + `&${key}=${value}`;
    }
    console.log(url);
    return this.httpClient.get(url);
  }

  getGroupDetails(obj: any) {
    let url = `/groups/${obj.id}/?pageSize=${obj.pageSize ? obj.pageSize : 10}`;
    delete obj['pageSize'];
    for (let key in obj) {
      let value = obj[key];
      url = url + `&${key}=${value}`;
    }
    return this.httpClient.get(url);
  }

  updateGroupDetails(id: string, data: any) {
    return this.httpClient.put('/groups/' + id, data);
  }

  newGroup(data: any) {
    return this.httpClient.post('/groups', data);
  }

  editGroupAdd(obj: { groupId: string; itemId: string }) {
    return this.httpClient.put('/groups/' + obj.groupId + '/' + obj.itemId, {});
  }

  editGroupDelete(obj: { groupId: string; itemId: string }) {
    return this.httpClient.delete('/groups/' + obj.groupId + '/' + obj.itemId, {});
  }

  deleteGroup(id: string) {
    return this.httpClient.delete('/groups/' + id);
  }

  sendUpdate(state: any) {
    this.changeState.next(state);
  }

  getUpdate(): Observable<any> {
    return this.changeState.asObservable();
  }
}
