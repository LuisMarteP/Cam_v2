import { Component } from '@angular/core';
//Importaciones para usar la camara
import { Plugins } from '@capacitor/core';
import { CameraResultType, CameraSource } from '@capacitor/camera';
import { PhotoModalPage } from '../photo-modal/photo-modal.page';

import { ModalController } from '@ionic/angular';
//Importaciones para el uso del Bluetooth
import { BleClient } from '@capacitor-community/bluetooth-le';
//Compartir
import { Directory,FileWriteOptions } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

const { Camera, Filesystem, Share } = Plugins;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
//Variables
  photos: string[] = [];
  selectedPhotos: string[] = []; //arreglo para las fotos seleccionadas
  isSelecting: boolean = false; //Para controlar si se está en modo selección
  photoUrl: string = '';

  constructor(private modalController: ModalController) { }

//Tomar Foto
async takePicture() {
  try {
    const image = await (Camera['getPhoto'])({
      quality: 90,
      source: CameraSource.Camera,
      resultType: CameraResultType.Uri
    });
    const savedImageFile = await this.saveImageToDevice(image.path);
    if (savedImageFile) {
      this.photos.push(savedImageFile.uri); // Agregar la ruta de la foto a la lista de fotos
    }
  } catch (error) {
    console.error('Error al tomar la foto:', error);
  }
  }
//Guardar Imagen
async saveImageToDevice(imagePath: string): Promise<any> {
  try {
    const file = await (Filesystem['readFile'] as any)({
      path: imagePath
    });

    const fileName = `shared_image_${new Date().getTime()}.jpeg`;
    const savedImageFile = await (Filesystem['writeFile'] as any)({
      path: fileName,
      data: file.data,
      directory: Directory.Cache,
      recursive: true
    });

    return savedImageFile;
  } catch (error) {
    console.error('Error al guardar la imagen:', error);
    return null;
  }
}
  toggleSelectMode() {
    this.isSelecting = !this.isSelecting;
    if (!this.isSelecting) {
      this.selectedPhotos = []; // Limpiar fotos seleccionadas al salir del modo selección
    }
  }
//Selecionar fotos
  selectPhoto(photo: string) {
    if (this.isSelecting) {
      const index = this.selectedPhotos.indexOf(photo);
      if (index === -1) {
        this.selectedPhotos.push(photo);
      } else {
        this.selectedPhotos.splice(index, 1);
      }
    } else {
      this.enlargePhoto(photo); // Llama a la función para agrandar la imagen cuando no estás en modo de selección
    }
  }
//Borrar Fotos
  deleteSelectedPhotos() {
    this.photos = this.photos.filter(photo => !this.selectedPhotos.includes(photo));
    this.selectedPhotos = []; // Limpiar fotos seleccionadas después de eliminar
    this.isSelecting = false; // Salir del modo selección después de eliminar
  }
//Agrandar la Foto
  async enlargePhoto(photoUrl: string) {
    const modal = await this.modalController.create({
      component: PhotoModalPage,
      componentProps: {
        photoUrl: photoUrl
      }
    });
    return await modal.present();
  }
//Compartir 
async sharePhotos() {
  if (this.selectedPhotos.length === 0) {
    // No hay fotos seleccionadas para compartir
    return;
  }
  const sharePromises = this.selectedPhotos.map(async photo => {
    try {
      const shareResult = await (Share['share'] as any)({
        title: 'Compartir foto',
        text: '¡Mira esta foto!',
        files: [photo],
        dialogTitle: 'Compartir'
      });

      console.log('Foto compartida con éxito:', shareResult);
    } catch (error) {
      console.error('Error al compartir la foto:', error);
    }
  });

  await Promise.all(sharePromises);
  }

  handleImageError(event: any) {
    // Handle image loading errors here
    console.log('Image loading error:', event);
    // You could set a placeholder image or handle the error differently
  }
  
}