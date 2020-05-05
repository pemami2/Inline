import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/_modal';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
//import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { stringify } from 'querystring';



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
  
  owner:Observable<Owner>;
  ownerData: any;


  customerID: string;
  name: string;
  size: number;
  phone: number;
  time: number;
  PIN: number;
  tables: number;
  message: string;
  contacted: boolean;
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

async sendSMS(phoneNum,uid, name){
  console.log("normal message in sendSMS: ", this.authService.userData.message)
  console.log("number" ,phoneNum)
  var myName = "Hi " + name +", "
  var myMessage = this.authService.userData.message
  var myString = myMessage.replace(/\s/g,"%20")
  console.log(myString, phoneNum)
  /*
var myURL = "https://l.messenger.com/l.php?u=http%3A%2F%2F34.83.12.149%3A3000%2F%3Fmessage%3D" + myString.toString() + "%26number%3D1" + phoneNum.toString() + "%26subject%3Dtestsubject&h=AT1SxNwPYMapsR0C4DoKSKqDxY_ePFmpnMPIXQ462QN5SxVxU73_FD-oX-hqvR2Am5eqpueP5MYRAug3KYdHW_Jos8PEfFGFK2sMumXCpnY-ve6vehpXAcQo_bkATvIeIsFfJQ"
console.log("message with no spaces: " , myURL) 
var myWindow = window.open(myURL, "", "width=500, height=500")*/
 //myWindow.document.write("<p> Your message has been sent!</p>")
 /*await fetch('https://l.messenger.com/l.php?u=http%3A%2F%2F34.83.12.149%3A3000%2F%3Fmessage%3DLike%2520a%2520wang%2520bang%2520wang%26number%3D19495376842%26subject%3Dtestsubject&h=AT1SxNwPYMapsR0C4DoKSKqDxY_ePFmpnMPIXQ462QN5SxVxU73_FD-oX-hqvR2Am5eqpueP5MYRAug3KYdHW_Jos8PEfFGFK2sMumXCpnY-ve6vehpXAcQo_bkATvIeIsFfJQ')
.then(response => {
  return response.text();
}).then(data => {
  console.log("message", data)
})
*/
var myURL = 'http://35.247.121.174:3000/?message=' + myName + myString.toString() + '&number=1' + phoneNum.toString() + '&subject=testsubject'
console.log(myURL)
var popup = window.open(myURL, "", "width=200, height=200")
popup.blur()
window.focus();
setTimeout(() => {popup.close();}, 3000);
//document.getElementById("messagebutton").style.color = "grey"
var myList = this.authService.userData.tablearray

for (var i = 0; i <myList.length; i++){ 
  if (myList[i].phone == phoneNum){
      myList[i].contacted= true ;
    }
  }
  this.authService.SetArrayDetails(uid,myList);


}

editProfileInfo() {
  this.tables = this.authService.userData.tables
  this.PIN = this.authService.userData.PIN
  this.message = this.authService.userData.message
  this.modalService.open('editProfile')
}

addcustomer(uid){
this.modalService.open('custom-modal-2');
}

editPartySave(id_num,uid) {
  var numbers = /^[0-9]+$/;
  if (this.name.match(numbers)) {
   alert("Your name must contain letters")
 } else if ( typeof this.size !== 'number') {
   alert("Party size must be an number")

 }else if (this.phone === null ||this.phone.toString().length == 10){ 
   
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
      this.closeModal('custom-modal-3');
 }else{
  alert("Your phone number must be 10 digits")
  }
}

onSave(uid){

  var numbers = /^[0-9]+$/;
   if (this.name.match(numbers)) {
    alert("Your name must contain letters")

  } else if ( typeof this.size !== 'number') {
    alert("Party size must be an number")

  }else if (this.phone === null ||this.phone.toString().length == 10   ){ 
    
    var myList = []
    if (this.authService.userData.tablearray !== undefined) {
      myList = this.authService.userData.tablearray
    }

    myList.push({name:this.name, size:this.size, phone:this.phone, time:Date.now(), contacted: false})
    this.authService.SetArrayDetails(uid,myList);
    this.clear()
    this.closeModal('custom-modal-2')
  }
    else{
      alert("Your phone number must be 10 digits")
   
  }
  
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
