import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Session } from '@supabase/supabase-js';
import { SupabaseService } from './_services/supabase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(
    private readonly supabase: SupabaseService,
  ) {}

  isLoggedIn = false;
  session: Session | null = this.supabase.session
  username?: string;

  ngOnInit(): void {
    this.supabase.authChanges((_, session) => {
      this.session = session
      this.isLoggedIn = session !== null;
      this.username = session?.user?.email;
    })
  }

  async signOut() {
    await this.supabase.signOut()
    window.location.reload()
  }
}
