import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { API_CONFIG } from 'src/config/api.config';
import { CategoriaDTO } from 'src/models/categoria.dto';
import { CategoriaService } from 'src/services/domain/categoria.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
})
export class CategoriasPage implements OnInit {

  bucketUrl: string = API_CONFIG.bucketBaseUrl;
  items: CategoriaDTO[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public categoriaService : CategoriaService
  ) { }

  ngOnInit() {
    this.categoriaService.findAll()
    .subscribe(resp => {
      this.items = resp
    }, 
    error => {})
  }

  showProdutos(categoria_id: string) {
    this.router.navigate(['/produtos'], 
      {
        queryParams: 
        {
          categoria_id: categoria_id
        }
      })
  }
}
