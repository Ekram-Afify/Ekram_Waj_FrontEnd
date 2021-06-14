import { Component, OnInit, Injector } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  ChangeUserLanguageDto,
  UserServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { AppComponentBase } from "@shared/app-component-base";
import * as _ from "lodash";
import { AppAuthService } from "@shared/auth/app-auth.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent extends AppComponentBase implements OnInit {
  languages: abp.localization.ILanguageInfo[];
  currentLanguage: abp.localization.ILanguageInfo;
  shownLoginName = "";

  constructor(
    public translate: TranslateService,
    private _userService: UserServiceProxy,
    injector: Injector,
    private _authService: AppAuthService
  ) {
    super(injector);
  }

  ngOnInit() {
    this.shownLoginName = this.appSession.getShownLoginName();

    this.languages = _.filter(
      this.localization.languages,
        (l) => !l.isDisabled && (l.name == "en" || l.name == "ar-EG")
    );
    this.currentLanguage = this.localization.currentLanguage;
  }
  ToEnglish() {
    localStorage.setItem("lan", "en");
    this.translate.setDefaultLang("en");
    this.translate.use("en");
  }

  ToArabic() {
    localStorage.setItem("lan", "ar-EG");
      this.translate.setDefaultLang("ar-EG");
      this.translate.use("ar-EG");
  }

  changeLanguage(languageName: string): void {
    if (languageName == "en") {
      this.ToEnglish();
    } else if (languageName == "ar-EG") {
      this.ToArabic();
    }
    const input = new ChangeUserLanguageDto();
    input.languageName = languageName;

    this._userService.changeLanguage(input).subscribe(() => {
      abp.utils.setCookieValue(
        "Abp.Localization.CultureName",
        languageName,
        new Date(new Date().getTime() + 5 * 365 * 86400000), // 5 year
        abp.appPath
      );
      window.location.reload();
    });
  }
  logout(): void {
    this._authService.logout();
  }
}
