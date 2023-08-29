import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Observable, of } from 'rxjs';
import { User } from '../_models/user';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model:any={};
  // loogedIn=false;

  // currentUser$:Observable<User | null > = of(null);

  constructor(public accountService:AccountService,private router:Router,
    private toastr:ToastrService){}

  ngOnInit(): void {

    //this.getCurrentUser();
    // this.currentUser$ = this.accountService.currentUser$;

    
  }

  // getCurrentUser(){
  //   this.accountService.currentUser$.subscribe({
  //     next:user =>this.loogedIn= !!user,
  //     error:error =>console.log(error)
  //   })
  // }

  login(){
    
    this.accountService.login(this.model).subscribe(
      {
        next: _ =>this.router.navigateByUrl('/members')
          //console.log(response);
          // this.loogedIn = true;
        ,
       // error:error=>this.toastr.error(error.error)
      });
  }

  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/');
    //this.loogedIn=false;
  }

}
