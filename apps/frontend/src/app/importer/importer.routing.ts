import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ImporterComponent } from './components/importer.component';
import { ImportsComponent } from './components/imports/imports.component';
import { CheckImportComponent } from './components/checkimport.component';

const routes: Routes = [
    { path: 'importer', component: ImporterComponent },
    { path: 'imports', component: ImportsComponent },
    { path: 'checkimport', component: CheckImportComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    providers: [],
    exports: [RouterModule]
})
export class ImporterRouting { }
