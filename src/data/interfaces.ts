
export interface Data {
    [key: string]: DataType
}
export interface DataType {
    [key: string]: DataGrand
}
export interface DataGrand {
    name: string,
    title: string,
    result: object[]
}
