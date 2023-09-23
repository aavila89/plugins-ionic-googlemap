import { Component, ElementRef, ViewChild } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { MapClickCallbackData, Marker } from '@capacitor/google-maps/dist/typings/definitions';
import { IonModal } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  @ViewChild('mapEl', {static: true}) mapEl!: ElementRef;
  @ViewChild('modal', {static: true}) modal!: IonModal;
  map!: GoogleMap;
  marker!: Marker;
  markers!: Marker[];
  markerId!: string;
  constructor() {
    this.markers = [
      {
        title: 'T-Mobile Park',
        snippet: 'Stadium',
        iconUrl: 'assets/icon/marineros.png',
        iconSize: {
          width: 35,
          height: 35
       },
        coordinate: {
          lat: 47.591480,
          lng: -122.332863
        }
      },{
        title: 'Yakima',
        snippet: 'City',
        iconUrl: 'assets/icon/yakima.png',
        iconSize: {
          width: 35,
          height: 35
        },
        coordinate: {
          lat: 46.602070,
          lng: -120.505898
        }
      }
    ];
  }

  ionViewDidEnter() {
    this.createMap();
  }

  async createMap() {
    try {
      this.map = await GoogleMap.create({
        id: 'my-map', // Unique identifier for this map instance
        element: this.mapEl.nativeElement, // reference to the capacitor-google-map element
        apiKey: environment.mapsKey, // Your Google Maps API Key
        forceCreate: true,
        config: {
          center: {
            // The initial position to be rendered by the map
            lat: 46.6254028,
            lng: -121.6353557,
          },
          zoom: 7, // The initial zoom level to be rendered by the map
        },
      });
  
      this.map.setOnMarkerClickListener( async marker => {
        this.markerId = marker.markerId;
        //@ts-ignore
        const filter = this.markers.filter( m => (m.coordinate.lat === marker.latitude) && (m.coordinate.lng === marker.longitude));
        this.marker = filter[0];
        await this.openModal();
      });
  
      this.map.setOnMapClickListener( async marker => {
        await this.addMarker(marker);
      });
  
      await this.addMarkers();
    } catch (error) {
      
    }
  }

  async addMarker(marker: MapClickCallbackData) {
    this.markers.push({
      coordinate: {
        lat: marker.latitude,
        lng: marker.longitude
      },
    });
    this.map.addMarker({
      coordinate: {
        lat: marker.latitude,
        lng: marker.longitude
      },
      draggable: false
    });
  }

  async addMarkers() {
    this.map.addMarkers(this.markers);
  }

  async removeMarket() {
    await this.map.removeMarker(this.markerId);
    await this.modal.dismiss();

    console.log(this.marker);
    console.log(this.markers);
    this.markers = this.markers.filter( m => (m.coordinate.lat !== this.marker.coordinate.lat) 
                                          && (m.coordinate.lng !== this.marker.coordinate.lng));
  }

  async openModal() {
    await this.modal.present();
  }
}
