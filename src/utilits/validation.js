export const requiredField = () => {
    return "This field is required";
};

export const emailPattern = () => {
    return {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,8}$/i,
        message: "Please enter a valid email ID",
    };
};

export const urlPattern = () => {
    return {
        value: /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
        message: "Please enter a valid web URL",
    };
};

export const PhonePattern = () => {
    return {
        value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/i,
        message: "Please enter a valid mobile number",
    };
};

export const passwordPattern = () => {
    return {
        value: /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        message:
            "Password should include at least one uppercase, one numeric value and one special character",
    };
};

export const otpPattern = () => {
    return {
        value: /^[0-9]{6,6}$/,
        message: "Password should be of 6 digits",
    };
};

export const ifscPattern = () => {
    return {
        value: /^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/,
        message: "Please enter a valid IFSC code.",
    };
};
