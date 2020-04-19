import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/_modal';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
//import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { timingSafeEqual } from 'crypto';

interface Owner {
  uid: string;
  PIN: number;
  tables: number;
  message: string;
  photoURL: string;
  tablearray: {name: string, phone: number, size:number, time:number }[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  //document observable
  ownerDoc: AngularFirestoreDocument<Owner>;
  owner:Observable<Owner>;
  ownerData: any;


  customerID: string;
  name: string;
  size: number;
  phone: number;
  time: number;
  //myList = [];


  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
    private modalService: ModalService,
    private afs: AngularFirestore,
  ) {
    
}
ngOnInit() {
//myList = this.authService.userData.tablearray


}

openModal(id: string) {
  this.modalService.open(id);
}

clear(){
  this.name = '';
  this.size = null;
  this.phone = null;
}

removeparty(id_num,uid){
  var myList = this.authService.userData.tablearray

  for (var i = 0; i <myList.length; i++){
    if (myList[i].time == id_num){
      myList.splice(i,1);
      this.authService.SetArrayDetails(uid,myList);

    }
  }
}

  editParty(id_num, id) {
    var myList = this.authService.userData.tablearray

    for (var i = 0; i <myList.length; i++){
      if (myList[i].time == id_num){
        this.name =myList[i].name;
        this.size = myList[i].size;
        this.phone = myList[i].phone;
       this.time = myList[i].time;
      }
    }
  this.modalService.open('custom-modal-3');
  }


addcustomer(uid){
this.modalService.open('custom-modal-2');
}

editPartySave(id_num,uid) {
  var myList = this.authService.userData.tablearray

  for (var i = 0; i <myList.length; i++){ 
    if (myList[i].time == id_num){
        myList[i].name= this.name ;
        myList[i].size=this.size;
        myList[i].phone=this.phone;
        myList[i].time=this.time;
      }
    }
    this.authService.SetArrayDetails(uid,myList);
}

onSave(uid){
  var myList = this.authService.userData.tablearray

  myList.push({name:this.name, size:this.size, phone:this.phone,time:Date.now(),})
  this.authService.SetArrayDetails(uid,myList);
}

closeModal(id: string) {
    this.modalService.close(id);
}

delete(item,uid){
  var myList = this.authService.userData.tablearray
  
  myList.splice(item,1);
  this.authService.SetArrayDetails(uid,myList);
}

editDetails() {
  this.ngZone.run(() => {
    this.router.navigate(['user-details']);
  }) 
}
}
