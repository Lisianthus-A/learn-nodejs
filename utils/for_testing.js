const palindrome = (str) => {
    return str.split('').reverse().join('');
};

const average = (array) => {
    return array.length === 0
        ? 0
        : array.reduce((prev, curr) => prev + curr, 0) / array.length;
};

module.exports = {
    palindrome,
    average
};