import { Component, OnInit,Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-photo-modal',
  templateUrl: './photo-modal.page.html',
  styleUrls: ['./photo-modal.page.scss'],
})
export class PhotoModalPage implements OnInit {
  @Input() photoUrl: string = '';
  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }
  
  closeModal() {
    this.modalController.dismiss();
  }
  
  async enlargePhoto(photoUrl: string) {
    const modal = await this.modalController.create({
      component: PhotoModalPage,
      componentProps: {
        photoUrl: photoUrl
      }
    });
    return await modal.present();
  }
}
