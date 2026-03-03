import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Result } from '../domain/result.model';
import { UserDto } from '../domain/user.model';
import { UserCreateDto } from '../domain/userCreate.model';
import { UserUpdateDto } from '../domain/userUpdate.mode';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  //private apiUrl = 'http://13.59.37.186:5011/api/Users/';
  private apiUrl = 'http://localhost:5011/api/Users/';

  private usersSignal = signal<UserDto[]>([]);

  readonly users = computed(() => this.usersSignal());

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<Result<UserDto[]>> {
    return this.http.get<Result<UserDto[]>>(this.apiUrl).pipe(
      tap(result => {
        if (result.success && result.data) {
          this.usersSignal.set(result.data);
        }
      })
    );
  }

  getUserById(id: string): Observable<Result<UserDto>> {
    return this.http.get<Result<UserDto>>(this.apiUrl + `${id}`);
  }

  deleteUser(id: string): Observable<Result<void>> {
    return this.http.delete<Result<void>>(this.apiUrl + `${id}`).pipe(
      tap(result => {
        if (result.success) {
          this.usersSignal.update(users => users.filter(u => u._id !== id));
        }
      })
    );
  }

  addNewUser(user: UserCreateDto): Observable<Result<UserDto>> {
    return this.http.post<Result<UserDto>>(this.apiUrl, user).pipe(
      tap(result => {
        if (result.success && result.data) {
          this.usersSignal.update(users => [...users, result.data!]);
        }
      })
    );
  }

  updateUser(user: Partial<UserUpdateDto>): Observable<Result<UserDto>> {
    return this.http.put<Result<UserDto>>(this.apiUrl, user).pipe(
      tap(result => {
        if (result.success && result.data) {
          this.usersSignal.update(users => users.map(u => u._id === user._id ? result.data! : u));
        }
      })
    );
  }

}
