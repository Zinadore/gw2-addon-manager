import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'app-first-run',
  templateUrl: './first-run.component.html',
  styleUrls: ['./first-run.component.scss']
})
export class FirstRunComponent implements OnInit {

  @HostBinding('class.content-item') content_item_class = true;
  constructor() { }

  ngOnInit() {
  }

}
