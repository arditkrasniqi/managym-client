/*
    URL Parser
    Ardit Krasniqi
    http://github.com/arditkrasniqi
    10/25/2017
*/
var URL = {
    path:document.location.href, // the current url to parse
    pathname:document.location.pathname,
    url:[],
    get:function(key){ // this returns the value of the given key (example: '?name=myname') URL.get('name') returns "myname"
        var val = this.path.substr(this.path.indexOf(key) + key.length + 1); // substring path by the given key
        if(!this.path.includes(key)){ // checks if given argument exists on url
            // throw new Error("Key \"" + key + "\" not found on URL"); // if not, throw Error
            return false;
        }
        // if path includes '&', substring path from 0 to character '&'
        if(val.includes('&')){
            val = val.substring(0,val.indexOf('&'));
        }
        return val;
    },
    split:function(delimeter){
        this.url = [];
        var tmp = this.pathname.split(delimeter);
        for(i in tmp){
            if(i > 0){
                this.url.push(tmp[i]);
            }
        }
        return this;
    },
    getFromUrl:function(index){
        if(index < 0 || index > this.url.length - 1){
            throw new Error("Index must be > 0 <= " + (this.url.length - 1));
        }
        return this.url[index];
    }
}
export default URL