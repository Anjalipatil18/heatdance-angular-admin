import { Component, OnInit } from '@angular/core';
import { ModelsService } from '../../service/models.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-models-comments',
  templateUrl: './models-comments.component.html',
  styleUrls: ['./models-comments.component.scss'],
})
export class ModelsCommentsComponent implements OnInit {
  constructor(private service: ModelsService, private route: ActivatedRoute) {}

  userActiveData: any = [];
  userActiveSearch: any;
  userActive: any;
  columns: any;
  commentId: any;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.commentId = params.id;
      this.getAllModels();
    });
  }

  getAllModels() {
    const list = {
      type: 'asset',
      id: this.commentId,
    };
    this.service.modelsCommentsList(list).subscribe(
      (res: any) => {
        console.log('comment/type/id', res);
        if (res.data && res.data.length > 0) {
          this.userActive = res.data[0].comments;
          res.data[0].comments.map(x => {
            x.firstName =
              x.commentedBy[0].firstName + ' ' + x.commentedBy[0].lastName;
          });
        }
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
          data.firstName.toUpperCase().indexOf(value.toUpperCase()) > -1
        ) {
          this.userActiveSearch.push(data);
        }
      });
      this.userActiveData = this.userActiveSearch;
    } else {
      console.log('else');
    }
  }
}
