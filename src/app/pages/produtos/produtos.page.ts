import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { API_CONFIG } from 'src/config/api.config';
import { ProdutoDTO } from 'src/models/produto.dto';
import { ProdutoService } from 'src/services/domain/produto.service';
import { LoadingService } from 'src/services/loading.service';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.page.html',
  styleUrls: ['./produtos.page.scss'],
})
export class ProdutosPage implements OnInit {
  items : ProdutoDTO[] = [];
  categoria_id : string;
  page : number = 0;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public produtoService: ProdutoService,
    public loading: LoadingService
  ) { }

  ngOnInit() {
    this.loadData()
  }

  loadData(){
    this.route.queryParams
      .subscribe(params => {
         this.categoria_id = params.categoria_id
      })

    this.loading.present();
    this.produtoService.findByCategoria(this.categoria_id, this.page, 10)
      .subscribe(response => {

        let start = this.items.length;
        this.items = this.items.concat(response['content']);
        let end = this.items.length - 1;
        this.loadImageUrls(start, end);        
      }, error => {
        this.loading.dismiss();
      })
      this.loading.dismiss();

  }

  loadImageUrls(start: number, end: number) {
    for (var i=0; i < this.items.length; i++) {
      let item = this.items[i]

      this.produtoService.getSmallImageFromBucket(item.id)
        .subscribe(response => {
          item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`
        },
        error => {})
    }
  }

  showDetail(produto_id: string) {
    this.router.navigate(['/produto-detail'], { 
      queryParams: { 
        produto_id: produto_id
      }
    })
  }

  doRefresh(event) {
    this.page = 0;
    this.items = [];
    this.loadData()
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  doInfinite(event) {
    this.page++;
    this.loadData();

    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }


}
