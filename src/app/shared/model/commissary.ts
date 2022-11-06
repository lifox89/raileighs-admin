export interface commissary{
    commissary_name:string;
    commissary_address:string;
    commissary_manager:string;
    contact_no:string;
    franchise_id:string,
    inactive:boolean,
    items_list?: any[],
    commissary_stores?: any[]
    commissary_id?:string;

}


export interface item{
    item_added:number,
    item_name:string,
    item_qty:number,
    item_unit:string,
    inactive: boolean
}