import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    { 
      title: 'Profile',
      url: '/profile',
      icon: 'person'
    },
    { 
      title: 'Categorias',
      url: '/categorias',
      icon: 'color-filter'
    },
    { 
      title: 'Carrinho',
      url: '/cart',
      icon: 'cart'
    },
    { 
      title: 'Logout',
      url: '/home',
      icon: 'log-out'
    }
    // {
    //   title: 'Outbox',
    //   url: '/folder/Outbox',
    //   icon: 'paper-plane'
    // }
    // {
    //   title: 'Favorites',
    //   url: '/folder/Favorites',
    //   icon: 'heart'
    // },
    // {
    //   title: 'Archived',
    //   url: '/folder/Archived',
    //   icon: 'archive'
    // },
    // {
    //   title: 'Trash',
    //   url: '/folder/Trash',
    //   icon: 'trash'
    // },
    // {
    //   title: 'Spam',
    //   url: '/folder/Spam',
    //   icon: 'warning'
    // }
  ];
  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar, 
    private auth: AuthService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('/home')[0];
    console.log(path);
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());

    }
  }

  navigateToPage(page, index){
    this.selectedIndex = index;

    if(page.title.toLowerCase() === "logout"){
        this.auth.logout()
    }
  }
}
