import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Session } from '@supabase/supabase-js';
import { SupabaseService } from './_services/supabase.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(
    private router: Router,
    private readonly supabase: SupabaseService,
  ) {}

  isLoggedIn = false;
  session: Session | null = this.supabase.session
  username?: string;

  ngOnInit(): void {
    this.supabase.authChanges((_, session) => {
      this.session = session
      this.isLoggedIn = session !== null;
      this.supabase.getProfile()
      .then(({ data }) => {
        this.username = data?.username;
      })
    })
  }

  async signOut() {
    await this.supabase.signOut()
    this.router.navigate(['/home']);
  }
}
