export interface Database 
{
    select(query: string, params: any[]): any[];
    execute(query: string, params: any[]): boolean;
    getLastInsertId(): number | bigint | null;
}