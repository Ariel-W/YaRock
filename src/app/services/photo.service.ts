import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  // constructor() {}

  // public async addNewToGallery() {
  //   // Take a photo
  //   const capturedPhoto = await Camera.getPhoto({
  //     resultType: CameraResultType.Uri,
  //     source: CameraSource.Camera,
  //     quality: 100,
  //   });
  // }
  base64Image: string;
  selectedFile: File = null;
  downloadURL: Observable<string>;

  constructor(
    // private camera: Camera,
    private storage: AngularFireStorage,
    private toastController: ToastController
  ) {}

  async takePhoto(fileName: string): Promise<boolean> {
    return await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 100,
    }).then(
      (imageData) => {
        // imageData is either a base64 encoded string or a file URI
        this.base64Image = 'data:image/jpeg;base64,' + imageData.base64String;
        this.upload(fileName);
        return true;
      },
      (err) => {
        // Handle error
        console.error(err);
        return false;
      }
    );
  }

  upload(fileName: string): void {
    const file: any = this.base64ToImage(this.base64Image);
    const filePath = `Images/${fileName}`;
    const fileRef = this.storage.ref(filePath);

    const task = this.storage.upload(`Images/${fileName}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe((downloadURL) => {
            if (downloadURL) {
              this.showSuccesfulUploadAlert();
            }
            console.log(downloadURL);
          });
        })
      )
      .subscribe((url) => {
        if (url) {
          console.log(url);
        }
      });
  }

  async showSuccesfulUploadAlert() {
    const toast = await this.toastController.create({
      duration: 3000,
      message: 'התמונה הועלתה בהצלחה',
    });
    toast.present();
  }

  base64ToImage(dataURI) {
    const fileDate = dataURI.split(',');
    // const mime = fileDate[0].match(/:(.*?);/)[1];
    const byteString = atob(fileDate[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: 'image/png' });
    return blob;
  }
}

// export interface MyPhoto {
//   filepath: string;
//   webviewPath: string;
// }
