import { Component, OnInit, NgZone } from "@angular/core";
import { AuthService } from "../../shared/services/auth.service";
import { Router } from "@angular/router";
import { ModalService } from "src/app/_modal";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { Observable } from "rxjs";

interface Owner {
  uid: string;
  message: string;
  photoURL: string;
  tablearray: { name: string; phone: number; size: number; time: number }[];
}

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  //document observable

  owner: Observable<Owner>;
  ownerData: any;

  customerID: string;
  name: string;
  size: number;
  phone: number;
  time: number;
  message: string;
  contacted: boolean;

  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
    private modalService: ModalService,
    private afs: AngularFirestore
  ) {}
  ngOnInit() {}

  openModal(id: string) {
    this.modalService.open(id);
  }

  clear() {
    this.name = "";
    this.size = null;
    this.phone = null;
  }

  removeparty(id_num, uid) {
    var myList = this.authService.userData.tablearray;

    for (var i = 0; i < myList.length; i++) {
      if (myList[i].time == id_num) {
        myList.splice(i, 1);
        this.authService.SetArrayDetails(uid, myList);
      }
    }
  }

  editParty(id_num, id) {
    var myList = this.authService.userData.tablearray;

    for (var i = 0; i < myList.length; i++) {
      if (myList[i].time == id_num) {
        this.name = myList[i].name;
        this.size = myList[i].size;
        this.phone = myList[i].phone;
        this.time = myList[i].time;
      }
    }
    this.modalService.open("custom-modal-3");
  }

  async sendSMS(phoneNum, uid, name) {
    console.log(
      "normal message in sendSMS: ",
      this.authService.userData.message
    );
    console.log("number", phoneNum);
    var myName = "Hi " + name + ", ";
    var myMessage = this.authService.userData.message;
    console.log(myMessage);
    var myString = myMessage.replace(/\s/g, "%20");
    console.log(myString, phoneNum);

    var myURL =
      "http://35.247.121.174:3000/?message=" +
      myName +
      myString.toString() +
      "&number=1" +
      phoneNum.toString() +
      "&subject=testsubject";
    console.log(myURL);
    var popup = window.open(myURL, "", "width=200, height=200");
    popup.blur();
    window.focus();
    setTimeout(() => {
      popup.close();
    }, 3000);
    //document.getElementById("messagebutton").style.color = "grey"
    var myList = this.authService.userData.tablearray;

    for (var i = 0; i < myList.length; i++) {
      if (myList[i].phone == phoneNum) {
        myList[i].contacted = true;
      }
    }
    this.authService.SetArrayDetails(uid, myList);
  }

  editProfileInfo() {
    this.message = this.authService.userData.message;
    this.modalService.open("editProfile");
  }

  addcustomer(uid) {
    this.modalService.open("custom-modal-2");
  }

  editPartySave(id_num, uid) {
    var numbers = /^[0-9]+$/;
    if (this.name.match(numbers)) {
      alert("Your name must contain letters");
    } else if (typeof this.size !== "number") {
      alert("Party size must be an number");
    } else if (this.phone === null || this.phone.toString().length == 10) {
      var myList = this.authService.userData.tablearray;

      for (var i = 0; i < myList.length; i++) {
        if (myList[i].time == id_num) {
          myList[i].name = this.name;
          myList[i].size = this.size;
          myList[i].phone = this.phone;
          myList[i].time = this.time;
        }
      }
      this.authService.SetArrayDetails(uid, myList);
      this.closeModal("custom-modal-3");
    } else {
      alert("Your phone number must be 10 digits");
    }
  }

  onSave(uid) {
    var numbers = /^[0-9]+$/;
    if (this.name.match(numbers)) {
      alert("Your name must contain letters");
    } else if (typeof this.size !== "number") {
      alert("Party size must be an number");
    } else if (this.phone === null || this.phone.toString().length == 10) {
      var myList = [];
      if (this.authService.userData.tablearray !== undefined) {
        myList = this.authService.userData.tablearray;
      }

      myList.push({
        name: this.name,
        size: this.size,
        phone: this.phone,
        time: Date.now(),
        contacted: false,
      });
      this.authService.SetArrayDetails(uid, myList);
      this.clear();
      this.closeModal("custom-modal-2");
    } else {
      alert("Your phone number must be 10 digits");
    }
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  delete(item, uid) {
    var myList = this.authService.userData.tablearray;

    myList.splice(item, 1);
    this.authService.SetArrayDetails(uid, myList);
  }
}
