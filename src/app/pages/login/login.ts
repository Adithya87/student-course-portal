import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
    selector: 'app-login',
    imports: [CommonModule, FormsModule],
    templateUrl: './login.html',
    styleUrl: './login.css'
})
export class Login {
    email = '';
    password = '';
    errorMessage = '';
    isLoading = false;

    constructor(private authService: AuthService, private router: Router) { }

    onSubmit(): void {
        if (!this.email || !this.password) {
            this.errorMessage = 'Please enter both email and password.';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        // Mock network delay (800ms) for premium loading experience
        setTimeout(() => {
            const success = this.authService.login(this.email, this.password);
            this.isLoading = false;
            if (success) {
                console.log('Login successful! Redirecting to home page...');
                this.router.navigate(['/']);
            } else {
                this.errorMessage = 'Invalid email or password. Please try again.';
            }
        }, 800);
    }
}
