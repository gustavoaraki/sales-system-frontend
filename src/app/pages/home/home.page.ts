import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular'
import { CredenciaisDTO } from 'src/models/credenciais.dto';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public folder: string;

  creds : CredenciaisDTO = {
    userName: "",
    password: ""
  };

  constructor( 
    private router: Router , 
    public menu: MenuController,
    public auth: AuthService,
    ) {} 

  ngOnInit() {}

  ionViewWillEnter() {
    this.menu.enable(false);

    this.auth.refreshToken()
    .subscribe(response => {
      this.auth.successfulLogin(response.headers.get('Authorization'))
      this.router.navigate(['/categorias'])
    },
    error => {})
  }

  ionViewDidLeave() {
    this.menu.enable(true);
  }

  login() {
    this.auth.authenticate(this.creds)
      .subscribe(response => {
        this.auth.successfulLogin(response.headers.get('Authorization'))
        this.router.navigate(['/categorias'])
      },
      error => {})
  }

  signup(){
    this.router.navigate(['/signup'])
  }
}
