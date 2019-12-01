import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Credentials, CredentialsService } from './credentials.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface LoginContext {
  username: string;
  password: string;
  remember?: boolean;
}

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService {
  constructor(private credentialsService: CredentialsService, private httpClient: HttpClient) {}

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: LoginContext): Observable<LoginContext> {
    const httpOptions = {
      headers: new HttpHeaders({ content: 'application/json', 'content-type': 'application/json;charset=UTF-8' }),
      withCredentials: true,
      responseType: 'text'
    };
    const data = {
      username: context.username,
      token: '123456'
    };
    this.credentialsService.setCredentials(data, context.remember);
    // @ts-ignore
    return this.httpClient.post<LoginContext>(`/authentication/login/credentials`, context, httpOptions);
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.credentialsService.setCredentials();
    return of(true);
  }
}
