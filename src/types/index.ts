
export interface IData {
    year: string | keyof typeof crawlData,
    type: string,
    grand: string
}

export interface IGrand {
    name: string,
    title: string,
    result: any[]
}

export interface IDataSet {
    label: string,
    data: number[],
    backgroundColor: string,
}
export interface IDataChart {
    labels: string[],
    datasets: IDataSet[]
}
