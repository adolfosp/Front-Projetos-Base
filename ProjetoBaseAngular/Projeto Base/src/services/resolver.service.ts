import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

export const PostResolver: ResolveFn<string> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<string> =>
  new Observable(observer => {
    observer.next('1');
    observer.next('2');
    observer.next('3');

    observer.complete();
  });
