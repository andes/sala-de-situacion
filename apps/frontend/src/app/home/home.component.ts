import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class AppHomeComponent implements OnInit {

  public url = "";
  urlSafe: SafeResourceUrl;

  constructor(public sanitizer: DomSanitizer) {

  }


  ngOnInit() {
    const chart = 'e2800c81-cc72-41c6-a7e7-07dc80acf2a2';
    const tenant = 'a9672a8c-ba22-4076-9434-24ca28422f56'
    this.url = `${environment.charts_embedding_base_url}/embed/charts?id=${chart}&tenant=${tenant}&autorefresh=300&attribution=false&theme=light`;

    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }




}
