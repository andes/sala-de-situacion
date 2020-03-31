import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AppInstitutionComponent } from './institution.component';

const routes: Routes = [
    {
        path: 'institution',
        component: AppInstitutionComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: []
})
export class InstitutionRouting {}
