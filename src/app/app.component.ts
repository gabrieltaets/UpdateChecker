import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { interval, concat, of, throwError } from 'rxjs';
import { distinctUntilChanged, tap, mergeMap, map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public LOCAL = `http://localhost:8080`;
    public URL = 'https://tracking.totalexpress.com.br/poupup_track.php?reid=7118&pedido=0011812007204&nfiscal=139562';
    public innerHtml;
    public url: string;
    public time = 1;
    public error: string;

    @ViewChild('notification') notification;

    constructor(public http: HttpClient, public sanitizer: DomSanitizer) {
        Notification.requestPermission();
    }

    start() {
        if(!this.url || this.url.length === 0) return this.error = 'Url is required.';
        if(!this.time || this.time <= 0) return this.error = 'Invalid interval.';
        if(Notification.permission === 'denied') {
            Notification.requestPermission().then(() => this.notify());
        }
        else this.notify();
    }

    notify() {
        let request = this.http.get(this.url, {responseType: 'text'});
        this.innerHtml = concat(of(0), interval(this.time*1000)).pipe(
            mergeMap(() => request),
            distinctUntilChanged(),
            map(html => {
                // this.notification.nativeElement.play();
                // this.error = undefined;
                let n = new Notification('New Update!');
                return this.sanitizer.bypassSecurityTrustHtml(html);
            }),
            catchError(err => {
                this.error = err.message;
                return throwError(err);
            }),
        );
    }
}
