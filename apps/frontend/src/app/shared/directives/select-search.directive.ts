import { OnInit, Input, ViewContainerRef, Directive, OnDestroy, Inject, AfterContentInit } from '@angular/core';
import { PlexSelectComponent } from '@andes/plex/src/lib/select/select.component';
import { Subscription } from 'rxjs';
import { SelectSearchService } from '../select-search.service';

/**
 * Transforma un plex-select automaticamente en un buscador de dinamico
 */

@Directive({
    selector: '[ssSearch]'
})

export class SelectSearchDirective implements OnDestroy, AfterContentInit {

    @Input() ssSearch = '';
    @Input() preload = false;

    private subscription: Subscription = null;
    private lastCallSubscription: Subscription = null;

    constructor(
        private selectSearch: SelectSearchService,
        private _viewContainerRef: ViewContainerRef
    ) {
        const plexSelect: PlexSelectComponent = this._viewContainerRef['_data'].componentView.component;
        plexSelect.idField = 'id';
        plexSelect.labelField = 'nombre';
    }

    ngAfterContentInit() {
        const plexSelect: PlexSelectComponent = this._viewContainerRef['_data'].componentView.component;
        if (this.preload) {
            plexSelect.data = [];
            this.selectSearch.get(this.ssSearch, null).subscribe(result => {
                plexSelect.data = result;
            });
        } else {
            this.subscription = plexSelect.getData.subscribe(($event) => {
                const inputText: string = $event.query;
                if (inputText && inputText.length > 1) {
                    if (this.lastCallSubscription) {
                        this.lastCallSubscription.unsubscribe();
                    }
                    this.lastCallSubscription = this.selectSearch.get(this.ssSearch, inputText).subscribe(result => {
                        $event.callback(result);
                    });
                } else {
                    const selectedValue = (plexSelect as any).value;
                    if (selectedValue) {
                        $event.callback([selectedValue]);
                    } else {
                        $event.callback([]);
                    }
                }
            });
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}