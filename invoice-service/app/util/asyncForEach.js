/* eslint-disable prettier/prettier */
/**
 * An async version forEach
 * @param {Array} array The array to iterate oaver
 * @param {Function} callback the callback function for the Array
 */
export default async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}


