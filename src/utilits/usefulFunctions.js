export const formatDate = (date) => {
    return `${new Date(date?.toString()).getDate()} ${new Date(date)?.toLocaleString("default", {
        month: "short",
    })}, ${new Date(date)?.getFullYear()}`;
};

export const convert24Hourto12Hour = (time) => {
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) {
        // If time format correct
        time = time.slice(1); // Remove full string match value
        time[5] = +time[0] < 12 ? "am" : "pm"; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
};

export const dateNumberToName = (number) => {
    // 0-indexed
    return number == 0
        ? "January"
        : number == 1
        ? "February"
        : number == 2
        ? "March"
        : number == 3
        ? "April"
        : number == 4
        ? "May"
        : number == 5
        ? "June"
        : number == 6
        ? "July"
        : number == 7
        ? "August"
        : number == 8
        ? "September"
        : number == 9
        ? "October"
        : number == 10
        ? "November"
        : "December";
};

export const capitalizeFirstLetter = (s) => s?.charAt(0)?.toUpperCase() + s?.slice(1);
