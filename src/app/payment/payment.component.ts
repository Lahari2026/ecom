import { Component } from '@angular/core';
import { PaymentService } from '../services/payment.service';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  stripe: Stripe | null = null;
  card: StripeCardElement | null = null;

  constructor(private paymentService: PaymentService, private router: Router) {}

  async ngOnInit() {
    this.stripe = await loadStripe('pk_test_51RH46iIn2b3rLW3blivwnJALwX0kgWHCT0LtVqo9arSt6AqbKueBB0ft0MArUvytaQrLgdtQFGp4NW4CaFbrxtf0002as8cH0d');

    if (this.stripe) {
      const elements = this.stripe.elements();
      this.card = elements.create('card');
      this.card.mount('#card-element');
    }
  }

  async onSubmit() {
    if (this.stripe && this.card) {
      const { paymentMethod, error } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: this.card,
      });

      if (error) {
        console.error(error);
      } else if (paymentMethod) {
        const userId = localStorage.getItem('user_id');
        const access_token = localStorage.getItem('access_token');

        if (userId !== null && access_token !== null) {
          this.paymentService.checkout(userId, access_token, paymentMethod.id).subscribe(
            (response) => {
              alert("Payment successful!");
              this.router.navigate(['/order']);
              console.log(response);
            },
            (error) => {
              console.error(error);
            }
          );
        }
      }
    }
  }
}
