import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { UserRoleDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';


@Component({
  selector: 'app-asidebar',
  templateUrl: './asidebar.component.html',
  styleUrls: ['./asidebar.component.css']
})
export class AsidebarComponent extends AppComponentBase  implements OnInit {
  IsClientCompany: boolean;

  constructor(
    injector: Injector,
    private userService: UserServiceProxy,
    private appSessionService: AppSessionService,
) {
    super(injector);
}


  ngOnInit() {
this.isUserInRole("CLIENTCOMPANY");
    
  
  }
  Logout() {

  }

  showMenuItem(permissionName): boolean {
   

    return this.permission.isGranted(permissionName);
}

  displayWindowSize() {
    // Get width and height of the window excluding scrollbars
    var widthScreen = document.documentElement.clientWidth;
    var heightScreen = document.documentElement.clientHeight;
    var heightAsidebar = $(".asidebar-admin .inside-asidebar").innerHeight();
    if (heightScreen < heightAsidebar) {
      // console.log("this Height: ", heightAsidebar, heightScreen);
      $(".asidebar-admin .inside-asidebar").addClass("asidebar-customize-dropdown");
    } else {
      $(".asidebar-admin .inside-asidebar").removeClass("asidebar-customize-dropdown");

    }

  }
  ngAfterViewInit() {
    /* Start Customize Height AsideBar by documentElement clientWidth */

    // window.addEventListener("resize", this.displayWindowSize);
    this.displayWindowSize();
    /* End Customize Height AsideBar by documentElement clientWidth */
    $(".asidebar-admin .inside-asidebar ul .li-dropdown a .arrow-dropdown").click(function () {
      // console.log($(this).parents("li").hasClass("active-dropdown"));
      if ($(this).parents("li").hasClass("active-dropdown")) {
        $(this).parents("li").removeClass("active-dropdown");
        $(this).parent("a").next().slideUp(500);
        // $(this).parent("a").next().slideToggle(1000);
      } else {
        $(this).parents("li").addClass("active-dropdown");
        $(this).parent("a").next().slideDown(500);

      }
    })
  }

  isUserInRole(roleName: string) {
    let isInRole = false;
    let model= new UserRoleDto();
    model.roleName=roleName,
    model.userID=this.appSessionService.user.id
      
    
    this.userService
      .checkUserRole(model)
      .subscribe((response) => {
        this.IsClientCompany = response
       
      });
  }

  }



