const helpers ={}

helpers.emailboton('isAnd', function(cond1, cond2, options) {
    return (cond1 &&  cond2) ? options.fn(this) : options.inverse(this);
});


module.exports=helpers;