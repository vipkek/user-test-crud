import {
  HttpRequest,
  HttpInterceptorFn,
  HttpHandlerFn,
} from '@angular/common/http';
import { environment } from '@environments';

export const apiInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  return next(
    req.clone({
      url: `${environment.BASE_URL}/${req.url}`,
    }),
  );
};
