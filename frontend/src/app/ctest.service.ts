import { Injectable, OnInit, RendererFactory2 } from '@angular/core';
import { HttpClient } from '../../node_modules/@angular/common/http';
import { Observable } from '../../node_modules/rxjs/observable';
import { environment } from '../environments/environment.prod';
import { Word } from './shared/models/word';

@Injectable()
export class CtestService {

  private host: string;
  private rootPath: string;
  private serviceEndpoint: any;
  private verifyEndpoint: any;

  private ctest$: Observable<any>;

  constructor(private http: HttpClient) {
    this.host = environment.api.url;
    this.rootPath = environment.api.services.gapscheme.root;
    this.serviceEndpoint = environment.api.services.gapscheme.endpoints.service;
    this.verifyEndpoint = environment.api.services.gapscheme.endpoints.verify;
  }

  /**
   * Verifies that the service is running.
   */
  public verify(): Observable<any> {
    const url: string = this.buildURL(this.verifyEndpoint.path);
    const options: object = {
      headers: this.verifyEndpoint.headers,
      responseType: 'text'
    };

    return this.http.get(url, options);
  }

  /**
   * Queries the API for a c-test and stores the result, if successful.
   *
   * @param text The text to be converted to a c-test.
   * @param language The language of the c-test as ISO 639-1 language code string.
   * @return The result of the request.
   */
  public fetchCTest(text: string, language: string): Observable<any> {
    const url: string = this.buildURL(this.serviceEndpoint.path) + `?language=${language}`;
    const options: object = { headers: this.serviceEndpoint.headers };

    this.ctest$ = this.http.post(url, text, options);
    return this.ctest$;
  }

  /**
   * Returns the last c-test that was sucessfully fetched.
   */
  public getCTest(): Observable<{ words: Word[], warnings: string[] }> {
    return this.ctest$;
  }

  private buildURL(endpoint: string): string {
    console.log([this.host, this.rootPath, endpoint].join('/'));
    return [this.host, this.rootPath, endpoint].join('/');
  }
}