import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ImporterComponent } from './components/importer.component';
import { ImportsComponent } from './components/imports/imports.component';

const routes: Routes = [
    { path: 'importer', component: ImporterComponent },
    { path: 'imports', component: ImportsComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: [],
    exports: [RouterModule]
})
export class ImporterRouting { }
