import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
 
@Injectable()
export class UpdateService {
    private _subject = new Subject();

    private _FuelTypeSubject = new Subject();
    private _FuelTypeListSubject = new Subject();
    private _CompanySubject = new Subject();
    private _CompanyListSubject = new Subject();
    private _BranchSubject = new Subject();
    private _BranchListSubject = new Subject();
    private _DepartmentSubject = new Subject();
    private _DepartmentListSubject = new Subject();
    private _GovernomateSubject = new Subject();
    private _GovernomateListSubject = new Subject();
    private _VehicleTypeSubject = new Subject();
    private _VehicleTypeListSubject = new Subject();
    private _FuelTankSubject = new Subject();
    private _FuelTankListSubject = new Subject();

    sendSelectedRow(id: number) {
        this._subject.next(id);
    }
 
    getSelectedRow(): Observable<any> {
        return this._subject.asObservable();
    }

    //Lookups
    //fuel types
    sendSelectedFuelType(id: number) {
        this._FuelTypeSubject.next(id);
    }
    getSelectedFuelType(): Observable<any> {
        return this._FuelTypeSubject.asObservable();
    }
    refreshFuelTypeList()
    {
        debugger;
        this._FuelTypeListSubject.next();
    }
    getNewFuelTypeList(): Observable<any> {
        return this._FuelTypeListSubject.asObservable();
    }

    //Companies
    sendSelectedCompany(id: number) {
        debugger;
        this._CompanySubject.next(id);
    }
    getSelectedCompany(): Observable<any> {
        debugger;
        return this._CompanySubject.asObservable();
    }
    refreshCompanyList()
    {
        debugger;
        this._CompanyListSubject.next();
    }
    getNewCompanyList(): Observable<any> {
        return this._CompanyListSubject.asObservable();
    }


    //Branches
    sendSelectedBranch(id: number) {
        this._BranchSubject.next(id);
    }
    getSelectedBranch(): Observable<any> {
        return this._BranchSubject.asObservable();
    }
    refreshBranchList()
    {
        debugger;
        this._BranchListSubject.next();
    }
    getNewBranchList(): Observable<any> {
        return this._BranchListSubject.asObservable();
    }


    //Departments
    sendSelectedDepartment(id: number) {
        this._DepartmentSubject.next(id);
    }
    getSelectedDepartment(): Observable<any> {
        return this._DepartmentSubject.asObservable();
    }
    refreshDepartmentList()
    {
        debugger;
        this._DepartmentListSubject.next();
    }
    getNewDepartmentList(): Observable<any> {
        return this._DepartmentListSubject.asObservable();
    }


    //Governomates
    sendSelectedGovernomate(id: number) {
        this._GovernomateSubject.next(id);
    }
    getSelectedGovernomate(): Observable<any> {
        return this._GovernomateSubject.asObservable();
    }
    refreshGovernomateList()
    {
        debugger;
        this._GovernomateListSubject.next();
    }
    getNewGovernomateList(): Observable<any> {
        return this._GovernomateListSubject.asObservable();
    }

    //VehicleType
    sendSelectedVehicleType(id: number) {
        this._VehicleTypeSubject.next(id);
    }
    getSelectedVehicleType(): Observable<any> {
        return this._VehicleTypeSubject.asObservable();
    }
    refreshVehicleTypeList()
    {
        debugger;
        this._VehicleTypeListSubject.next();
    }
    getNewVehicleTypeList(): Observable<any> {
        return this._VehicleTypeListSubject.asObservable();
    }


    //FuelTanks
    sendSelectedFuelTankGuid(id: string) {
        this._FuelTankSubject.next(id);
    }
    getSelectedFuelTankGuid(): Observable<any> {
        return this._FuelTankSubject.asObservable();
    }
    refreshFuelTankList()
    {
        debugger;
        this._FuelTankListSubject.next();
    }
    getNewFuelTankList(): Observable<any> {
        return this._FuelTankListSubject.asObservable();
    }


}