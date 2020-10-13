import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from './../shared/shared.module';
import { AuthComponent } from './auth.component';

@NgModule({
    declarations: [ AuthComponent ],
    imports: [
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([ { path: '', component: AuthComponent } ])
    ],
    exports: [
        AuthComponent,
        RouterModule
    ]
})
export class AuthModule { }
