import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { PedidoDTO } from "src/models/pedido.dto";

@Component({
  selector: "app-payment",
  templateUrl: "./payment.page.html",
  styleUrls: ["./payment.page.scss"],
})
export class PaymentPage implements OnInit {
  pedido: PedidoDTO;

  parcelas: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  formGroup: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute
  ) {
    this.formGroup = this.formBuilder.group({
      numeroDeParcelas: [1, Validators.required],
      "@type": ["pagamentoComCartao", Validators.required],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.pedido = this.router.getCurrentNavigation().extras.state.pedido;
    });
    console.log(this.pedido);

  }
  
  nextPage(){
    this.pedido.pagamento = this.formGroup.value;

    let navigationExtras : NavigationExtras = {
      state: {
        pedido: this.pedido
      }
    }

    this.router.navigate(['/order-confirmation'], navigationExtras);
  }
}
