import { Component, OnInit } from '@angular/core';
import { PromotorsService } from '../../service/promotors.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-promotors-comments',
  templateUrl: './promotors-comments.component.html',
  styleUrls: ['./promotors-comments.component.scss'],
})
export class PromotorsCommentsComponent implements OnInit {
  constructor(
    private service: PromotorsService,
    private route: ActivatedRoute
  ) {}

  userActiveData: any = [];
  userActiveSearch: any;
  userActive: any;
  columns: any;
  commentId: any;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.commentId = params.id;
      this.getAllPromotors();
    });
  }

  getAllPromotors() {
    const list = {
      type: 'asset',
      id: this.commentId,
    };
    this.service.promotorsCommentsList(list).subscribe(
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
