import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const POKEAPI_API = 'https://pokeapi.co/api/v2/';

@Injectable({
  providedIn: 'root'
})
export class PokeapiService {
  constructor(private httpClient: HttpClient) {}

  getKantoPokemons(): Observable<any> {
    const kantoPokemons = this.httpClient.get(
      POKEAPI_API + 'pokemon?limit=151'
    );
    return kantoPokemons;
  }
}
