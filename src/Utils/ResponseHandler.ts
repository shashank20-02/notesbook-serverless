class ResponseHandler{
    public success : boolean;
    public message : string;
    public data : Object;
    constructor(success : boolean , message : string , data : Object){
        this.success = success;
        this.message = message;
        this.data = data;
    }
}

export default ResponseHandler;