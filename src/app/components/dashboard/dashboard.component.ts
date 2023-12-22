import { Component } from '@angular/core';
import { PokeapiService } from '../../pokeapi.service';
import { SupabaseService } from '../../_services/supabase.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  constructor(
    private pokeapiService: PokeapiService,
    private supabaseService: SupabaseService
  ) {}

  kantoPokemons: any;
  POKEMON_IMAGE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';

  ngOnInit() {
    this.pokeapiService.getKantoPokemons().subscribe(
      data => {
        data.results.forEach(function(pokemon: any, indice: number) {
          pokemon.id = indice + 1;
          pokemon.imgName = `${indice + 1}.png`;
          pokemon.favorite = false;
      });
      console.log(data.results)
      this.kantoPokemons = data.results;
      }
    );
  }

  async changeFavoriteState(pokemon: any) {
    const updatedPokemon = { ...this.kantoPokemons[pokemon.id - 1], isFavorite: !pokemon.isFavorite };
    this.kantoPokemons[pokemon.id - 1] = updatedPokemon;

    if (updatedPokemon.isFavorite) {
      await this.supabaseService.addFavoritePokemon(updatedPokemon.id);
    } else {
      await this.supabaseService.removeFavoritePokemon(updatedPokemon.id);
    }
  }
}
