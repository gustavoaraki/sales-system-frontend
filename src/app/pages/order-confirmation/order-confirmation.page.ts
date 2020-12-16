import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartItem } from 'src/models/cart-item';
import { ClienteDTO } from 'src/models/cliente.dto';
import { EnderecoDTO } from 'src/models/endereco.dto';
import { PedidoDTO } from 'src/models/pedido.dto';
import { CartService } from 'src/services/domain/cart.service';
import { ClienteService } from 'src/services/domain/cliente.service';
import { PedidoService } from 'src/services/domain/pedido.service';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.page.html',
  styleUrls: ['./order-confirmation.page.scss'],
})
export class OrderConfirmationPage implements OnInit {

  pedido: PedidoDTO;
  cartItems:  CartItem[];
  cliente: ClienteDTO;
  endereco: EnderecoDTO;
  codpedido: string;
  
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public cartService: CartService,
    public clienteService: ClienteService,
    public pedidoService: PedidoService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.pedido = this.router.getCurrentNavigation().extras.state.pedido;
    });

    this.cartItems = this.cartService.getCart().items;

    console.log(this.pedido);
    console.log(this.cartItems);

    this.clienteService.findById(this.pedido.cliente.id)
      .subscribe(response => {
        this.cliente = response as ClienteDTO
        this.endereco = this.findEndereco(
          this.pedido.enderecoDeEntrega.id, response['enderecos']
          );
        
      }, error => {
        this.router.navigateByUrl('/home')
      })
  }

  private findEndereco(id: string, list: EnderecoDTO[]): EnderecoDTO {
    let position = list.findIndex(x => x.id == id);

    return list[position];
  }

  total(){
    return this.cartService.total();
  }

  back(){
    this.router.navigateByUrl('/cart')
  }

  home(){
    this.router.navigateByUrl('/categorias')
  }

  checkout(){
    this.pedidoService.insert(this.pedido)
      .subscribe(response => {
        this.cartService.createOrClearCart();
        this.codpedido = this.extractId(response.headers.get('location'))
        console.log(this.codpedido);
      }, error => {
        if (error.status === 403){
          this.router.navigateByUrl('/home')
        }
      })
  }

  private extractId(location: string): string{
    let position = location.lastIndexOf('/');

    return location.substring(position + 1, location.length);

  }
}
