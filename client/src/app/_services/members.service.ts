import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Member } from '../_models/member';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseUrl = environment.apiUrl;

  member: Member[] = [];


  constructor(private http: HttpClient) { }


  getMembers() {
    if (this.member.length > 0) return of(this.member);
    return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
      map(member => {
        this.member = member;
        return member;
      })
    )
  }

  getMember(username: string) {
    const member = this.member.find(x => x.userName === username);
    if (member) return of(member)
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }


  updateMember(member: Member) {

    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.member.indexOf(member);
        this.member[index] = { ...this.member[index], ...member }
      })
    )

  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});

  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl +'users/delete-photo/'+photoId);
  }



  // getHttpOptions(){
  //   const userString =localStorage.getItem('user');
  //   if(!userString) return;
  //   const user =JSON.parse(userString);
  //   return {
  //     headers:new HttpHeaders({
  //       Authorization:'Bearer ' +user.token
  //     })
  //   }
  // }
}
