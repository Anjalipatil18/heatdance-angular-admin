import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { DialogContentComponent } from 'src/app/pages/ui-features/dialog-content/dialog-content.component';

import { Configuration } from 'src/app/global/global-config';
import { Router } from '@angular/router';
import { ReportReasonsService } from '../service/report-reasons.service';

@Component({
  selector: 'app-report-user-reasons',
  templateUrl: './report-user-reasons.component.html',
  styleUrls: ['./report-user-reasons.component.scss'],
})
export class ReportUserReasonsComponent implements OnInit {
  reasons: any;
  reasonsSearch = [];
  reasonsData = [];
  columns: any;

  constructor(
    private service: ReportReasonsService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private conf: Configuration,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllReport();
  }

  // get enabled reasons
  getAllReport() {
    this.service.reportReasons(2).subscribe(
      (res: any) => {
        console.log('reportReasons/2', res);
        this.reasons = res.result;
      },
      error => {
        console.log(error);
      }
    );
  }

  // search in active reasons
  searchReasonsActive(value) {
    this.reasonsSearch = [];
    this.reasonsData = [];
    if (value && this.reasons && this.reasons.length > 0) {
      this.reasonsData = this.reasons;
      this.reasonsData.map(data => {
        if (data.reason.en.toUpperCase().indexOf(value.toUpperCase()) > -1) {
          this.reasonsSearch.push(data);
        }
      });
      this.reasonsData = this.reasonsSearch;
    } else {
      console.log('else');
    }
  }

  deleteLang(id, index) {
    this.reasons.splice(index, 1);
    this.reasons = [...this.reasons];
    const list = {
      reportReasonId: id,
      deleteStatus: 2,
    };
    this.service.deleteReport(list).subscribe(
      (res: any) => {
        console.log('reportReasonsAction', res);
        // this.getAllreasons();
        // this.listTable.emit(1);
      },
      error => {
        console.log(error);
      }
    );
  }

  openDialog(id, index) {
    this.dialogService
      .open(DialogContentComponent, {
        context: {
          action: false,
          title: 'Delete',
          content: 'Are you sure you want to delete it ?',
          ok: 'Delete it !!',
          cancelT: 'Cancel it !!',
        },
      })
      .onClose.subscribe(res => {
        // console.log(res)
        if (res) {
          this.deleteLang(id, index);
        }
      });
  }
}
