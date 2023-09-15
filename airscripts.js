$(document).ready(function() {
    // Function to update the progress bar
    function updateProgress() {
        const totalFields = $('form#myForm input').length;
        const filledFields = $('form#myForm input').filter(function() {
            return $.trim(this.value).length > 0;
        }).length;
        const progress = (filledFields / totalFields) * 100;
        $('.progress-bar').css('width', progress + '%').attr('aria-valuenow', progress).text(Math.round(progress) + '%');
    }

    // Initialize the progress bar
    updateProgress();

    // Listen for changes on input fields to update the progress bar
    $('form#myForm input').on('input', function() {
        updateProgress();
    });

    // Function to show validation error
    function showValidationError(fieldName, message) {
        Swal.fire({
            icon: 'warning',
            title: 'Validation Error',
            text: message,
        });
    }

    // Function to validate input fields
    function validateInputField(value, pattern, fieldName, errorMessage) {
        if (!pattern.test(value)) {
            showValidationError(fieldName, errorMessage);
            return false;
        }
        return true;
    }

    // Form submission
    $('#myForm').on('submit', function(event) {
        event.preventDefault();

        const validationRules = {
            'ponumber': {
                pattern: /^\d{10}$/,
                errorMessage: 'Invalid PO Number. It should be exactly 10 digits.',
            },
            'suppliername': {
                pattern: /^[A-Z]+$/,
                errorMessage: 'Supplier should contain only alphabetic characters for supplier name.',
            },
            'consignee': {
                pattern: /^[A-Z ]+$/,
                errorMessage: 'Consignee Name should contain only capital letters.',
            },
            // 'bookingreceiveddate': {
            //     pattern: /^(\d{4}-\d{2}-\d{2})$/,
            //     errorMessage: 'Date should be in the format YYYY-MM-DD.',
            // },
            // 'bkgdate': {
            //     pattern: /^(\d{4}-\d{2}-\d{2})$/,
            //     errorMessage: 'Date should be in the format YYYY-MM-DD.',
            // },
            // 'cargoreadiness': {
            //     pattern: /^(\d{4}-\d{2}-\d{2})$/,
            //     errorMessage: 'Date should be in the format YYYY-MM-DD.',
            // },
            // 'pickupdate': {
            //     pattern: /^(\d{4}-\d{2}-\d{2})$/,
            //     errorMessage: 'Date should be in the format YYYY-MM-DD.',
            // },
            // 'warehousercvd': {
            //     pattern: /^(\d{4}-\d{2}-\d{2})$/,
            //     errorMessage: 'Date should be in the format YYYY-MM-DD.',
            // },
            'countryoforigin': {
                pattern: /^[A-Z]+$/,
                errorMessage: 'Input should contain only alphabetic characters for Country of Origin Name.',
            },
            'terms': {
                pattern: /^[A-Z-]+$/,
                errorMessage: 'Terms should contain only uppercase letters and hyphens (-).',
            },
            'hawbno': {
                pattern: /^[A-Z]+-\d+$/,
                errorMessage: 'HAWB should contain only uppercase letters, hyphens (-), and numbers.',
            },
            'mawb': {
                pattern: /^[\d-]+$/,
                errorMessage: 'MAWB should contain only hyphens (-) and numbers.',
            },
            'pkgs': {
                pattern: /^\d+$/,
                errorMessage: 'PKGS should contain only numbers.',
            },
            'grswt': {
                pattern: /^\d+(\.\d+)?$/,
                errorMessage: 'GRSWT should contain only numbers and decimal numbers (optional).',
            },
            'chgwt': {
                pattern: /^\d+$/,
                errorMessage: 'CHGWT should contain only numbers.',
            },
            'fltdetails': {
                pattern: /^[A-Z0-9\s/]+$/,
                errorMessage: 'FLTDetails should contain only uppercase letters, numbers, and slash (/).',
            },
            // 'etd': {
            //     pattern: /^(\d{4}-\d{2}-\d{2})$/,
            //     errorMessage: 'ETD should be in the format YYYY-MM-DD.',
            // },
            // 'eta': {
            //     pattern: /^(\d{4}-\d{2}-\d{2})$/,
            //     errorMessage: 'ETA should be in the format YYYY-MM-DD.',
            // },
            // 'revisedetd': {
            //     pattern: /^(\d{4}-\d{2}-\d{2})$/,
            //     errorMessage: 'Revised ETD should be in the format YYYY-MM-DD.',
            // },
            // 'revisedeta': {
            //     pattern: /^(\d{4}-\d{2}-\d{2})$/,
            //     errorMessage: 'Revised ETA should be in the format YYYY-MM-DD.',
            // },
            'ata': {
                pattern: /^[A-Z]+$/,
                errorMessage: 'ATA should be in alphabetic words.',
            },
            // 'prealertdtd': {
            //     pattern: /^(\d{4}-\d{2}-\d{2})$/,
            //     errorMessage: 'PreAlertDtd should be in the format YYYY-MM-DD.',
            // },
            'remarks': {
                pattern: /^[A-Z,.]+$/,
                errorMessage: 'Remarks should contain only uppercase letters, commas, and periods.',
            },
        };

        let isValid = true;

        for (const fieldName in validationRules) {
            const value = $(`#${fieldName}`).val();
            const rule = validationRules[fieldName];
            if (!validateInputField(value, rule.pattern, fieldName, rule.errorMessage)) {
                isValid = false;
                break;
            }
        }

        if (!isValid) {
            return;
        }

        // Show spinner
        const spinner = '<div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div>';
        $('button[type="submit"]').html(spinner).attr('disabled', true);

        // Initialize an empty payload object
        const payload = {
            formData: {},
            key: 'database/drs_air_shipment.csv',  // Replace with your file/database name
            bucket: 'dsrapp'  // Replace with your bucket name
        };

        // Loop through each input field and populate the formData object
        $('form#myForm input').each(function() {
            const fieldId = $(this).attr('id');
            const fieldValue = $(this).val();
            payload.formData[fieldId] = fieldValue.trim() !== '' ? fieldValue : null;
        });

        // Define the API Gateway URL
        var apiURL = 'https://w0gfsk9d0g.execute-api.ap-south-1.amazonaws.com/prod/surveydata_to_s3';

        // Make the AJAX call
        $.ajax({
            url: apiURL,
            type: 'POST',
            data: JSON.stringify(payload),
            contentType: 'application/json; charset=utf-8',
            success: function(response) {
                // Hide spinner
                $('button[type="submit"]').html('Submit').attr('disabled', false);

                // Show Swal alert
                Swal.fire({
                    icon: 'success',
                    title: 'Form Submitted Successfully!',
                    text: 'Your data has been saved.'
                });
            },
            error: function(error) {
                // Hide spinner
                $('button[type="submit"]').html('Submit').attr('disabled', false);

                // Show Swal alert
                Swal.fire({
                    icon: 'error',
                    title: 'An Error Occurred!',
                    text: 'Please try again.'
                });
            }
        });
    });
});

    // Initialize the progress bar
    updateProgress();

    // Listen for changes on input fields to update the progress bar
    $('form#myForm input').on('input', function () {
        updateProgress();
    });

    // Form submission
    $('#myForm').on('submit', function (event) {
        event.preventDefault();
        submitForm();
    });

    