import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { environment } from './../../environments/environment';
import { User } from './user.model';


export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localID: string;
    registered?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user = new BehaviorSubject<User>(null);
    private tokenExpTimer: any;

    constructor(private http: HttpClient, private router: Router) { }

    signUp(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
            {
                email,
                password,
                returnSecureToken: true
            }
        ).pipe(catchError(this.handleError), tap(resData => {
            this.handleAuth(
                resData.email,
                resData.localID,
                resData.idToken,
                +resData.expiresIn
            );
        })
        );
    }

    logIn(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
            {
                email,
                password,
                returnSecureToken: true
            }
        ).pipe(catchError(this.handleError), tap(resData => {
            this.handleAuth(
                resData.email,
                resData.localID,
                resData.idToken,
                +resData.expiresIn
            );
        })
        );
    }

    logout() {
        this.user.next(null);
        localStorage.removeItem('userData');
        this.router.navigate([ '/auth' ]);
        if (this.tokenExpTimer) {
            clearTimeout(this.tokenExpTimer);
        }
        this.tokenExpTimer = null;
    }

    autoLogin() {
        const userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return;
        }
        const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate));

        if (loadedUser.token) {
            this.user.next(loadedUser);
            const expDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expDuration);
        }
    }

    autoLogout(expDuration: number) {
        this.tokenExpTimer = setTimeout(() => {
            this.logout();
        }, expDuration);
    }

    private handleAuth(email: string, userID: string, token: string, expiresIn: number) {
        const expDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(
            email,
            userID,
            token,
            expDate
        );
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email already exists! Please try to login!';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'The email you entered is unregistered!';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'The password you entered is invalid!';
                break;
            case 'USER_DISABLED':
                errorMessage = 'The account with the given credentials had been suspended! Please contact the administrator!';
                break;
        }
        return throwError(errorMessage);
    }
}
