import NetInfo, { NetInfoState, NetInfoStateType } from '@react-native-community/netinfo';
import device from 'react-native-device-info';
import { Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, first, map, switchMap } from 'rxjs/operators';

import notificationService from './notification';

export class DeviceService {
  private connection$: ReplaySubject<NetInfoState>;

  constructor() {
    this.connection$ = new ReplaySubject(1);
    this.watchNetwork();
  }

  public isConnected(): Observable<boolean> {
    return this.connection$.pipe(
      map(state => state.isInternetReachable),
      distinctUntilChanged()
    );
  }

  public getConnectionType(): Observable<NetInfoStateType> {
    return this.connection$.pipe(
      map(state => state.type),
      distinctUntilChanged()
    );
  }

  public getInformation(): Observable<{
    deviceId: string;
    deviceName: string;
    notificationToken: string;
    appVersion: string;
  }> {
    return notificationService.getToken().pipe(
      first(),
      switchMap(async notificationToken => {
        const [deviceId, brand, model, systemName, systemVersion, appVersion] = await Promise.all([
          device.getUniqueId(),
          device.getBrand(),
          device.getModel(),
          device.getSystemName(),
          device.getSystemVersion(),
          device.getVersion()
        ]);

        return {
          deviceId,
          deviceName: `${brand} - ${model} (${systemName} ${systemVersion})`,
          notificationToken,
          appVersion
        };
      })
    );
  }

  private watchNetwork(): void {
    NetInfo.fetch().then(state => this.connection$.next(state));
    NetInfo.addEventListener(state => this.connection$.next(state));
  }
}

const deviceService = new DeviceService();
export default deviceService;
