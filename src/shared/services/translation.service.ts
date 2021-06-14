import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class TranslationService {


    constructor(
        private _translateService: TranslateService, ) {
    }
    public isEnglish() {
        return this._translateService.currentLang
            == "en";
    }
}
