/**
 * validation.js
 *
 * This file provides functions to validate user input
 */

/**
 * Checks if a username is valid based on a regex pattern.
 * A valid username must be 3 to 10 characters long and contain only letters and numbers.
 *
 * @param {string} username - The username to validate.
 * @returns {boolean} - Returns `true` if the username is valid; otherwise `false`.
 */
function validUsername(username) {
    const usernamePattern = /^[a-zA-Z0-9]{3,10}$/;
    return usernamePattern.test(username);
}

/**
 * Checks if a password is valid based on a regex pattern.
 * A valid password must be at least 6 characters long and contain at least one number.
 *
 * @param {string} password - The password to validate.
 * @returns {boolean} - Returns `true` if the password is valid; otherwise `false`.
 */
function validPassword(password) {
    const passwordPattern = /^(?=.*\d).{6,}$/;
    return passwordPattern.test(password);
}

/**
 * Checks if two passwords match.
 *
 * @param {string} password - The original password.
 * @param {string} confirmPassword - The confirmation password.
 * @returns {boolean} - Returns `true` if the passwords match; otherwise `false`.
 */
function matchingPassword(password, confirmPassword) {
    return password === confirmPassword;
}

module.exports = {validUsername, validPassword, matchingPassword};