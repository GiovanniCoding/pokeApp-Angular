import { Component } from '@angular/core';
import { SupabaseService } from '../_services/supabase.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { Router, RouterLink } from '@angular/router';
import { Session } from '@supabase/supabase-js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, DashboardComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  session: Session | null = this.supabase.session

  constructor(
    private readonly supabase: SupabaseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.supabase.authChanges((_, session) => (this.session = session))
  }
}