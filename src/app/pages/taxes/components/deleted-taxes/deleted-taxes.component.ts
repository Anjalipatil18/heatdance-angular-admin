import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { TaxesService } from '../service/taxes.service';
import { UsertaxesDialogComponent } from '../inner-page/usertaxes-dialog/usertaxes-dialog.component';
import { DialogContentComponent } from 'src/app/pages/ui-features/dialog-content/dialog-content.component';
@Component({
  selector: 'app-deleted-taxes',
  templateUrl: './deleted-taxes.component.html',
  styleUrls: ['./deleted-taxes.component.scss'],
})
export class DeletedTaxesComponent implements OnInit {
  constructor(
    private service: TaxesService,
    private dialogService: NbDialogService
  ) {}

  userActiveData: any = [];
  userActiveSearch: any;
  userActive: any;
  columns: any;
  statusId: any = [];

  limit = 10;
  totRecords: any;
  paginationIndex = 0;

  ngOnInit() {
    this.getAllTaxes();
  }

  getAllTaxes(event?) {
    const list = {
      offset: event && event.page ? event.page - 1 : 0,
      limit: this.limit,
      status: 'Delete',
    };
    this.paginationIndex = event && event.page ? event.page - 1 : 0;
    this.service.taxesList(list).subscribe(
      (res: any) => {
        console.log('assets/4', res);
        this.totRecords = res.data.length;
        this.userActive = res.data;
      },
      error => {
        console.log(error);
      }
    );
  }

  deleteTaxes(status) {
    const titles = status === 4 ? 'Active' : 'Suspend';
    this.dialogService
      .open(DialogContentComponent, {
        context: {
          action: false,
          title: titles,
          content: 'Are you sure you want to ' + titles + ' it ?',
          ok: titles + ' it !!',
          cancelT: 'Cancel it !!',
        },
      })
      .onClose.subscribe(res => {
        // console.log(res)
        if (res) {
          this.usersDelete(titles);
        }
      });
  }

  usersDelete(status) {
    const list = {
      status,
      ids: this.statusId,
    };
    // console.log(list)
    this.service.deleteTaxesList(list).subscribe(
      (res: any) => {
        // this.listTable.emit(3);
        this.statusId = [];
        this.userActive = [];
        this.getAllTaxes();
        console.log('deleteAssets', res);
      },
      error => {
        console.log(error);
      }
    );
  }

  searchVerifiedActive(value) {
    this.userActiveSearch = [];
    this.userActiveData = [];
    if (value && this.userActive && this.userActive.length > 0) {
      this.userActiveData = this.userActive;
      this.userActiveData.map(data => {
        if (
          data.username &&
          data.username.toUpperCase().indexOf(value.toUpperCase()) > -1
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
      .open(UsertaxesDialogComponent, {
        context: {
          action: false,
          title: 'User Details',
          content: data,
          ok: 'Submit',
          cancelT: 'Cancel',
        },
      })
      .onClose.subscribe(res => {
        console.log(res);
        //  if(res){
        //    this.listTable.emit(1);
        //    this.statusId = [];
        //    this.userActive=[];
        //  }
      });
  }
}
