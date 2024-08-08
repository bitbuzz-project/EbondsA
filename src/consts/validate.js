export function validateEmail(email) {
    let regular = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gim;
    if (email.match(regular)) return true;
    else return false;
}

export function validateName(name) {
    let regular = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g;
    if (name.match(regular)) return true;
    else return false;
}

export function validatePhone(phoneNo) {
    //validation work without country code!!!!!!!
    //validate phone numbers of format "1234567890"
    if (phoneNo.match('\\d{10}')) return true;
    //validating phone number with -, . or spaces
    else if (phoneNo.match('\\d{3}[-\\.\\s]\\d{3}[-\\.\\s]\\d{4}')) return true;
    //validating phone number with extension length from 3 to 5
    else if (phoneNo.match('\\d{3}-\\d{3}-\\d{4}\\s(x|(ext))\\d{3,5}'))
        return true;
    //validating phone number where area code is in braces ()
    else if (phoneNo.match('\\(\\d{3}\\)-\\d{3}-\\d{4}')) return true;
    //return false if nothing matches the input
    else return false;
}

export function validateCreditCard(creditCardNo) {
    let regular = /^((4\d{3})|(5[1-5]\d{2}))(-?|\040?)(\d{4}(-?|\040?)){3}|^(3[4,7]\d{2})(-?|\040?)\d{6}(-?|\040?)\d{5}/g;
    if (creditCardNo.match(regular)) return true;
    else return false;
}

export function validateStreet(street) {
    let regular = /^\d+\s[A-z]+\s[A-z]+/g;
    if (street.match(regular)) return true;
    else return false;
}

export function validatePassword(password) {
    let regular = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/g;
    // at least one upper case, one lower case English letter, one digit,one special character, min lenght 8
    // if (password.match(regular))

    if (password.length >= 8) return true;
    else return false;
}
