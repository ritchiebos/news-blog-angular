import { Injectable } from '@angular/core';
import { Author } from '../../models/author.model';
import { AuthorServiceBase } from '../author.service.base';
import { environment } from '../../../environments/environment';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class MDBAuthorService extends AuthorServiceBase {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private url = environment.mongoUrl + '/authors';
  private _authors: Author[];
  // private _authors: Array<Author> = [
  //   new Author('1', 'Richard'),
  //   new Author('2', 'Danny'),
  //   new Author('3', 'Hugo')
  // ];
  private _observeAuthors: BehaviorSubject<Author[]> =
    new BehaviorSubject<Author[]>(this._authors);

  constructor(private http: Http) {
    super();
    //this.getAuthors();
  }

	public getObserveAuthors(): BehaviorSubject<Author[]>  {
		return this._observeAuthors;
	}

  public getAuthors(): Promise<Author[]> {
    return this.http.get(this.url, {
      headers: this.headers
    }).toPromise().then((response) => {
      const authors = response.json();
      this._authors = [];
      authors.forEach((a) => {
        const author = new Author(a._id, a._name);
        this._authors.push(author);
      });
      console.log('GET: ' + this.url);
      console.log(this._authors);
      return this._observeAuthors.next(this._authors);
    }).catch((error) => {
      return this.handleError(error);
    });
  }

  public getAuthor(id: string): Promise<Author> {
    return this.http.get(this.url + "/" + id, {
      headers: this.headers
    }).toPromise().then((response) => {
      const a = response.json();
      const author = new Author(a._id, a._name);
      console.log('GET: ' + this.url + "/" + id);
      console.log(author);
      return author;
    }).catch((error) => {
      return this.handleError(error);
    });
  }

  public getAuthorName(name: string): Author {
    const author = this._authors.find(a => a.name === name);
    if(author) {
      return author;
    } else {
      return new Author(null, name);
    }
  }

  private handleError(error: any): Promise<any> {
		console.log('handleError');
		return Promise.reject(error.message || error);
	}
}
