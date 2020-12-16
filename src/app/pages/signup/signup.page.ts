import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, MenuController, NavController } from '@ionic/angular';
import { CidadeDTO } from 'src/models/cidade.dto';
import { EstadoDTO } from 'src/models/estado.dto';
import { CidadeService } from 'src/services/domain/cidade.service';
import { ClienteService } from 'src/services/domain/cliente.service';
import { EstadoService } from 'src/services/domain/estado.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  formGroup: FormGroup
  estados: EstadoDTO[]
  cidades: CidadeDTO[]

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    public formBuilder: FormBuilder,
    public cidadeService: CidadeService,
    public estadoService: EstadoService,
    public clienteService: ClienteService,
    public aletCtrl: AlertController
  ) { 
    this.formGroup = this.formBuilder.group({
      nome: ['Joaquim', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
      email: ['joaquim@gmail.com', [Validators.required, Validators.email]],
      tipo : ['1', [Validators.required]],
      cpfOuCnpj : ['06134596280', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
      password : ['123', [Validators.required]],
      logradouro : ['Rua Via', [Validators.required]],
      numero : ['25', [Validators.required]],
      complemento : ['Apto 3', []],
      bairro : ['Copacabana', []],
      cep : ['10828333', [Validators.required]],
      telefone1 : ['977261827', [Validators.required]],
      telefone2 : ['', []],
      telefone3 : ['', []],
      estadoId : [0, [Validators.required]],
      cidadeId : [null, [Validators.required]]      
    })
  }

  ngOnInit() {
    this.estadoService.findAll()
        .subscribe(response => {
            this.estados = response
            this.formGroup.controls.estadoId.setValue(this.estados[0].id)
            this.updateCidades()
        }, error => console.log(error))

  }
  
  ionViewWillEnter() {
    this.menu.enable(false);
  }

  updateCidades(){
    let estado_id = this.formGroup.value.estadoId
    this.cidadeService.findAll(estado_id)
      .subscribe(response => {
        this.cidades = response
        this.formGroup.controls.cidadeId.setValue(null)
      }, error => console.log(error))
  }

  signupUser(){
    this.clienteService.insert(this.formGroup.value)
      .subscribe(response => {
        this.showInsertOk()
      }, error => {})
  }

  async showInsertOk(){
    let alert = await this.aletCtrl.create({
      header: "Sucesso",
      message: "Cadastro efetuado com sucesso!",
      backdropDismiss: false,
      buttons: [{
        text: "Ok",
        handler: () => {
          this.navCtrl.pop()
        }
      }]
    })
    alert.present()
  }
}
