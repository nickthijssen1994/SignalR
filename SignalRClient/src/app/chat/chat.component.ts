import { Component, OnInit } from '@angular/core';
import {Observable, Subject, Subscription} from "rxjs";
import {HubConnection} from "@microsoft/signalr";
import {environment} from "../../environments/environment";
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private message: Subject<any>;
  private hubConnection: HubConnection;
  private socketSubscription: Subscription;
  private serverAddress: string;

  constructor() { }

  ngOnInit(): void {

    this.serverAddress = environment.apiURL + 'chat';
    this.message = new Subject<any>();
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.serverAddress).withAutomaticReconnect()
      .build();
    this.socketSubscription = this.getOutput().subscribe(
      (message) => {

      });
    this.start();
  }

  startConnection = () => {
    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started');
        this.addServerListener('ReceiveMessage');
      })
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  getOutput(): Observable<any[]> {
    return this.message.asObservable();
  }

  sendInputToServer(input: any) {
    this.hubConnection.invoke('SendMessage', input)
      .catch(err => console.error(err));
  }

  private addServerListener = (outputMessageName: string) => {
    this.hubConnection.on(outputMessageName, (data) => {
      this.message.next(data);
    });
  }

  start(): void {
    this.startConnection();
  }

  sendInput(input: any): void {
    this.sendInputToServer(input);
  }
}
