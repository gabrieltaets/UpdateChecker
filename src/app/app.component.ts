import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public URL = 'https://tracking.totalexpress.com.br/poupup_track.php?reid=7118&pedido=0011812007204&nfiscal=139562';
    public innerHtml;

    constructor(public http: HttpClient) {
        this.innerHtml = this.http.get(URL).pipe(
            distinctUntilChanged(),
            tap(() => alert('New update!')))
        );
    }
}
