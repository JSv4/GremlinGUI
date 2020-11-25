// ############################# GENERAL VALIDATIONS ###################################
export function validateEmail(email) {
    const re = /^\S+@\S+$/;
    return re.test(String(email).toLowerCase());
}

// ########################### NEW USER FORM VALIDATIONS ################################
export function validateNewUserForm(formData, errors) {
    if (!validateEmail(formData.email)) {
        errors.email.addError("Not a valid e-mail address!");
    }
    return errors;
}

// ########################## PASSWORD RESET VALIDATIONS #################################
export function validateResetPassword(formData, errors) {
    if(formData.new_password !== formData.new_password2) {
        errors.new_password2.addError("Two new passwords must match!");
    }
    return errors;
}