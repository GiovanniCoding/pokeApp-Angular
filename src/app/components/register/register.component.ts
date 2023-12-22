import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../_services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private readonly supabase: SupabaseService,
    private router: Router
  ) {}

  async signUp(): Promise<void> {
    try {
      const { error } = await this.supabase.signUp(this.email, this.password, this.username)
      if (error) {
        throw error
      } else {
        this.supabase.session
        console.log(this.supabase.session)
        // Save the username in the DB
        await this.supabase.updateProfile({
          id: this.supabase.session?.user?.id,
          username: this.username
        })
        
        this.router.navigate(['/dashboard'])
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    }
  }
}
