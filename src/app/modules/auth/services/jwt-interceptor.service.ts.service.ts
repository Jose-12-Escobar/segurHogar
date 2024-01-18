import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionStorageService } from './session-storage.service';
import { NO_API_KEY } from '../http.contex';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorServiceTsService implements HttpInterceptor {

  _sessionStorage = inject(SessionStorageService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token : string = this._sessionStorage.getItem('token');

    if (req.context.get(NO_API_KEY)) {
      return next.handle(req);
  }

    if (token != "") {
      req=req.clone(
        {
          setHeaders: {
            'Content-Type': 'application/json;charset=utf-8',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      )
    }
    return next.handle(req);
  }
}
