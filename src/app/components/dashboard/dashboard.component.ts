import { Component } from '@angular/core';
import { SupabaseService } from '../../_services/supabase.service';
import { PokeapiService } from '../../_services/pokeapi.service';
import { PokemonInterface } from '../../_interfaces/pokemon-interface';

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

  kantoPokemons: PokemonInterface[] = [];
  POKEMON_IMAGE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';

  async ngOnInit() {
    const favoritePokemons = await this.supabaseService.getFavoritePokemons();
    const favoritePokemonsIds = favoritePokemons.data?.map((pokemon: any) => pokemon.pokemon)


    this.pokeapiService.getKantoPokemons().subscribe(
      data => {
        data.results.forEach(function(pokemon: any, indice: number) {
          pokemon.imgName = `${indice + 1}.png`;
          pokemon.favorite = false;
          if (favoritePokemonsIds?.includes(pokemon.name)) {
            pokemon.isFavorite = true;
          }
      });
      this.kantoPokemons = data.results;
      }
    );
  }

  async changeFavoriteState(pokemon: PokemonInterface) {
    const indexToUpdate = this.kantoPokemons.findIndex(findPokemon => findPokemon.name === pokemon.name);
    const updatedPokemon = { ...pokemon, isFavorite: !pokemon.isFavorite };
    this.kantoPokemons[indexToUpdate] = updatedPokemon;

    if (updatedPokemon.isFavorite) {
      await this.supabaseService.addFavoritePokemon(updatedPokemon);
    } else {
      await this.supabaseService.removeFavoritePokemon(updatedPokemon);
    }
  }
}
