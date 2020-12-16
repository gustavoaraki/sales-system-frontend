import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { API_CONFIG } from 'src/config/api.config';
import { CartItem } from 'src/models/cart-item';
import { ProdutoDTO } from 'src/models/produto.dto';
import { CartService } from 'src/services/domain/cart.service';
import { ProdutoService } from 'src/services/domain/produto.service';
import { LoadingService } from 'src/services/loading.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  items: CartItem[];

  constructor(
    public produtoService: ProdutoService,
    public cartService: CartService,
    public loading: LoadingService,
    public router: Router
  ) { }

  ngOnInit() {
    this.loadData()
  }

  loadData(){
    this.loading.present();
    this.loading.dismiss();
    let cart = this.cartService.getCart();
    this.items = cart.items;
    this.loadImageUrls();
  }

  loadImageUrls() {
    for (var i=0; i < this.items.length; i++) {
      let item = this.items[i]

      this.produtoService.getSmallImageFromBucket(item.produto.id)
        .subscribe(response => {
          item.produto.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.produto.id}-small.jpg`
        },
        error => {})
    }
  }

  removeItem(produto: ProdutoDTO){
    this.items = this.cartService.removeProduto(produto).items;
  }

  increaseQuantity(produto: ProdutoDTO){
    this.items = this.cartService.increaseQuantity(produto).items;
  }

  decreaseQuantity(produto: ProdutoDTO){
    this.items = this.cartService.decreaseQuantity(produto).items;
  }

  total(): number {
    return this.cartService.total();
  }

  goOn(){
    this.router.navigate(['/categorias'])
  }

  checkout() {
    this.router.navigate(['/pick-address'])
  }

  doRefresh(event) {
    this.loadData()
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

}
