import { Component, OnInit, Injector, NgZone } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AppComponentBase } from "shared/app-component-base";
import { AdminDriverServiceProxy } from "@shared/service-proxies/service-proxies";
import {
  AdminDriverDtoPagedResultDto,
  TrackingTripServiceProxy,
} from "../../../../shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { message } from "@shared/Message/message";
@Component({
  selector: "app-follow-order",
  templateUrl: "./follow-order.component.html",
  styleUrls: ["./follow-order.component.scss"],
})
export class FollowOrderComponent extends AppComponentBase implements OnInit {
  latitude: number;
  longitude: number;
  orderForm: FormGroup;
  isSubmitted = false;
  drivers = [];

  public origin;
  public destination;
  public waypoints = [];
  _id;
  // public renderOptions = {
  //   suppressMarkers: true,
  // };

  // public markerOptions = {
  //   origin: {
  //     infoWindow: "",
  //     icon: "./assets/images/map-pin.png",
  //   },
  //   waypoints: [],
  //   destination: {
  //     infoWindow: "",
  //     icon: "./assets/images/map-pin1.png",
  //   },
  // };
  public markerOptions = {
    origin: {
      infoWindow: "",
      icon: "./assets/images/map-pin.png",
    },
    waypoints: [],
    destination: {
      infoWindow: "",
      icon: "./assets/images/map-pin1.png",
    },
  };
  constructor(
    private _formBuilder: FormBuilder,
    injector: Injector,
    private trackOrder: TrackingTripServiceProxy,
    private route: ActivatedRoute,
    // private driversServices: AdminDriverServiceProxy,
    private ngZone: NgZone
  ) {
    super(injector);
    this.orderForm = this._formBuilder.group({
      RequestId: ["", Validators.required],
      // Plate: [""],
      // DriverId: [""],
    });
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this._id = params["id"];
        this.search(this._id);
        this.orderForm = this._formBuilder.group({
          RequestId: [this._id],
        });
      }
    });
  }

  ngOnInit() {
    // this.driversServices
    //   .getAll(undefined, undefined, undefined, undefined, "", 0, 1000)
    //   .pipe(finalize(() => {}))
    //   .subscribe((result: AdminDriverDtoPagedResultDto) => {
    //     const ReqResult = result.items;
    //     this.drivers = [];
    //     this.drivers.push({ label: this.l("Drivers"), value: null });
    //     ReqResult.forEach((element) => {
    //       this.drivers.push({ label: element.fullName, value: element.id });
    //     });
    //   });
  }
  search(id) {
    this.markerOptions.waypoints = [];
    this.trackOrder
      .getTrackingTrip(id, undefined, undefined, undefined)
      .subscribe((res) => {
        if (res.trackingTrips) {
          this.origin = {
            lat: Number(
              res.trackingTrips[0].request.startingPoint.substring(
                0,
                res.trackingTrips[0].request.startingPoint.indexOf(",")
              )
            ),

            lng: Number(
              res.trackingTrips[0].request.startingPoint.substring(
                res.trackingTrips[0].request.startingPoint.indexOf(",") + 1,
                1000
              )
            ),
          };

          this.destination = {
            lat: Number(
              res.trackingTrips[0].request.endingPoint.substring(
                0,
                res.trackingTrips[0].request.endingPoint.indexOf(",")
              )
            ),

            lng: Number(
              res.trackingTrips[0].request.endingPoint.substring(
                res.trackingTrips[0].request.endingPoint.indexOf(",") + 1,
                1000
              )
            ),
          };

          // this.origin = res.trackingTrips[0].request.startingPoint;
          // this.destination = res.trackingTrips[0].request.endingPoint;
          this.markerOptions.origin.infoWindow = `<p>${res.trackingTrips[0].request.stratingPointAdress}</p>`;
          this.markerOptions.origin.icon = "./assets/images/map-pin.png";
          // this.markerOptions.waypoints[
          //   "infoWindow"
          // ] = `<h4>${res.trackingTrips[0].driver.fullName}<h4></br><h4>${res.trackingTrips[0].driver.mobileNumber}<h4></br><h4>${res.trackingTrips[0].driver.plate}<h4>`;
          this.markerOptions.destination.infoWindow = `<p>${res.trackingTrips[0].request.endingPointAdress}</p>`;
          this.markerOptions.destination.icon = "./assets/images/map-pin1.png";
          this.waypoints.length = res.trackingTrips.length;
          for (let i = 0; i < res.trackingTrips.length; i++) {
            this.waypoints[i] = {
              location: {
                lat: Number(res.trackingTrips[i].latitude),
                lng: Number(res.trackingTrips[i].longitude),
              },
              stopover: false,
            };
          }
          // this.markerOptions.waypoints.length = this.waypoints.length;
          for (let i = 0; i < this.waypoints.length; i++) {
            if (i < this.waypoints.length - 2) {
              this.markerOptions.waypoints.push({
                icon: "./assets/images/pin.png",
                infoWindow: `<h4>${
                  res.trackingTrips[0].driver.fullName
                }<h4></br><h4>${
                  res.trackingTrips[0].driver.mobileNumber
                }<h4></br><h4>${
                  res.trackingTrips[0].driver.plate
                }<h4></br><h4>${res.trackingTrips[0].creationTime
                  .toString()
                  .slice(0, 21)}<h4>`,
              });
              // this.markerOptions.waypoints[i]["icon"] =
              //   "./assets/images/pin.png";
            } else {
              this.markerOptions.waypoints.push({
                icon: "./assets/images/curentLocation.png",
                infoWindow: `<h4>${
                  res.trackingTrips[0].driver.fullName
                }<h4></br><h4>${
                  res.trackingTrips[0].driver.mobileNumber
                }<h4></br><h4>${
                  res.trackingTrips[0].driver.plate
                }<h4></br><h4>${res.trackingTrips[0].creationTime
                  .toDate()
                  .toString()
                  .slice(0, 21)}<h4>`,
              });
              // this.markerOptions.waypoints[i]["icon"] =
              //   "./assets/images/curentLocation.png";
            }
          }
        } else if (res.message) {
          message.Toast.fire(res.message);
        }
        // console.log("res : ", res);
      });
  }
  submitSearch() {
    this.markerOptions.waypoints = [];
    this.isSubmitted = true;
    if (this.orderForm.invalid) {
      return;
    } else {
      if (this.orderForm.value.RequestId.length != 0) {
        // this.origin = "23.723456,45.7009536";
        // this.destination = "23.6923952,45.6660188";
        this.trackOrder
          .getTrackingTrip(
            this.orderForm.value.RequestId,
            undefined,
            undefined,
            undefined
          )
          .subscribe((res) => {
            if (res.trackingTrips) {
              // var originLan = res.trackingTrips[0].request.startingPoint.substring(
              //   res.trackingTrips[0].request.startingPoint.indexOf(",") + 1,
              //   1000
              // );
              // console.log("originLan : ", originLan);

              this.origin = {
                lat: Number(
                  res.trackingTrips[0].request.startingPoint.substring(
                    0,
                    res.trackingTrips[0].request.startingPoint.indexOf(",")
                  )
                ),

                lng: Number(
                  res.trackingTrips[0].request.startingPoint.substring(
                    res.trackingTrips[0].request.startingPoint.indexOf(",") + 1,
                    1000
                  )
                ),
              };

              this.destination = {
                lat: Number(
                  res.trackingTrips[0].request.endingPoint.substring(
                    0,
                    res.trackingTrips[0].request.endingPoint.indexOf(",")
                  )
                ),

                lng: Number(
                  res.trackingTrips[0].request.endingPoint.substring(
                    res.trackingTrips[0].request.endingPoint.indexOf(",") + 1,
                    1000
                  )
                ),
              };

              // this.origin = res.trackingTrips[0].request.startingPoint;
              // this.destination = res.trackingTrips[0].request.endingPoint;
              this.markerOptions.origin.infoWindow = `<p>${res.trackingTrips[0].request.stratingPointAdress}</p>`;
              this.markerOptions.origin.icon = "./assets/images/map-pin.png";
              // this.markerOptions.waypoints[
              //   "infoWindow"
              // ] = `<h4>${res.trackingTrips[0].driver.fullName}<h4></br><h4>${res.trackingTrips[0].driver.mobileNumber}<h4></br><h4>${res.trackingTrips[0].driver.plate}<h4>`;
              this.markerOptions.destination.infoWindow = `<p>${res.trackingTrips[0].request.endingPointAdress}</p>`;
              this.markerOptions.destination.icon =
                "./assets/images/map-pin1.png";
              this.waypoints.length = res.trackingTrips.length;
              for (let i = 0; i < res.trackingTrips.length; i++) {
                this.waypoints[i] = {
                  location: {
                    lat: Number(res.trackingTrips[i].latitude),
                    lng: Number(res.trackingTrips[i].longitude),
                  },
                  stopover: false,
                };
              }
              // this.markerOptions.waypoints.length = this.waypoints.length;
              for (let i = 0; i < this.waypoints.length; i++) {
                if (i < this.waypoints.length - 2) {
                  this.markerOptions.waypoints.push({
                    icon: "./assets/images/pin.png",
                    infoWindow: `<h4>${
                      res.trackingTrips[0].driver.fullName
                    }<h4></br><h4>${
                      res.trackingTrips[0].driver.mobileNumber
                    }<h4></br><h4>${
                      res.trackingTrips[0].driver.plate
                    }<h4></br><h4>${res.trackingTrips[0].creationTime
                      .toString()
                      .slice(0, 21)}<h4>`,
                  });
                  // this.markerOptions.waypoints[i]["icon"] =
                  //   "./assets/images/pin.png";
                } else {
                  this.markerOptions.waypoints.push({
                    icon: "./assets/images/curentLocation.png",
                    infoWindow: `<h4>${
                      res.trackingTrips[0].driver.fullName
                    }<h4></br><h4>${
                      res.trackingTrips[0].driver.mobileNumber
                    }<h4></br><h4>${
                      res.trackingTrips[0].driver.plate
                    }<h4></br><h4>${res.trackingTrips[0].creationTime
                      .toString()
                      .slice(0, 21)}<h4>`,
                  });
                  // this.markerOptions.waypoints[i]["icon"] =
                  //   "./assets/images/curentLocation.png";
                }
              }
            } else if (res.message) {
              message.Toast.fire(res.message);
            }
          });
      }
    }
  }
}
