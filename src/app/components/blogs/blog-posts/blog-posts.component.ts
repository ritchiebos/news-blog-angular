import { Blog } from '../../../models/blog.model';
import { Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Subscription } from 'rxjs/Subscription';
import { BlogServiceBase } from '../../../services/blog.service.base';
import { ActivatedRoute, Params } from '@angular/router';
import { ArchiveServiceBase } from '../../../services/archive.service.base';

@Component({
  selector: 'app-blog-posts',
  templateUrl: './blog-posts.component.html'
})
export class BlogPostsComponent implements OnInit, OnDestroy {
  public title: string = "The News Blog";
  public description: string = "The official blog website created with Bootstrap";
  public blogs: Array<Blog>;
  private subs: Array<Subscription> = [
    new Subscription(),
    new Subscription()
  ];

  constructor(private serviceArchive: ArchiveServiceBase,
              private serviceBlog: BlogServiceBase,
              private aRoute: ActivatedRoute) { }

  ngOnInit() {
    this.subs[0] = this.serviceBlog.getObserveBlogs().subscribe(
      (blogs: Array<Blog>) => {
        this.blogs = blogs.sort(
          (a, b) => {
            if(a.timestamp.getTime() < b.timestamp.getTime()) {
              return 1;
            }
        });
      }
    );

    this.subs[1] = this.aRoute.params.subscribe(
      (params: Params) => {
        if(params['id']) {
          const archive = this.serviceArchive.getArchive(params['id']);
          this.blogs = archive.blogs.sort(
            (a, b) => {
              if(a.timestamp.getTime() < b.timestamp.getTime()) {
                return 1;
              }
          });
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subs[0].unsubscribe();
    this.subs[1].unsubscribe();
  }

}
