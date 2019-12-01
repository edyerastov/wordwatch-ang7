import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { PAGE_SIZE, BASE_URL } from '@app/shared/constant/constant';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class RoleService {
  public changeState = new BehaviorSubject({ state: false });
  private ifClicked = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient, private router: Router) {}

  // To get all roles
  getRoles() {
    return this.httpClient.get(`/roles?pageSize=${PAGE_SIZE.mainList}`);
  }

  newRole(data: any) {
    return this.httpClient.post('/roles', data);
  }

  // To get all roles
  getRolesByPrm(obj: any) {
    let url = `/roles?pageSize=${obj.pageSize ? obj.pageSize : PAGE_SIZE.mainList}`;
    delete obj['pageSize'];
    for (let key in obj) {
      let value = obj[key];
      url = url + `&${key}=${value}`;
    }
    console.log(url);
    return this.httpClient.get(url);
  }

  // To get role details based on id
  getRoleDetails(id: string) {
    return this.httpClient.get('/roles/' + id);
  }

  // To update role details
  updateRoleDetails(id: string, data: any) {
    return this.httpClient.put('/roles/' + id, data);
  }

  // To delete role by id
  deleteRole(id: string) {
    return this.httpClient.delete('/roles/' + id);
  }

  setOutsideClick(id: string) {
    if (this.router.url === `/roles/selected/${id}/edit`) {
      this.ifClicked.next(true);
    }
  }

  getOutsideClick() {
    return this.ifClicked.asObservable();
  }

  sendUpdate(state: any) {
    this.changeState.next(state);
  }

  getUpdate(): Observable<any> {
    return this.changeState.asObservable();
  }
}
