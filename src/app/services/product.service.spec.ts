import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProductService, Product } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProduct: Product = {
    id: 1,
    name: 'Fake Product',
    description: 'A sample fake product',
    price: 29.99,
    category: 'electronics',
    imgUrl: 'http://example.com/image.jpg'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch product by ID', () => {
    service.getProductById(1).subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/v1/products/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should fetch all products', () => {
    service.getAll().subscribe(products => {
      expect(products.length).toBe(1);
      expect(products[0].title).toBe('Fake Product');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/v1/products/all');
    expect(req.request.method).toBe('GET');
    req.flush([mockProduct]);
  });

  it('should add a product to cart', () => {
    // Mock localStorage.getItem for user_id and access_token
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'user_id') return '123';
      if (key === 'access_token') return 'fake-token';
      return null;
    });

    const responseMock = { message: 'Added to cart' };

    service.addToCart(1, 2).subscribe(response => {
      expect(response).toEqual(responseMock);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/v1/cart/123/1/2');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    req.flush(responseMock);
  });
});
