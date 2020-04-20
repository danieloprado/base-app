import { NavigationContainerRef } from '@react-navigation/native';
import { Linking } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { Observable, of, ReplaySubject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { logError } from '~/helpers/rxjs-operators/logError';

import { appReady } from '..';
import { register } from './handlers/register';

export interface ILinkingHandler {
  validate: (url: string) => boolean;
  handle: (url: string, dispatch: NavigationContainerRef, appStarted: boolean) => Promise<void>;
}

export class LinkingService {
  private hasInitialUrl$: ReplaySubject<boolean>;
  private navigator: NavigationContainerRef;
  private handlers: ILinkingHandler[] = [];

  constructor() {
    this.hasInitialUrl$ = new ReplaySubject(1);

    of(true)
      .pipe(
        switchMap(() => Linking.getInitialURL()),
        logError(),
        tap(url => this.execUrl(url, true))
      )
      .subscribe();

    Linking.addEventListener('url', ({ url }) => {
      this.execUrl(url, false);
    });
  }

  public setup(navigator: NavigationContainerRef): void {
    this.navigator = navigator;
    register(this);
  }

  public registerHandler(handler: ILinkingHandler): void {
    this.handlers.push(handler);
  }

  public hasInitialUrl(): Observable<boolean> {
    return this.hasInitialUrl$.asObservable();
  }

  private execUrl(url: string, initial: boolean): any {
    const handler = this.getHandler(url);
    this.hasInitialUrl$.next(handler && initial);

    if (!handler) return;

    appReady()
      .pipe(
        switchMap(() => handler.handle(url, this.navigator, initial)),
        tap(() => SplashScreen.hide()),
        tap(() => this.hasInitialUrl$.next(false)),
        logError()
      )
      .subscribe();
  }

  private getHandler(url: string): ILinkingHandler {
    return this.handlers.find(h => h.validate(url));
  }
}

const linkingService = new LinkingService();
export default linkingService;
