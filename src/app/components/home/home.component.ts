import { Component, OnInit, NgZone } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, public ngZone: NgZone) {}

  ngOnInit() {}

  loginPage() {
    this.ngZone.run(() => {
      this.router.navigate(["sign-in"]);
    });
  }
}
