import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { AttributesService } from './../service/attributes.service';
import { DialogContentComponent } from 'src/app/pages/ui-features/dialog-content/dialog-content.component';

@Component({
  selector: 'app-active-attributes',
  templateUrl: './active-attributes.component.html',
  styleUrls: ['./active-attributes.component.scss'],
})
export class ActiveAttributesComponent implements OnInit {
  limit: 10;
  totRecords: any;
  @Input()
  set allDataList(allDataList: any) {
    // console.log(allDataList);
    const val = allDataList && allDataList.data === 1 ? this.getAllUsers() : '';
  }

  constructor(
    private service: AttributesService,
    private dialogService: NbDialogService
  ) {}

  @ViewChild('table', { static: true }) table;
  @Output() listTable = new EventEmitter<any>();

  userActiveData: any = [];
  userActive: any;
  columns: any;
  userActiveSearch: any;
  statusId = [];
  paginationIndex = 0;

  ngOnInit() {
    this.getAllUsers();
  }
  getAllUsers(event?) {
    const list = {
      set: event && event.page ? event.page - 1 : 0,
      limit: 10,
      status: 1,
    };
    this.paginationIndex = event && event.page ? event.page - 1 : 0;

    this.service.attributesList(list).subscribe(
      (res: any) => {
        console.log('attributes/1', res);
        this.totRecords = res.recordsTotal;
        // this.totRecords = 0;
        this.userActive = res.result;
      },
      error => {
        console.log(error);
      }
    );
  }

  searchVerifiedActive(value) {
    this.userActiveSearch = [];
    this.userActiveData = [];
    if (value) {
      this.userActiveData = this.userActive;
      this.userActiveData.map(data => {
        if (
          data.title.en &&
          data.title.en.toUpperCase().indexOf(value.toUpperCase()) > -1
        ) {
          this.userActiveSearch.push(data);
        } else if (
          data.titleTag &&
          data.titleTag.toUpperCase().indexOf(value.toUpperCase()) > -1
        ) {
          this.userActiveSearch.push(data);
        }
      });
      this.userActiveData = this.userActiveSearch;
    } else {
      console.log('else');
    }
  }

  reportCheckbox(event, id) {
    if (event.target.checked) {
      this.statusId.push(id);
    } else {
      const index = this.statusId.findIndex(x => x === id);
      if (index > -1) {
        this.statusId.splice(index, 1);
      }
    }
  }

  openDialog(data) {
    this.dialogService
      .open(DialogContentComponent, {
        context: {
          action: false,
          title: 'Delete',
          content: 'Are you sure you want to delete it ?',
          ok: 'Yes, delete it !!',
          cancelT: 'No, cancel it !!',
        },
      })
      .onClose.subscribe(res => {
        if (res) {
          const list = {
            deleteStatus: data,
            id: this.statusId,
          };
          this.service.deleteAttributes(list).subscribe(
            (respons: any) => {
              console.log('deleteAttributes', respons);
              this.statusId = [];
              this.userActive = [];
              this.listTable.emit(1);
            },
            error => {
              console.log(error);
            }
          );
        }
      });
  }
}
