import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { Result } from '../domain/result.model';
import { UserDto } from '../domain/user.model';
import { UserCreateDto } from '../domain/userCreate.model';
import { UserUpdateDto } from '../domain/userUpdate.mode';
import { ApiResponse } from '../domain/api-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  //private apiUrl = 'http://13.59.37.186:5011/api/Users';
  private apiUrl = 'http://localhost:5011/api/Users';

  private usersSignal = signal<UserDto[]>([]);

  searchTerm = signal('');

  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const allUsers = this.users() || [];

    if (!term) return allUsers;

    return allUsers.filter(user =>
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term)
    );
  });

  readonly users = computed(() => this.usersSignal());

  constructor(private http: HttpClient) {}

  get(): Observable<Result<UserDto[]>> {
    return this.http.get<Result<UserDto[]>>(this.apiUrl).pipe(
      tap(result => {
        if (result.success && result.data) {
          this.usersSignal.set(result.data);
        }
      })
    );
  }

  getById(id: string): Observable<Result<UserDto>> {
    return this.http.get<Result<UserDto>>(this.apiUrl + `/${id}`);
  }

  delete(id: string): Observable<Result<void>> {
    return this.http.delete<Result<void>>(this.apiUrl + `/${id}`).pipe(
      tap(result => {
        if (result.success) {
          this.usersSignal.update(users => users.filter(u => u._id !== id));
        }
      })
    );
  }

  post(user: UserCreateDto): Observable<Result<UserDto>> {
    return this.http.post<Result<UserDto>>(this.apiUrl, user).pipe(
      tap(result => {
        if (result.success && result.data) {
          this.usersSignal.update(users => [...users, result.data!]);
        }
      })
    );
  }

  async signUp(userCreateDto: UserCreateDto): Promise<Result<ApiResponse>> {
    try {
          const response = await firstValueFrom(
            this.http.post<Result<any>>(this.apiUrl + "/SignUp", userCreateDto)
        );    
  
        if (response.success && response.data) {
  
          //console.log(response);
          
        }   
  
        console.log(response);

        return response;
  
      } catch (error: any) {         
  
        const apiError = error.error;      
  
        const messageToDisplay = apiError?.errors || apiError?.Errors; 
        
        //console.log(messageToDisplay);
      
        throw messageToDisplay;
  
      }
    }

  

  put(user: Partial<UserUpdateDto>, id: string): Observable<Result<UserDto>> {
    return this.http.put<Result<UserDto>>(this.apiUrl + `/${id}`, user).pipe(
      tap(result => {
        if (result.success && result.data) {
          this.usersSignal.update(users => users.map(u => u._id === id ? result.data! : u));
        }
      })
    );
  }

}
