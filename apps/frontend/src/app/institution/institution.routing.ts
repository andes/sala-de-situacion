import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AppInstitutionCrudComponent } from './institution-crud.component';
import { AppInstitutionListComponent } from './institution-list.component';

const routes: Routes = [
    {
        path: 'crud',
        component: AppInstitutionCrudComponent
    },
    {
        path: 'list',
        component: AppInstitutionListComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: []
})
export class InstitutionRouting {}
