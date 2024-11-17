/**
 * Retrieves the current timestamp in milliseconds.
 *
 * @function getTimestamp
 * @returns {number} The current timestamp in milliseconds since the Unix epoch (January 1, 1970).
 */
export const getTimestamp = () => {
    let date = new Date();
    return date.getTime();
};