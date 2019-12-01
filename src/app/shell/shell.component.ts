import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Shell } from '@app/shell/shell.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
  public ifActive = true;
  public subscription: Subscription;
  private router: Router;

  constructor(private shellService: Shell) {
    this.subscription = this.shellService.getState().subscribe(message => {
      this.ifActive = message;
      console.log('state is:' + this.ifActive + 'ifActive:' + this.ifActive);
    });
  }

  ngOnInit() {
    this.shellService.changeState(true);
  }

  onConfirmation(route: string) {
    if (!this.ifActive) {
      this.shellService.setConfirmation(true, route);
    } else {
      this.shellService.setConfirmation(false, route);
    }
  }

  toggle = true;

  toggleClass() {
    this.toggle = !this.toggle;
  }
}
