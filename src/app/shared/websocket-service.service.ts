import { Injectable } from '@angular/core';
//import { Socket } from 'ngx-socket-io';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class WebsocketServiceService {
  public socket: Socket;
  public wsSubject: WebSocketSubject<any>;
  constructor() {
    this.connect('ws://localhost:8089');
    // this.socket = new WebSocket('ws://localhost:8080/socket.io/socket.io.js');
    // this.socket = io('ws://localhost:8080/socket.io/socket.io.js');
  }
  // connect() {
  //   // this.socket.connect();
  // }

  // sendMessage(message: string): void {
  //   this.socket.emit('message', message);
  // }

  // // Method to receive messages from the WebSocket server
  // receiveMessages(): Observable<string> {
  //   return new Observable<string>(observer => {
  //     this.socket.on('message', (data: string) => {
  //       observer.next(data);
  //     });
  //   });
  // }

  // send(data: any) {
  //   this.socket.emit('message', data);
  // }

  // // Receive messages from the WebSocket server
  // receive(): Observable<any> {
  //   return this.socket.fromEvent('message');
  // }
  // sendMessage(message: string) {
  //   this.socket.send(message);
  // }

  // receiveMessages(callback: (message: string) => void) {
  //   this.socket.onmessage = (event) => {
  //     callback(event.data);
  //   };
  // }




  // connect(url: string): void {
  //   this.wsSubject = webSocket({
  //     url: url,
  //     deserializer: msg => msg, // Optional: Customize message deserialization
  //     // Optional: Customize message serialization
  //   });
  // }

  // sendMessage(message: any): void {
  //   if (this.wsSubject) {
  //     this.wsSubject.next(message);
  //   }
  // }

  // receiveMessages() {
  //   return this.wsSubject.asObservable();
  // }
  public connect(url: string): void {
    this.wsSubject = webSocket(url);
  }

  public sendMessage(message: any): void {
    if (this.wsSubject) {
      console.log('here')
      this.wsSubject.next(message);
    }
  }

  receiveMessages() {
    return this.wsSubject.asObservable();
  }
}
