import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-support",
  templateUrl: "./support.component.html",
  styleUrls: ["./support.component.css"],
})
export class SupportComponent implements OnInit {
  helpSite: number = 0;
  elementHeight: number;

  constructor() {}

  ngOnInit(): void {}

  changeSite(site: number) {
    this.helpSite = site;
  }
}
