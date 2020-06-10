import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ImporterComponent } from './components/importer.component';

const routes: Routes = [
    { path: 'importer', component: ImporterComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: [],
    exports: [RouterModule]
})
export class ImporterRouting { }
