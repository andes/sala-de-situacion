import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AppInstitutionComponent } from './institution.component';
import { AppInstitutionListComponent } from './institution-list.component';

const routes: Routes = [
    {
        path: 'institution',
        component: AppInstitutionComponent
    },
    {
        path: 'institution-list',
        component: AppInstitutionListComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: []
})
export class InstitutionRouting { }
