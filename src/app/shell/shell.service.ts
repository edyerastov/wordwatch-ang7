import { BehaviorSubject } from 'rxjs';

/**
 * Provides helper methods to create routes.
 */
export class Shell {
  /**
   * Creates routes using the shell component and authentication.
   * @param routes The routes to add.
   * @return The new route using shell as the base.
   */

  private ifActive = new BehaviorSubject<boolean>(true);
  private confirmation = new BehaviorSubject<boolean>(false);
  private route: string;

  changeState(state: boolean) {
    this.ifActive.next(state);
  }

  getState() {
    return this.ifActive.asObservable();
  }

  setConfirmation(state: boolean, way: string) {
    this.confirmation.next(state);
    this.route = way;
  }

  getConfirmation() {
    return this.confirmation.asObservable();
  }

  getRoute() {
    return this.route;
  }

  get isPrevRoute(): boolean {
    return !!this.route;
  }
}
