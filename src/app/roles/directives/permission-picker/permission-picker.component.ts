import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Shell } from '@app/shell/shell.service';

@Component({
  selector: 'app-permission-picker',
  templateUrl: './permission-picker.component.html',
  styleUrls: ['./permission-picker.component.scss']
})
export class PermissionPickerComponent implements OnInit, OnChanges {
  @Input() permissions: Array<any> = [];
  @Input() selected: Array<any> = [];
  @Input() options: any = null;
  @Input() group: FormGroup;
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(private shellService: Shell) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {}

  // To handle item select event
  onItemSelect(event: any): void {
    this.onChange.emit(this.selected);
    if (this.selected.length !== 0) {
      this.shellService.changeState(false);
    } else {
      this.shellService.changeState(true);
    }
  }
}
