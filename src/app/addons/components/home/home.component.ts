import { AfterViewInit, Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../reducers/index';
import * as fromAddon from '../../addons.reducer';
import { Addon } from '../../models/addon';
import { Observable } from 'rxjs/Observable';
import { MatSort, MatTableDataSource } from '@angular/material';
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
  displayedColumns = ['name', 'actions', 'version', 'latest_version'];
  dataSource: MatTableDataSource<Addon>;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private store: Store<AppState>, private addonService: AddonService) {
    super();
    this.addons$ = this.store.select(fromAddon.selectAll);
    this.disposeOnDestroy(this.addons$.subscribe((addons) => {
      this.dataSource = new MatTableDataSource<Addon>(addons);
    }));
  }

  ngOnInit() {
    console.log('HomeComponent init');
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  public installAddon(addonId: string): void {
    this.addonService.installAddon(addonId);
  }

  public uninstallAddon(addonId: string): void {
    this.addonService.uninstallAddon(addonId);
  }
}
