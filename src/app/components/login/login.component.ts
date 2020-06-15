import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {UserToken} from '../../model/user-token';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../services/auth/authentication.service';
import {first} from 'rxjs/operators';

declare var $: any;
declare var Swal: any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    data: Date = new Date();
    focus;
    focus1;
    loginForm: FormGroup = new FormGroup({
        username: new FormControl(''),
        password: new FormControl('')
    });
    returnUrl: string;
    loading = false;
    submitted = false;
    currentUser: UserToken;
    hasRoleAdmin = false;
    error = '';

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private authenticateService: AuthenticationService) {
        this.authenticateService.currentUser.subscribe(value => this.currentUser = value);
        if (this.currentUser) {
            this.router.navigate(['/']);
        }
        // if (this.currentUser) {
        //     const roleList = this.currentUser.roles;
        //     for (const role of roleList) {
        //         if (role.authority === 'ROLE_ADMIN') {
        //             this.hasRoleAdmin = true;
        //         }
        //     }
        // }
        //
        // if (this.authenticateService.currentUserValue) {
        //     if (this.hasRoleAdmin) {
        //         this.router.navigate(['/admin']);
        //     } else {
        //         this.router.navigate(['/'])
        //     }
        // }
    }

    ngOnInit() {
        const body = document.getElementsByTagName('body')[0];
        body.classList.add('login-page');

        const navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.add('navbar-transparent');

        this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl || '/';
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy() {
        const body = document.getElementsByTagName('body')[0];
        body.classList.remove('login-page');

        const navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.remove('navbar-transparent');
    }

    login() {
        this.submitted = true;
        this.loading = true;
        this.authenticateService.login(this.loginForm.value.username, this.loginForm.value.password)
            .pipe(first())
            .subscribe(
                data => {
                    localStorage.setItem('ACCESS_TOKEN', data.accessToken);
                    this.router.navigate([this.returnUrl]);
                    // const roleList = data.roles;
                    // for (const role of roleList) {
                    //     if (role.authority === 'ROLE_ADMIN') {
                    //         this.returnUrl = '/admin';
                    //     }
                    // }
                    // this.router.navigate([this.returnUrl]).finally(() => {
                   // });
                   //  const Toast = Swal.mixin({
                   //      toast: true,
                   //      position: 'top-end',
                   //      showConfirmButton: false,
                   //      timer: 300
                   //  });
                   //
                   //  Toast.fire({
                   //      type: 'success',
                   //      title: 'Đăng nhập thành công'
                   //  });
                },
                error => {
                    this.loading = false;
                    // tslint:disable-next-line:only-arrow-functions
                    this.error = error;
                });
    }

}
