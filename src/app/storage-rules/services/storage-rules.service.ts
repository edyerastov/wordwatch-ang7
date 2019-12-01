import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PAGE_SIZE } from '@app/shared/constant/constant';
import { BehaviorSubject, Observable } from 'rxjs';
import { IStorageRulesRequestConfig, IStorageRule, IToPutUpdatedData } from '../storage-rules.model';
import { UrlSerializer } from '@angular/router';

@Injectable()
export class StorageRulesService {
  public changeState = new BehaviorSubject({ state: false });

  constructor(private httpClient: HttpClient, private serializer: UrlSerializer) {}

  getRulesByPrm(obj: IStorageRulesRequestConfig) {
    let url = `/storagerules?pageSize=${obj.pageSize ? obj.pageSize : PAGE_SIZE.mainList}`;
    delete obj['pageSize'];

    for (let key in obj) {
      let value = obj[key];
      url = url + `&${key}=${value}`;
    }

    return this.httpClient.get(url);
  }

  newRule(data: any) {
    return this.httpClient.post('/storagerules', data);
  }

  getRuleDetails(id: string) {
    return this.httpClient.get('/storagerules/' + id);
  }

  getUpdate(): Observable<any> {
    return this.changeState.asObservable();
  }

  sendUpdate(state: any) {
    this.changeState.next(state);
  }

  updateStorageRuleDetails(id: string, data: IToPutUpdatedData) {
    return this.httpClient.put('/storagerules/' + id, data);
  }

  deleteStorageRule(id: string) {
    return this.httpClient.delete('/storagerules/' + id);
  }

  generateToPutData(storageRuleDetails: IStorageRule): IToPutUpdatedData {
    const data = JSON.parse(JSON.stringify(storageRuleDetails));
    data.targets = {};
    data.locations = data._embedded.locations.map((item: { id: any }) => item.id);
    data.targets.users = data._embedded.targets._embedded.users.map((item: { id: any }) => item.id);
    data.targets.devices = data._embedded.targets._embedded.devices.map((item: { id: any }) => item.id);
    data.targets.groups = data._embedded.targets._embedded.groups.map((item: { id: any }) => item.id);
    delete data._embedded;
    return data;
  }
}
