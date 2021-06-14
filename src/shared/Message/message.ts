import Swal from 'sweetalert2';


export class message {

    static Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 2500,
        padding: 20,
        animation: true
    });

    static Confirm = Swal.mixin({
        position: 'top',
        showConfirmButton: true,
        showCancelButton: true,
        icon: 'warning',
        customClass: {
            confirmButton: 'btn btn-success margbtn',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false,
        width: 350,
        padding: 10
    }
    );

    static LeaveConfirm = Swal.mixin({
        position: 'top',
        showConfirmButton: true,
        showCancelButton: true,
        icon: 'warning',
        customClass: {
            confirmButton: 'btn btn-success margbtn',
            cancelButton: 'btn btn-danger'
        },
        confirmButtonText: 'Leave',
        buttonsStyling: false,
        width: 350,
        padding: 10
    }
    );

    static Success = Swal.mixin({
        position: 'top',
        timer: 2500,
        showConfirmButton: false,
        showCancelButton: false,
        icon: 'success',
        buttonsStyling: false,
        width: 350,
        padding: 10,
    });

    static Error = Swal.mixin({
        position: 'top',
        showConfirmButton: true,
        showCancelButton: false,
        customClass: {
            confirmButton: 'btn btn-success margbtn'
        },
        icon: 'error',
        buttonsStyling: false,
        width: 350,
        padding: 10,
    });

    static Info = Swal.mixin({
        position: 'top',
        showConfirmButton: true,
        showCancelButton: false,
        customClass: {
            confirmButton: 'btn btn-success margbtn'
        },
        icon: 'info',
        buttonsStyling: false,
        width: 350,
        padding: 10,
    });

    static Question = Swal.mixin({
        position: 'top',
        showConfirmButton: true,
        showCancelButton: false,
        customClass: {
            confirmButton: 'btn btn-success margbtn'
        },
        icon: 'question',
        buttonsStyling: false,
        width: 350,
        padding: 10,
    });
}
