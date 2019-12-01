import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { RoleService } from '../../services/role.service';
import { SEARCH_PROFILES } from '@app/shared/constant/constant';
import { FormGroup } from '@angular/forms';
import { Shell } from '@app/shell/shell.service';

@Component({
  selector: 'app-search-profile-picker',
  templateUrl: './search-profile-picker.component.html',
  styleUrls: ['./search-profile-picker.component.scss']
})
export class SearchProfilePickerComponent implements OnInit {
  @Input() options: any = null;
  @Input() selected: any = null;
  @Input() group: FormGroup;
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onClear: EventEmitter<any> = new EventEmitter<any>();

  public data: Array<any> = [];
  public searchStr: string = '';
  public onInputSearch: Subject<string> = new Subject();

  constructor(private roleService: RoleService, private shellService: Shell) {
    this.data = Object.values(SEARCH_PROFILES);
    this.onInputSearch.pipe(debounceTime(500)).subscribe(value => {});
  }

  ngOnInit() {}

  // On item select from dropdown
  onItemSelect(data: any): void {
    if (data !== undefined) {
      if (data && data.type === 'focus') {
      } else {
        if (data && typeof data === 'string') {
          this.onChange.emit(data);
          // if (this.selected !== null) {
          //   this.shellService.changeState(false);
          // } else {
          //   this.shellService.changeState(true);
          // }
        }
      }
    }
  }

  // To handle clear event
  onItemClear(event: any) {
    this.onClear.emit('clear');
  }
}
