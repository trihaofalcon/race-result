import React, {useEffect, useState} from "react";
import {
    Box,
    Grid,
    Select,
    MenuItem,
    SelectChangeEvent,
    Table,
    TableContainer,
    Paper,
    TableHead,
    TableBody,
    TableCell,
    TableRow
} from "@mui/material";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

const crawlData = require("../data/crawl-data");

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
const dataTypes = [
    {
        name: "races",
        title: "RACES",
    },
    {
        name: "drivers",
        title: "DRIVERS",
    },
    {
        name: "team",
        title: "TEAMS",
    },
    {
        name: "fastest-laps",
        title: "DHL FASTEST LAP AWARD",
    },
];

const defineCharts = {
    races: {name: "Grand Prix|Driver", value: "Pts|Laps"},
    drivers: {name: "Driver|Grand Prix", value: "Pts"},
    team: {name: "Team|Grand Prix", value: "Pts"}
};

interface iData {
    year: string | keyof typeof crawlData,
    type: string,
    grand: string
}

interface iGrand {
    name: string,
    title: string,
    result: any[]
}

function splitString(str, splitLast = false) {
    str = str.replaceAll(/\n|\t/g, "").replaceAll(/\s+/g, " ").trim();
    return splitLast
        ? (str.lastIndexOf(" ") > 0 ? str.substring(0 , str.lastIndexOf(" ")) : str)
        : str
}

const Dashboard: React.FC = () => {
    const [data, setData] = useState<iData>({
        year: "2023",
        type: "races",
        grand: ""
    });
    const [dataYears, setDataYears] = useState<string[]>([]);
    const [dataGrand, setDataGrand] = useState<iGrand[]>([]);
    const [dataResults, setDataResults] = useState<object[]>([]);
    const [dataColumns, setDataColumns] = useState<string[]>([]);
    const [dataChart, setDataChart] = useState<any>({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
        //Get years data..
        let years = Object.keys(crawlData);
        setDataYears(years.sort().reverse());
    }, []);

    useEffect(() => {
        //Get years data..
        const _dataGrand = crawlData[data.year][data.type];
        setDataGrand(_dataGrand);
        if (_dataGrand.length) setData({...data, grand: _dataGrand[0].name || ""});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.year, data.type]);

    useEffect(() => {
        let results: object[] = [];
        let columns: string[] = [];
        results = dataGrand?.find(d => d.name === data.grand)?.result || [];
        if (results?.length) columns = Object.keys(results[0] || {});

        //Draw data chart
        if (data.type in defineCharts) {
            let {name: displayChart, value: valueChart} = defineCharts[data.type as keyof typeof defineCharts] || {};
            let labelChart = [];
            let _dataChart = [];
            let _displayChart: string[] = displayChart.split("|");
            let _valueChart: string[] = valueChart.split("|");
            for (let rs of results) {
                //create label chart
                let label: any = {};
                for (let d of _displayChart) {
                    if (d in rs) {
                        label = splitString(rs[d]?.value || rs[d], ["Driver"].includes(d)); break;
                    }
                }
                //create data chart
                let value: any = "";
                for (let d of _valueChart) {
                    if (d in rs || d.toUpperCase() in rs) {
                        value = rs[d] || rs[d.toUpperCase()]; break;
                    }
                }
                labelChart.push(label);
                _dataChart.push(value);
            }
            setDataChart({
                labels: labelChart,
                datasets: [
                    {
                        label: valueChart,
                        data: _dataChart,
                        backgroundColor: "#90caf9",
                    }
                ],
            });
        }

        setDataResults(results);
        setDataColumns(columns);
    }, [data.grand, data.type, dataGrand]);

    const handleChange = (key: string, e: SelectChangeEvent) => {
        switch (key) {
            case "year":
                setData({...data, year: e.target.value, grand: ""});
                break;
            case "type":
                setData({...data, type: e.target.value, grand: ""});
                break;
            case "grand":
                setData({...data, grand: e.target.value});
                break;
            default:
                break;
        }
    };

    const onClick = (grand: string) => {
        grand = grand.replace("/race-result.html", "").replace(".html", "");
        setData({...data, grand: grand});
    };

    return (
        <Box sx={{flexGrow: 1, p: 2}}>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Select
                        value={data?.year}
                        style={{width: "100%"}}
                        // @ts-ignore Typings are not considering `native`
                        onChange={e => handleChange("year", e)}
                        label={"Years"}
                    >
                        {dataYears && dataYears.map(year => {
                            return <MenuItem key={year} value={year}>{year}</MenuItem>
                        })}
                    </Select>
                </Grid>
                <Grid item xs={4}>
                    <Select
                        value={data?.type}
                        style={{width: "100%"}}
                        // @ts-ignore Typings are not considering `native`
                        onChange={e => handleChange("type", e)}
                        label={"Type"}
                    >
                        {dataTypes && dataTypes.map((type, idx) => {
                            return <MenuItem key={idx} value={type.name}>{type.title}</MenuItem>
                        })}
                    </Select>
                </Grid>
                <Grid item xs={4}>
                    {dataGrand?.length && <Select
                        value={data?.grand || ""}
                        style={{width: "100%"}}
                        displayEmpty={false}
                        // @ts-ignore Typings are not considering `native`
                        onChange={e => handleChange("grand", e)}
                        label={"Grand"}
                    >
                        {dataGrand && dataGrand.map((type, idx) => {
                            return <MenuItem key={idx} value={type.name}>{type.title}</MenuItem>
                        })}
                    </Select>}
                </Grid>
                <Grid item xs={12}>
                    <div className={"w-10/12 m-auto"}>
                    {data.type in defineCharts && <Bar options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false,
                                fullSize: false,
                            },
                            title: {
                                display: true,
                                text: `${String(data.year)} - ${data.type.toUpperCase()}`,
                            },
                        },
                    }} data={dataChart} />}
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <Table sx={{minWidth: 650}} size={"medium"} aria-label="simple table">
                            <TableHead sx={{bgcolor: 'text.secondary'}}>
                                <TableRow>
                                    {dataColumns?.map((col, idx) => {
                                        if (["key", "name"].includes(col)) return null;
                                        return <TableCell
                                            key={idx}
                                            sx={{
                                                color: 'background.paper',
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {col.toUpperCase()}
                                        </TableCell>
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dataResults?.map((row, idx) => {
                                    return <TableRow
                                        key={idx}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        {dataColumns?.map((col, iCol) => {
                                            if (["key"].includes(col)) return null;
                                            const cell: any = row[col as keyof typeof row]
                                                ? row[col as keyof typeof row]
                                                : row[col.toUpperCase() as keyof typeof row]
                                            return <TableCell key={iCol}>
                                                {typeof cell !== "string" && cell?.link
                                                    ? <span style={{cursor: "pointer"}} onClick={() => onClick(cell?.link)}>{cell?.value}</span>
                                                    : cell?.value || cell
                                                }
                                            </TableCell>
                                        })}
                                    </TableRow>
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
