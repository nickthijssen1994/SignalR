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

  user: string = "Nick";
  message: string = "Hello";
  messages: string[] = [];
  private messageSubject: Subject<any>;
  private hubConnection: HubConnection;
  private socketSubscription: Subscription;
  private serverAddress: string;

  constructor() { }

  ngOnInit(): void {
    this.serverAddress = environment.apiURL + 'chat';
    this.messageSubject = new Subject<any>();
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.serverAddress, {withCredentials: true})
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect()
      .build();
    this.socketSubscription = this.getOutput().subscribe(
      (message) => {
        this.addToList(message);
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

  onSubmit() {
    this.sendInput(this.user, this.message);
  }

  getOutput(): Observable<any[]> {
    return this.messageSubject.asObservable();
  }

  sendInputToServer(user: string, message: string) {
    this.hubConnection.invoke('SendMessage', user, message)
      .catch(err => console.error(err));
  }

  private addServerListener = (outputMessageName: string) => {
    this.hubConnection.on(outputMessageName, (user, message) => {
      this.messageSubject.next(user + " " + message);
    });
  }

  start(): void {
    this.startConnection();
  }

  sendInput(user: string, message: string ): void {
    this.sendInputToServer(user, message);
  }

  addToList(text: any): void {
    this.messages.push(text);
  }
}
