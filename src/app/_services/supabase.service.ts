import { Injectable } from '@angular/core'
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
  SupabaseClient,
  User,
} from '@supabase/supabase-js'
import { environment } from '../../environments/environment'

export interface Profile {
  id?: string
  username: string
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient
  _session: AuthSession | null = null

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session
    })
    return this._session
  }

  getSession() {
    return this.supabase.auth.getSession()
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  profile(user: User) {
    return this.supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.id)
      .single()
  }

  signIn(email: string, password: string) {
    const userData = {
      email,
      password,
    } as SignInWithPasswordCredentials
    return this.supabase.auth.signInWithPassword(userData)
  }

  signUp(email: string, password: string, username: string) {
    const userData = {
      email,
      password,
    } as SignUpWithPasswordCredentials
    const registerResponse = this.supabase.auth.signUp(userData)
    return registerResponse
  }

  signOut() {
    return this.supabase.auth.signOut()
  }

  updateProfile(profile: Profile) {
    const update = {
      ...profile,
      updated_at: new Date(),
    }

    return this.supabase.from('profile').upsert(update)
  }

  async addFavoritePokemon(id: number) {
    const { data: { session } } = await this.getSession()
    return this.supabase
      .from('favoritePokemon')
      .insert({
        pokemon: id,
        user_id: session?.user?.id,
      })
  }

  async removeFavoritePokemon(id: number) {
    const { data: { session } } = await this.getSession()
    return this.supabase
      .from('favoritePokemon')
      .delete()
      .eq('pokemon', id)
      .eq('user_id', session?.user?.id)
  }

  async getFavoritePokemons() {
    const session = await this.getSession()
      return this.supabase
        .from('favoritePokemon')
        .select('pokemon')
        .eq('user_id', session.data.session?.user.id)
  }
}
