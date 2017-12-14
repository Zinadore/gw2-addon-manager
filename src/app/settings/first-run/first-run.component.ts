import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-first-run',
  templateUrl: './first-run.component.html',
  styleUrls: ['./first-run.component.scss']
})
export class FirstRunComponent implements OnInit, OnDestroy {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    console.log('FirstRunComponent destroyed');
  }

  onPathSet(event) {
    this.router.navigate(['/addons']);
  }
}
