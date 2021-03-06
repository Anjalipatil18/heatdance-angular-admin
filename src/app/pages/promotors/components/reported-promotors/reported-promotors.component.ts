import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { PromotorsService } from '../service/promotors.service';
import { DialogContentComponent } from 'src/app/pages/ui-features/dialog-content/dialog-content.component';
import { UserpromotorsDialogComponent } from '../inner-page/userpromotors-dialog/userpromotors-dialog.component';

@Component({
  selector: 'app-reported-promotors',
  templateUrl: './reported-promotors.component.html',
  styleUrls: ['./reported-promotors.component.scss'],
})
export class ReportedPromotorsComponent implements OnInit {
  constructor(
    private service: PromotorsService,
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
    this.getAllPromotors();
  }

  getAllPromotors(event?) {
    const eve = event && event.page ? event.page - 1 : 0;
    const list = {
      set: eve * 10,
      limit: this.limit,
      status: 4,
      statusText: 'approved',
    };
    this.service.promotorsList(list).subscribe(
      (res: any) => {
        this.userActive = res.data;
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
          data.firstName &&
          data.firstName.toLowerCase().includes(value.toLowerCase())
        ) {
          this.userActiveSearch.push(data);
        } else if (
          data.email &&
          data.email.toLowerCase().includes(value.toLowerCase())
        ) {
          this.userActiveSearch.push(data);
        } else if (
          data.phoneNumber &&
          data.phoneNumber.toUpperCase().indexOf(value.toUpperCase()) > -1
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

  usersDelete(status, res) {
    const statusCode = status === 2 ? 'deleted' : 'suspended';
    const list = {
      userIds: this.statusId,
      // pin: '12345',
      promoter: statusCode,
      reason: res,
    };
    this.service.deleteTagList(list).subscribe(
      () => {
        this.statusId = [];
        this.userActive = [];
        this.getAllPromotors();
      },
      error => {
        console.log(error);
      }
    );
  }

  deletePromotors(status) {
    const titles = status === 2 ? 'Delete' : 'Suspend';
    this.dialogService
      .open(DialogContentComponent, {
        context: {
          reason: true,
          action: false,
          title: titles,
          content: 'Are you sure you want to ' + titles + ' it ?',
          ok: titles + ' it !!',
          cancelT: 'Cancel it !!',
        },
      })
      .onClose.subscribe(res => {
        if (res) {
          this.usersDelete(status, res);
        }
      });
  }

  openDialog(data) {
    this.dialogService
      .open(UserpromotorsDialogComponent, {
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
      });
  }
}
