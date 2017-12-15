import { AfterViewInit, Component, HostBinding, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers/index';
import * as fromAddon from '../../addons.reducer';
import { Addon } from '../../models/addon';
import { Observable } from 'rxjs/Observable';
import { ComponentBase } from '../../../components/component-base';
import { AddonService } from '../../../providers/addon.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends ComponentBase implements OnInit, AfterViewInit {
  @HostBinding('class.content-item') content_item_class = true;

  public addons$: Observable<Addon[]>;

  constructor(private store: Store<AppState>, private addonService: AddonService) {
    super();
    this.addons$ = this.store.select(fromAddon.selectAll);
    this.disposeOnDestroy(this.addons$.subscribe((addons) => {
    }));
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  public installAddon(addonId: string): void {
    this.addonService.installAddon(addonId);
  }

  public uninstallAddon(addonId: string): void {
    this.addonService.uninstallAddon(addonId);
  }
}
