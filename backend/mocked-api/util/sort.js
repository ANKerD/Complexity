const sort = (invert, problems) => {
    if(invert){
        problems.sort(function(a,b) {
            if(a.level > b.level) return -1;
            else if(a.level < b.level) return 1;
            else 0;
        });    
    }else{
        problems.sort(function(a,b) {
            if(a.level < b.level) return -1;
            else if(a.level > b.level) return 1;
            else 0;
        });
    }
    return problems;
}

module.exports = sort;