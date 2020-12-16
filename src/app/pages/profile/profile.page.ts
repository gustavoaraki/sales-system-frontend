import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { API_CONFIG } from "src/config/api.config";
import { ClienteDTO } from "src/models/cliente.dto";
import { ClienteService } from "src/services/domain/cliente.service";
import { StorageService } from "src/services/storage.service";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  cliente: ClienteDTO;
  picture: string;
  cameraOn: boolean = false;

  constructor(
    private router: Router,
    private camera: Camera,
    public storage: StorageService,
    public clienteService: ClienteService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    let localUser = this.storage.getLocalUser();

    if (localUser && localUser.userName) {
      this.clienteService.findByEmail(localUser.userName).subscribe(
        (response) => {
          this.cliente = response as ClienteDTO;
          this.getImageIfExists();
        },
        (error) => {
          if (error.status === 403) {
            this.router.navigate(["/home"]);
          }
        }
      );
    } else {
      this.router.navigate(["/home"]);
    }
  }

  getImageIfExists() {
    this.clienteService.getImageFromBucket(this.cliente.id).subscribe(
      (response) => {
        this.cliente.imageUrl = `${API_CONFIG.bucketBaseUrl}/cp${this.cliente.id}.jpg`;
      },
      (error) => {}
    );
  }

  getCameraPicture() {
    this.cameraOn = true;

    const options: CameraOptions = {
      quality: 100,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
    };

    this.camera.getPicture(options).then(
      (imageData) => {
        this.picture = "data:image/png;base64," + imageData;
        this.cameraOn = false;
      },
      (err) => {
        this.cameraOn = false;
      }
    );
  }

  getGalleryPicture() {
    this.cameraOn = true;

    const options: CameraOptions = {
      quality: 100,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
    };

    this.camera.getPicture(options).then(
      (imageData) => {
        this.picture = "data:image/png;base64," + imageData;
        this.cameraOn = false;
      },
      (err) => {
        this.cameraOn = false;
      }
    );
  }

  sendPicture() {
    this.clienteService.uploadPicture(this.picture).subscribe(
      (response) => {
        this.picture = null;
        this.loadData();
      },
      (error) => {}
    );
  }

  cancel() {
    this.picture = null;
  }
}
