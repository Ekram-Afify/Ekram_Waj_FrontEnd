import {
  Component,
  ViewContainerRef,
  Injector,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
} from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import { TranslateService } from "@ngx-translate/core";
import { message } from "@shared/Message/message";

import { SignalRAspNetCoreHelper } from "@shared/helpers/SignalRAspNetCoreHelper";
import { Router } from "@angular/router";
declare const $: any;
@Component({
  templateUrl: "./app.component.html",
})
export class AppComponent
  extends AppComponentBase
  implements OnInit, AfterViewInit {
  private viewContainerRef: ViewContainerRef;
  reset: any;
  constructor(
    injector: Injector,
    translate: TranslateService,
    private router: Router
  ) {
    super(injector);
    router.events.subscribe((val) => {
      this.reset = $(".i-filter");
      this.reset.val("");
    });

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

  ngOnInit(): void {
    SignalRAspNetCoreHelper.initSignalR();
    abp.event.on("abp.notifications.received", (userNotification) => {
      if (
        userNotification.notification.data.type ===
        "Abp.Notifications.MessageNotificationData"
      ) {
        message.Toast.fire(
          "New Message Released",
          "Check now the Support Messages"
        );
      }
    });

    // abp.event.on('abp.notifications.received', (userNotification) => {
    //   abp.notifications.showUiNotifyForUserNotification(userNotification);
    //   // console.log("notification!", userNotification);
    //   // Desktop notification
    //   Push.create('AbpZeroTemplate', {
    //     body: userNotification.notification.data.message,
    //     icon: abp.appPath + 'assets/app-logo-small.png',
    //     timeout: 6000,
    //     onClick: function () {
    //       window.focus();
    //       this.close();
    //     },
    //   });
    // });
    $(
      ".asidebar-admin .inside-asidebar ul .list-asidebarnav-item:not(:first-of-type) > a"
    ).click(function () {
      $(this).next(".sub-menu").slideToggle();
      $(this).parent("li").siblings().find(".sub-menu").slideUp();
      $(this).toggleClass("openArrow");

      $(this)
        .parent("li")
        .siblings()
        .find(".openArrow")
        .removeClass("openArrow");
    });
    $(".section-navigation-menu").click(function () {
      if ($("app-root").hasClass("hide-asidebar")) {
        $("app-root").removeClass("hide-asidebar");
      } else {
        $("app-root").addClass("hide-asidebar");
      }
    });
    $(".asidebar-background").click(function () {
      if ($("app-root").hasClass("hide-asidebar")) {
        $("app-root").removeClass("hide-asidebar");
      } else {
        $("app-root").addClass("hide-asidebar");
      }
    });
  }

  ngAfterViewInit(): void {
    $.AdminBSB.activateAll();
    $.AdminBSB.activateDemo();
  }

  onResize(event) {
    // exported from $.AdminBSB.activateAll
    $.AdminBSB.leftSideBar.setMenuHeight();
    $.AdminBSB.leftSideBar.checkStatuForResize(false);

    // exported from $.AdminBSB.activateDemo
    $.AdminBSB.demo.setSkinListHeightAndScroll();
    $.AdminBSB.demo.setSettingListHeightAndScroll();
  }
}
