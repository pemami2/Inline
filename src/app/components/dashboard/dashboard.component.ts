import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/_modal';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
//import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

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
  myList = [];

  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
    private modalService: ModalService,
    private afs: AngularFirestore,
  ) {

}
ngOnInit() {
  var myUID = this.authService.userData.uid
  var path = 'users/' + myUID
  this.ownerDoc = this.afs.doc(path)
  this.owner = this.ownerDoc.valueChanges()
  this.owner.subscribe(x => {
    
    if (x) {
      this.ownerData = x;
      localStorage.setItem('owner', JSON.stringify(this.ownerData));
      JSON.parse(localStorage.getItem('owner'));
    }
    else {
      localStorage.setItem('owner', null);
      JSON.parse(localStorage.getItem('owner'));
    }
    console.log("ownerData: ", this.ownerData.tablearray)
    console.log("done")
    this.myList = x.tablearray
    
  })


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
  for (var i = 0; i <this.myList.length; i++){
    if (this.myList[i].time == id_num){
      this.myList.splice(i,1);
      this.authService.SetArrayDetails(uid,this.myList);

    }
  }
}

  editParty(id_num, id) {

    for (var i = 0; i <this.myList.length; i++){
      if (this.myList[i].time == id_num){
        this.name =this.myList[i].name;
        this.size = this.myList[i].size;
        this.phone = this.myList[i].phone;
       this.time = this.myList[i].time;
      }
    }
  this.modalService.open('custom-modal-3');
  }


addcustomer(uid){
this.modalService.open('custom-modal-2');
}

editPartySave(id_num,uid) {

  for (var i = 0; i <this.myList.length; i++){ 
    if (this.myList[i].time == id_num){
        this.myList[i].name= this.name ;
        this.myList[i].size=this.size;
        this.myList[i].phone=this.phone;
        this.myList[i].time=this.time;
      }
    }
    this.authService.SetArrayDetails(uid,this.myList);
}

onSave(uid){
  this.myList.push({name:this.name, size:this.size, phone:this.phone,time:Date.now(),})
  this.authService.SetArrayDetails(uid,this.myList);
}

closeModal(id: string) {
    this.modalService.close(id);
}

delete(item,uid){
  this.myList.splice(item,1);
  this.authService.SetArrayDetails(uid,this.myList);
}

editDetails() {
  this.ngZone.run(() => {
    this.router.navigate(['user-details']);
  }) 
}
}
