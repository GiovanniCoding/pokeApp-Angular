import { Component } from '@angular/core';
import { SupabaseService } from '../../_services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  loading: boolean = false;

  constructor(
    private readonly supabase: SupabaseService,
    private router: Router
  ) {}
}
