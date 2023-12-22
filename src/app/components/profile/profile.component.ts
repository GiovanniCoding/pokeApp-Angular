import { Component } from '@angular/core';
import { PokeapiService } from '../../_services/pokeapi.service';
import { SupabaseService } from '../../_services/supabase.service';
import { PokemonInterface } from '../../_interfaces/pokemon-interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  constructor(
    private pokeapiService: PokeapiService,
    private supabaseService: SupabaseService
  ) {}

  kantoPokemons: PokemonInterface[] = [];
  POKEMON_IMAGE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';

  async ngOnInit() {
    const favoritePokemons = await this.supabaseService.getFavoritePokemons();
    const favoritePokemonsNames = favoritePokemons.data?.map((pokemon) => pokemon.pokemon)

    console.log(favoritePokemonsNames)


    this.pokeapiService.getKantoPokemons().subscribe(
      data => {
        const favoritePokemons = data.results
        .map((pokemon: PokemonInterface, index: number) => {
          if (favoritePokemonsNames?.includes(pokemon.name)) {
            return {
              ...pokemon,
              isFavorite: true,
              imgName: `${index + 1}.png`,
            };
          } else {
            return pokemon;
          }
        })
        .filter((pokemon: PokemonInterface) => favoritePokemonsNames?.includes(pokemon.name));
      this.kantoPokemons = favoritePokemons;
      }
    );
  }

  async changeFavoriteState(pokemon: PokemonInterface) {
    console.log(pokemon)
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
