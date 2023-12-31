import { User } from './../../../../models/rest.models';
import { Router } from '@angular/router';
import { TokenService } from './../../../../core/services/token.service';
import { Animations } from './../../../../../assets/animations/animations';
import { Component, OnInit, Input, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [Animations.topRightScale],
})
export class NavbarComponent implements OnInit {
  userInfoOpened = false;
  userData: User | null = null;
  @Input() itemsAmount = 0;

  @HostListener('document:click', ['$event'])
  clickout(event:Event) {
    if(!this.eRef.nativeElement.contains(event.target)) {
      this.userInfoOpened = false;
    }
  }


  constructor(
    private router: Router, 
    private tokenService: TokenService,
    private eRef: ElementRef) {}

  ngOnInit (): void {
    if (localStorage.getItem('user')) {
      this.userData = JSON.parse(localStorage.getItem('user') as string);
    }
  }

  logOut () {
    this.tokenService.deleteToken();
    localStorage.removeItem('user');
    this.userData = null;
    this.router.navigate([''])
  }

  toggleUserInfo () {
    this.userInfoOpened = !this.userInfoOpened;
  }

  goToLogin () {
    this.router.navigate(['/credentials']);
  }

  goToCart () {
    this.router.navigate(['/main/cart']);
  }

  goToMain () {
    this.router.navigate(['/main'])
  }
}
