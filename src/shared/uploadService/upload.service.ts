import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AppConsts } from "@shared/AppConsts";

@Injectable({
  providedIn: "root",
})
export class UploadService {
  public filesKey = new Subject<string[]>();
  url = AppConsts.remoteServiceBaseUrl + "/api/UploadFile/Upload";

  constructor(private httpClient: HttpClient) {}

  uploadFile(formData) {
    this.httpClient.post(this.url, formData).subscribe((res) => {
      debugger;
      this.filesKey.next(res["result"]);
    });
  }
}
