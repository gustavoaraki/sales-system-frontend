import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras } from '@angular/router';
import { EnderecoDTO } from "src/models/endereco.dto";
import { PedidoDTO } from 'src/models/pedido.dto';
import { CartService } from 'src/services/domain/cart.service';
import { ClienteService } from 'src/services/domain/cliente.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: "app-pick-address",
  templateUrl: "./pick-address.page.html",
  styleUrls: ["./pick-address.page.scss"],
})
export class PickAddressPage implements OnInit {
  items: EnderecoDTO[];

  pedido: PedidoDTO;

  constructor(
    public storage: StorageService, 
    public clienteService: ClienteService,
    public cartService: CartService,
    public router: Router
  ) {}

  ngOnInit() {
    let localUser = this.storage.getLocalUser();

    if(localUser && localUser.userName) {
        this.clienteService.findByEmail(localUser.userName)
          .subscribe(response => {
            this.items = response['enderecos'];

            let cart = this.cartService.getCart();

            this.pedido = {
              cliente: {id: response['id']},
              enderecoDeEntrega: null,
              pagamento: null,
              itens: cart.items.map(x => {
                return {
                  quantidade: x.quantidade ,
                  produto: {id: x.produto.id},
                }
              })
            }

          }, error => {
            if(error.status === 403) {
              this.router.navigate(['/home'])
            }
          })
    } else {
      this.router.navigate(['/home'])
    }
  }

  nextPage(item: EnderecoDTO){
    this.pedido.enderecoDeEntrega = {id: item.id};

    let navigationExtras: NavigationExtras = {
      state: {
        pedido: this.pedido
      }
    };

    this.router.navigate(['/payment'], navigationExtras);
  }
}
