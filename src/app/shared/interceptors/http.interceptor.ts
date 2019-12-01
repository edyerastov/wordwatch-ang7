import { Router, ActivatedRoute } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/do';

declare let alertify: any;

export class HTTPInterceptor implements HttpInterceptor {
  constructor(private router: Router, private route: ActivatedRoute) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const newReq = req.clone({
      headers: req.headers
        .set('X-WordWatch-UI-State', this.router.url.replace('/', ''))
        .set('Accept', 'application/hal+json'),
      withCredentials: true
    });
    return next.handle(newReq).do(
      (event: HttpEvent<any>) => {},
      (err: any) => {
        if (err.status === 404) {
          //   alert('something wrong!');
        } else if (err.status === 400) {
          alertify.error(err.error.errors[0], 'alert');
        }
        console.log(err);
      }
    );
  }
}
