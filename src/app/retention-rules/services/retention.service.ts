import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PAGE_SIZE } from '@app/shared/constant/constant';
import { BehaviorSubject, Observable } from 'rxjs';
import { IStorageRule, IToPutUpdatedData } from '@app/storage-rules/storage-rules.model';

@Injectable()
export class RetentionService {
  public changeState = new BehaviorSubject({ state: false });

  constructor(private httpClient: HttpClient) {}

  getRetentionsByPrm(obj: any) {
    let url = `/retentionrules?pageSize=${obj.pageSize ? obj.pageSize : PAGE_SIZE.mainList}`;
    delete obj['pageSize'];
    for (let key in obj) {
      let value = obj[key];
      url = url + `&${key}=${value}`;
    }
    console.log(url);
    return this.httpClient.get(url);
  }

  getRetentionDetails(id: any) {
    return this.httpClient.get('/retentionrules/' + id);
  }

  updateRetentionDetails(id: string, data: any) {
    return this.httpClient.put('/retentionrules/' + id, data);
  }

  newRetention(data: any) {
    return this.httpClient.post('/retentionrules', data);
  }

  deleteRetention(id: string) {
    return this.httpClient.delete('/retentionrules/' + id);
  }

  generateToPutData(storageRuleDetails: IStorageRule): IToPutUpdatedData {
    const data = JSON.parse(JSON.stringify(storageRuleDetails));
    data.targets = {};
    data.targets.users = data._embedded.targets._embedded.users.map((item: { id: any }) => item.id);
    data.targets.devices = data._embedded.targets._embedded.devices.map((item: { id: any }) => item.id);
    data.targets.groups = data._embedded.targets._embedded.groups.map((item: { id: any }) => item.id);
    delete data._embedded;
    return data;
  }

  sendUpdate(state: any) {
    this.changeState.next(state);
  }

  getUpdate(): Observable<any> {
    return this.changeState.asObservable();
  }
}
