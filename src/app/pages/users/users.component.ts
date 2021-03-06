import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  constructor() {}

  allDataList: any;

  tabList: any;

  ngOnInit() {}

  listOnTable(val: any) {
    const list = {
      data: val || '',
    };
    this.allDataList = list;
  }
  selectTab(event) {
    //  console.log(event.tabTitle)
    this.tabList = event.tabTitle;
  }
}
