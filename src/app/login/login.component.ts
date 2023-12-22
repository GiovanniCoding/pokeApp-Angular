import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../_services/supabase.service';
import { Router } from '@angular/router';
import { Session } from '@supabase/supabase-js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(
    private readonly supabase: SupabaseService,
    private router: Router
  ) {}

  session: Session | null = this.supabase.session

  ngOnInit() {
    this.supabase.authChanges((_, session) => (this.session = session))
  }

  loading: boolean = false;
  email: string = '';
  password: string = '';

  async signIn(): Promise<void> {
    
    try {
      this.loading = true
      const { error } = await this.supabase.signIn(this.email, this.password)
      if (error) {
        throw error
      } else {
        this.router.navigate(['/dashboard'])
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      this.loading = false
    }
  }
}
