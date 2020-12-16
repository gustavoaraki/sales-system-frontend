import { Injectable } from "@angular/core";
import { LoadingController } from "@ionic/angular";

@Injectable()
export class LoadingService {
  isLoading = false;
  loading: any;

  constructor(public loadingController: LoadingController) {}

  async present() {
    this.isLoading = true;
    return await this.loadingController
      .create({
        message: "Aguarde...",
      })
      .then((a) => {
        a.present().then(() => {
          if (!this.isLoading) {
            a.dismiss().then(() => {});
          }
        });
      });
  }

  async dismiss() {
    this.isLoading = false;
  }
}
