import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Addon } from '../../models/addon';

@Component({
  selector: 'app-addon-display',
  templateUrl: './addon-display.component.html',
  styleUrls: ['./addon-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddonDisplayComponent implements OnInit {

  _addon: Addon;
  @Input() set addon(value) {
    if (this._addon && this._addon !== this._addon) {
      this.working = false;
    }

    this._addon = value;
  };

  @Output() uninstallAddon = new EventEmitter<string>();
  @Output() installAddon = new EventEmitter<string>();

  public working: boolean;

  constructor() { }

  ngOnInit() {
  }

  public remove() {
    this.working = true;
    this.uninstallAddon.emit(this._addon.id);
  }

  public install() {
    this.working = true;
    this.installAddon.emit(this._addon.id);
  }

}
