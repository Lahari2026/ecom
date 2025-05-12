import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductComponent } from './product.component';
import { ProductService, Product } from 'src/app/services/product.service';
import { CartService } from '../services/cart.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: 49.99,
    category: 'electronics',
    imgUrl: 'http://example.com/image.jpg'
  };

  const productServiceStub = {
    getProductById: jasmine.createSpy('getProductById').and.returnValue(of(mockProduct)),
    addToCart: jasmine.createSpy('addToCart').and.returnValue(of({}))
  };

  const cartServiceStub = {
    getCartItemsCount: jasmine.createSpy('getCartItemsCount').and.returnValue(of(2)),
    updateCartItemCount: jasmine.createSpy('updateCartItemCount')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductComponent],
      imports: [FormsModule],
      providers: [
        { provide: ProductService, useValue: productServiceStub },
        { provide: CartService, useValue: cartServiceStub },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } } } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch product on init', () => {
    expect(productServiceStub.getProductById).toHaveBeenCalledWith(1);
    expect(component.product
