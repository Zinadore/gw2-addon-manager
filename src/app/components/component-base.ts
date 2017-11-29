import { Subscriber } from 'rxjs/Subscriber';

export class ComponentBase {
  private compositeSubscriptions: Array<any>;

  constructor() {
    this.compositeSubscriptions = [];
  }

  protected disposeOnDestroy(sub: any): void {
    this.compositeSubscriptions.push(sub);
  }

  public ngOnDestroy() {
    this.compositeSubscriptions.map((func: any) => {
      if (func instanceof Subscriber) {
        func.unsubscribe();
      } else {
        func();
      }
    });

    this.destroy();
    this.compositeSubscriptions = null;
  }

  protected destroy(): void {

  }
}
