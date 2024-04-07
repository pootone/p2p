// This is a module with calculate func.
function addition(a, b){
    return a + b;
}

function multiply(a, b){
    return a * b;
}

/// Export function add to module 
// when only one to export
// module.exports = addition; 

// When export multiple functions
module.exports = {
    add: addition,
    multi: multiply
};