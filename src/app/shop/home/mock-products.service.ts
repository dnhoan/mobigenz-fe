import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MockProductsService {
  private url = 'https://6213232ef43692c9c6faf54c.mockapi.io/phones';

  constructor(private httpClient: HttpClient) { }

  getProducts() {
    return this.httpClient.get(this.url);
  }
}
