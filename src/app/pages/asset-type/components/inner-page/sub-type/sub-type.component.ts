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
import { AssetTypeService } from '../../service/asset-type.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Ng7DynamicBreadcrumbService } from 'ng7-dynamic-breadcrumb';

@Component({
  selector: 'app-sub-type',
  templateUrl: './sub-type.component.html',
  styleUrls: ['./sub-type.component.scss'],
})
export class SubTypeComponent implements OnInit {
  constructor(
    private breadCrumb: Ng7DynamicBreadcrumbService,
    private service: AssetTypeService,
    private route: ActivatedRoute,
    private dialogService: NbDialogService
  ) {}

  userActive: any;
  columns: any;
  statusId = [];
  assetTypeId: any;
  assetTypeTitleName;

  aciveGroupSearch: any = [];
  aciveGroupData: any;

  limit = 10;
  totRecords: any;
  paginationIndex = 0;

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(params);
      this.assetTypeId = params.id;
      this.getAllUsers();
    });
  }

  getAllUsers(event?) {
    const list = {
      set: event && event.page ? event.page - 1 : 0,
      limit: this.limit,
      status: 0,
      trigger: 2,
      action: 1,
    };
    this.paginationIndex = event && event.page ? event.page - 1 : 0;
    this.service.assetsTypeList(list, this.assetTypeId).subscribe(
      (res: any) => {
        console.log('assetsType/id', res);
        this.totRecords = res.recordsTotal;
        // this.totRecords = res.result.length
        res.result.sort((a, b) => a.seqId - b.seqId);
        this.userActive = res.result;
        this.aciveGroupData = res.result;
        this.assetTypeTitleName = res.result[0].assetTypeTitle;
        const breadcrumb = { assetType: res.result[0].assetTypeTitle };
        this.breadCrumb.updateBreadcrumbLabels(breadcrumb);
      },
      error => {
        console.log(error);
      }
    );
  }

  searchGroupUser(value) {
    this.aciveGroupSearch = [];
    if (value && this.aciveGroupData && this.aciveGroupData.length > 0) {
      this.aciveGroupData.map(data => {
        if (data.titleLang.en.toUpperCase().indexOf(value.toUpperCase()) > -1) {
          this.aciveGroupSearch.push(data);
        }
      });
      this.userActive = this.aciveGroupSearch;
    } else {
      this.userActive = this.aciveGroupData;
    }
  }

  usersDelete(status) {
    // this.roles.splice(index, 1);
    // this.roles = [...this.roles];
    const list = {
      deleteStatus: status,
      id: this.statusId,
      trigger: 2,
    };
    console.log(list);
    this.service.getDeleteAssetType(list).subscribe(
      (res: any) => {
        this.userActive = [];
        this.getAllUsers();
        console.log('DeleteAssetType', res);
      },
      error => {
        console.log(error);
      }
    );
  }

  deleteType(status) {
    const titles = status === 1 ? 'Activate' : 'Delete';
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
        console.log(res);
        if (res) {
          this.usersDelete(status);
        }
      });
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
    // console.log(this.statusId);
  }

  reOrder(index, status) {
    console.log(index, status);
    const list = {
      up: {
        id:
          status === 0
            ? this.userActive[index].id
            : this.userActive[index + 1].id,
        seqId:
          status === 0
            ? this.userActive[index - 1].seqId
            : this.userActive[index].seqId,
      },
      down: {
        id:
          status === 1
            ? this.userActive[index].id
            : this.userActive[index - 1].id,
        seqId:
          status === 1
            ? this.userActive[index + 1].seqId
            : this.userActive[index].seqId,
      },
      trigger: 2,
      assetTypeId: this.assetTypeId,
    };

    console.log(list);

    this.service.getAssetTypeOrder(list).subscribe(
      (res: any) => {
        console.log('attributesGroupAttrChangeOrder/id', res);
        this.userActive = [];
        this.aciveGroupData = [];
        this.getAllUsers();
      },
      error => {
        console.log(error);
      }
    );
  }
}
