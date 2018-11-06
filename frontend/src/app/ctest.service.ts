import { Injectable, OnInit, RendererFactory2 } from '@angular/core';
import { HttpClient, HttpHeaders } from '../../node_modules/@angular/common/http';
import { Observable } from '../../node_modules/rxjs/observable';
import { environment } from '../environments/environment';
import { Word } from './shared/models/word';

@Injectable()
export class CtestService {

  private host: string;
  private rootPath: string;
  private serviceEndpoint: any;
  private partialEndpoint: any;
  private updateGapEndpoint: any;
  private verifyEndpoint: any;

  private langIdRootPath: string;
  private langIdEndpoint: any;
  private langIdVerifyEndpoint: any;

  private ctest$: Observable<any>;
  private language: string;

  constructor(private http: HttpClient) {
    this.host = environment.api.url;
    this.rootPath = environment.api.services.gapscheme.root;
    this.serviceEndpoint = environment.api.services.gapscheme.endpoints.service;
    this.partialEndpoint = environment.api.services.gapscheme.endpoints.partial;
    this.updateGapEndpoint = environment.api.services.gapscheme.endpoints.updateGaps;
    this.verifyEndpoint = environment.api.services.gapscheme.endpoints.verify;

    this.langIdRootPath = environment.api.services.langid.root;
    this.langIdEndpoint = environment.api.services.langid.endpoints.service;
    this.langIdVerifyEndpoint = environment.api.services.langid.endpoints.verify;
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
   * Queries the API for a C-Test and stores the result, if successful.
   *
   * @param text The text to be converted to a c-test.
   * @param language The language of the c-test as ISO 639-1 language code string.
   * @return The result of the request as an observable.
   */
  public fetchCTest(text: string, language: string): Observable<any> {
    const url: string = this.buildURL(this.serviceEndpoint.path) + `?language=${language}`;
    const options: object = { headers: this.serviceEndpoint.headers };

    this.language = language;
    this.ctest$ = this.http.post(url, text, options);
    return this.ctest$;
  }

  /**
   * Queries the API for a partial C-Test and stores the result, if successful.
   *
   * @param text The text to be converted to a c-test.
   * @param language The language of the c-test as ISO 639-1 language code string.
   * @return The result of the request as an observable.
   */
  public fetchPartialCTest(text: string, language: string, gapFirst: boolean): Observable<any> {
    const url: string = this.buildURL(this.partialEndpoint.path) + `?language=${language}&gapfirst=${gapFirst}`;
    const options: object = { headers: this.serviceEndpoint.headers };

    this.language = language;
    this.ctest$ = this.http.post(url, text, options);
    return this.ctest$;
  }

  /**
   * Queries the API for an update of the gap status of the given tokens.
   *
   * @param tokens The c-test tokens to be updated.
   * @param gapFirst Whether the first token should be gapped or not.
   * @return The result of the request as an observable.
   */
  public fetchUpdatedGaps(tokens: Word[], gapFirst: boolean): Observable<any> {
    const url: string = [
      this.host,
      this.rootPath,
      this.updateGapEndpoint.path + `?gapfirst=${gapFirst}`
    ].join('/')
    const options = this.updateGapEndpoint.options;

    return this.http.post(url, tokens);
  }

  /**
   * Returns the last c-test that was sucessfully fetched.
   */
  public getCTest(): Observable<{ words: Word[], warnings: string[] }> {
    return this.ctest$;
  }
  /**
   * Returns the language that was most recently queried or identified for a c-test.
   */
  public getLanguage() {
    return this.language;
  }

  /**
   * Sends the given text to the language identification service and stores the result.
   */
  public identifyLanguage(text: string): Observable<any> {
    const url: string = [
      this.host,
      this.langIdRootPath,
      this.langIdEndpoint.path
    ].join('/');
    const options: object = this.langIdEndpoint.options;
    return this.http.post(url, text, options);
  }

  private buildURL(endpoint: string): string {
    console.log([this.host, this.rootPath, endpoint].join('/'));
    return [this.host, this.rootPath, endpoint].join('/');
  }
}
