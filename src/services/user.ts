import device from 'react-native-device-info';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import cache, { cacheClean } from '~/helpers/rxjs-operators/cache';
import { IUser } from '~/interfaces/models/user';
import { IUserToken } from '~/interfaces/tokens/user';

import apiService from './api';
import cacheService from './cache';
import deviceService from './device';
import tokenService from './token';

export class UserService {
  constructor() {}

  public login(email: string, password: string): Observable<void> {
    return deviceService.getInformation().pipe(
      switchMap(({ deviceId, deviceName, notificationToken }) => {
        return apiService.post('/auth/login', {
          email,
          password,
          deviceId,
          deviceName,
          notificationToken
        });
      }),
      switchMap(tokens => tokenService.setTokens(tokens)),
      map(() => null)
    );
  }

  public get(refresh?: boolean): Observable<IUser> {
    return tokenService.getTokens().pipe(
      switchMap(token => {
        if (!token) {
          return of({ firstName: 'Teste', email: 'danielprado.ad@gmail.com', roles: [] });
        }

        return apiService.get<IUser>('profile').pipe(cache('service-profile', { refresh }));
      })
    );
  }

  public save(model: IUser): Observable<IUser> {
    return apiService.post<IUser>('profile', model).pipe(cacheClean('service-profile'));
  }

  public isLogged(): Observable<boolean> {
    return this.userChanged().pipe(map(t => !!t));
  }

  public userChanged(): Observable<IUserToken> {
    return tokenService
      .getUser()
      .pipe(distinctUntilChanged((n, o) => (n || { id: null }).id === (o || { id: null }).id));
  }

  public logout(): Observable<void> {
    return apiService.post('/auth/logout', { deviceId: device.getUniqueId() }).pipe(
      switchMap(() => tokenService.clearToken()),
      switchMap(() => cacheService.clear())
    );
  }

  public updateSession(notificationToken: string): Observable<void> {
    return deviceService.getInformation().pipe(
      switchMap(({ deviceId, deviceName }) => {
        return apiService.post('/auth/opened', { deviceId, deviceName, notificationToken });
      })
    );
  }
}

const userService = new UserService();
export default userService;
