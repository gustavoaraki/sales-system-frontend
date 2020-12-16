import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { AlertController } from '@ionic/angular';
import { throwError, Observable } from 'rxjs'
import { catchError } from 'rxjs/operators';
import { FieldMessage } from 'src/models/fieldmessage';
import { StorageService } from 'src/services/storage.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(public storage: StorageService, public alertCtrl: AlertController) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): 
    Observable<HttpEvent<any>>{
        return next.handle(req)
            .pipe(
                catchError((error, caught) =>{
                    let errorObj = error;

                    if (errorObj.error){
                        errorObj = errorObj.error
                    }

                    if(!errorObj.status){
                        errorObj = JSON.parse(errorObj)
                    }

                    console.log("Erro detectado pelo interceptor!")
                    console.log(errorObj)

                    switch (errorObj.status) {
                        case 401:
                            this.handle401()
                            break   
                        case 403:
                            this.handle403()
                            break
                        case 422:
                            this.handle422(errorObj)
                            break
                        
                        default:
                            this.handleDefaultError(errorObj)
                    }

                    return throwError(errorObj);
                })
            ) 
    }

    handle403() {
        this.storage.setLocalUser(null)
    }

    async handle401() {
        let alert = await this.alertCtrl.create({
            header: 'Erro 401: Falha de autenticação',
            message: 'Email ou senha incorretos',
            backdropDismiss : false,
            buttons: [
                {text: 'Ok'}
            ]
        })
        await alert.present()
    }

    async handle422(errorObj){
        let alert = await this.alertCtrl.create({
            header: "Erro 422: Validação",
            message: this.listErrors(errorObj.listErrors),
            backdropDismiss : false,
            buttons: [
                {text: 'Ok'}
            ]
        })
        await alert.present()
    }

    async handleDefaultError(errorObj){
        let alert = await this.alertCtrl.create({
            header: 'Erro ' + errorObj.status +':' + errorObj.error,
            message: errorObj.message,
            backdropDismiss : false,
            buttons: [
                {text: 'Ok'}
            ]
        })
        await alert.present()
    }

    private listErrors(messages : FieldMessage[]) : string {
        let s : string = '';
        for (var i=0; i<messages.length; i++) {
            s = s + '<p><strong>' + messages[i].fieldName + "</strong>: " + messages[i].message + '</p>';
        }
        return s;
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
}