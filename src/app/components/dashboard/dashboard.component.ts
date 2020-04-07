import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/_modal';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
//import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/services/user';
import { userInfo } from 'os';
import { stringify } from 'querystring';
import { firestore, database } from 'firebase';
import { map } from 'rxjs/operators';

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
  // by collection:
  //OwnersCollection: AngularFirestoreCollection<Owner>;
  //Owners: Observable<Owner[]>;

  //by document: 
  ownerDoc: AngularFirestoreDocument<Owner>;
  owner:Observable<Owner>;
  snapshot: any;


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
    //var element = document.getElementById()
    //console.log(element)
    //this.showData()
  this.ShowDoc()

    

  }

  ShowDoc() {
    var myUID = this.authService.userData.uid
    var path = 'users/' + myUID
    this.ownerDoc = this.afs.doc(path)
    this.owner = this.ownerDoc.valueChanges()
    this.owner.subscribe(x => {
      //console.log(x)
      //console.log(x.uid)
      //console.log(x.tables)
      //console.log(x.message)
      //console.log(x.tablearray)
      //for (var i= 0; i<x.tablearray.length; i++){
      //  this.myList.push(x.tablearray[i])
    //  }
      //console.log(x.tablearray[0].time)
      
    })

  
    

  }

  /*showData(){
    var myUID = this.authService.userData.uid
    console.log(myUID)
    this.OwnersCollection = this.afs.collection('users', ref => {
      return ref.where('uid', '==', myUID )
    });
    this.Owners = this.OwnersCollection.valueChanges()
  }*/


openModal(id: string) {
  this.modalService.open(id);
}

clear(){
  this.name = '';
  this.size = null;
  this.phone = null;

}

removeparty(id_num,uid){
  this.myList=[];
  var myUID = this.authService.userData.uid
  var path = 'users/' + myUID
  this.ownerDoc = this.afs.doc(path)
  this.owner = this.ownerDoc.valueChanges()
  this.owner.subscribe(x => {
    console.log(x.tablearray)

    for (var i= 0; i<x.tablearray.length; i++){
      
      this.myList.push({name:x.tablearray[i].name, size:x.tablearray[i].size, phone:x.tablearray[i].phone,time:x.tablearray[i].time,})
      
   }
   console.log(this.myList)
   this.deleteParty(id_num,uid)
})

}

deleteParty(id_num,uid) {


  for (var i = 0; i <this.myList.length; i++){
    if (this.myList[i].time == id_num){
      this.myList.splice(i,1);
      this.authService.SetArrayDetails(uid,this.myList);

    }
  }
}

  editParty(id_num, id) {
    this.myList=[];
    var myUID = this.authService.userData.uid
    var path = 'users/' + myUID
    this.ownerDoc = this.afs.doc(path)
    this.owner = this.ownerDoc.valueChanges()
    this.owner.subscribe(x => {
      console.log(x.tablearray)

      for (var i= 0; i<x.tablearray.length; i++){
        
        this.myList.push({name:x.tablearray[i].name, size:x.tablearray[i].size, phone:x.tablearray[i].phone,time:x.tablearray[i].time,})
        
     }
     console.log(this.myList)

    for (var i = 0; i <x.tablearray.length; i++){
     
      if (x.tablearray[i].time == id_num){
        this.name = x.tablearray[i].name;
        this.size = x.tablearray[i].size;
        this.phone = x.tablearray[i].phone;
       this.time = x.tablearray[i].time;
      }
    }
  })
 
  this.modalService.open('custom-modal-3');
  }


addcustomer(uid){
  this.myList=[];
  var myUID = this.authService.userData.uid
  var path = 'users/' + myUID
  this.ownerDoc = this.afs.doc(path)
  this.owner = this.ownerDoc.valueChanges()
  this.owner.subscribe(x => {
    console.log(x.tablearray)

    for (var i= 0; i<x.tablearray.length; i++){
      
      this.myList.push({name:x.tablearray[i].name, size:x.tablearray[i].size, phone:x.tablearray[i].phone,time:x.tablearray[i].time,})
      
   }
   console.log(this.myList)

  
})

this.modalService.open('custom-modal-2');
}





  editPartySave(id_num,uid) {
    console.log(this.myList)

   



    for (var i = 0; i <this.myList.length; i++){
     
      if (this.myList[i].time == id_num){
        this.myList[i].name= this.name ;
        this.myList[i].size=this.size;
        this.myList[i].phone=this.phone;
        this.myList[i].time=this.time;
      }
    }
    this.authService.SetArrayDetails(uid,this.myList);
    this.myList=[];

  
  
      

    
  }



getInfo() {
  /*for (let i in this.myList){
    var party ={
    name : this.myList[i].name,
    size : this.myList[i].size,
    phone : this.myList[i].phone,

  };
}*/

  
  for (let i in this.myList){
    var currPerson = this.myList[this.myList.length-1];
   document.write(this.myList[currPerson]);
  }
  

}


onSave(uid){
  this.myList.push({name:this.name, size:this.size, phone:this.phone,time:Date.now(),})
  this.authService.SetArrayDetails(uid,this.myList);
  

  this.myList=[];

}
closeModal(id: string) {
    this.modalService.close(id);

}
delete(item,uid){
  this.myList=[];
  var myUID = this.authService.userData.uid
  var path = 'users/' + myUID
  this.ownerDoc = this.afs.doc(path)
  this.owner = this.ownerDoc.valueChanges()
  this.owner.subscribe(x => {
    console.log(x.tablearray)

    for (var i= 0; i<x.tablearray.length; i++){
      
      this.myList.push({name:x.tablearray[i].name, size:x.tablearray[i].size, phone:x.tablearray[i].phone,time:x.tablearray[i].time,})
      
   }
   console.log(this.myList)
})
this.removeItem(item,uid)
}
removeItem(item,uid){
  this.myList.splice(item,1);
  this.authService.SetArrayDetails(uid,this.myList);
  this.myList=[];
}









  editDetails() {
    this.ngZone.run(() => {
      this.router.navigate(['user-details']);
    }) 
  }
}
