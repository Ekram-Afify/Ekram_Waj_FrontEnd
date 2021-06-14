import {
  Component,
  ViewContainerRef,
  OnInit,
  ViewEncapsulation,
  Injector,
} from "@angular/core";
import { LoginService } from "./login/login.service";
import { AppComponentBase } from "@shared/app-component-base";
import { TranslateService } from "@ngx-translate/core";
@Component({
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.less"],
})
export class AccountComponent extends AppComponentBase implements OnInit {
  versionText: string;
  currentYear: number;
  private viewContainerRef: ViewContainerRef;
  public constructor(
    injector: Injector,
    private _loginService: LoginService,
    translate: TranslateService
  ) {
    super(injector);
    this.currentYear = new Date().getFullYear();
    this.versionText =
      this.appSession.application.version +
      " [" +
      this.appSession.application.releaseDate.format("YYYYDDMM") +
      "]";
    const currentLan = localStorage.getItem("lan");
    if (currentLan == null) {
      translate.addLangs(["en", "ar-EG"]);
      translate.setDefaultLang("ar-EG");
      translate.use("ar-EG");
      localStorage.setItem("lan", "ar-EG");
      document.getElementsByTagName("body")[0].setAttribute("dir", "rtl");
    } else {
      translate.setDefaultLang(currentLan);
      translate.use(currentLan);
    }
    if (translate.currentLang === "ar-EG") {
      document.getElementsByTagName("body")[0].setAttribute("dir", "rtl");
    } else {
      document.getElementsByTagName("body")[0].setAttribute("dir", "ltr");
    }
  }
  showTenantChange(): boolean {
    return abp.multiTenancy.isEnabled;
  }
  ngOnInit(): void {
    $("body").addClass("login-page");
  }
}
