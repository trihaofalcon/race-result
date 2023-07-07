const numberOfYears = 5;
const urlGetResult = "https://www.formula1.com/en/results/jcr:content/resultsarchive.html";
const currentYear = new Date().getFullYear();
const dataYears = [...Array(numberOfYears)].map((y, i) => currentYear - i);
const dataTypes = [
    {
        name: "races",
        title: "RACES",
    },
    {
        name: "drivers",
        title: "Drivers",
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

async function fetchData(url) {
    url = url.includes("https::") ? url : `${urlGetResult}${url}`;
    return await fetch(url)
        .then(function (response) {
            // When the page is loaded convert it to text
            return response.text();
        })
        .then(function (html) {
            // Initialize the DOM parser
            var parser = new DOMParser();

            return parser.parseFromString(html, "text/html");
        })
        .catch(function (err) {
            console.log("Failed to fetch: ", err);
        });
}

function procressData(dom, result = {}, type = "") {
    if (!dom) return false;

    //Get table header and body same columns and data
    const header = Array.from(dom.querySelectorAll("table.resultsarchive-table > thead > tr > th"))
        .map(th => th.innerText.trim());
    const body   = Array.from(dom.querySelectorAll("table.resultsarchive-table > tbody > tr"))
        .map(tr => Array.from(tr.querySelectorAll("td")).map(td => {
            const link = td.querySelector("a")?.href || "";
            return link && type
                ? {value: td.innerText.trim(), link: link.split(`${type}/`)?.[1] || ""}
                : td.innerText.trim();
        }));

    //Type "Races" get date
    if (type === "races") {
        result.Date = dom.querySelector(".resultsarchive-content-header > .date > .full-date")?.innerText || "";
    }

    let results = [];
    let rowData = {};
    body.forEach((cell) => {
        rowData = {
            key: result.title || ""
        };
        header.forEach((cap, i) => {
            if (cap) rowData[cap] = cell[i];
        });
        results.push(rowData);
    });
    result.result = results;

    return result;
}

async function crawlData() {
    let data = {};
    for (let year of dataYears) {
        data[year] = {};
        for (let type of dataTypes) {
            const content = await fetchData(`/${year}/${type.name}.html`);
            const dBrands = content.querySelectorAll(".resultsarchive-filter-container div:nth-child(3) a");
            //Haven't dropdown brand
            if (!dBrands.length) {
                data[year][type.name] = [procressData(content, {name: "", title: "All"}, type.name)];
            } else {
                //Have dropdown brand
                //Get data from child
                const raceResults = Array.from(dBrands).map(d => ({
                    name:  d.dataset.value,
                    title: d.querySelector("span").innerText
                }));
                for (let race of raceResults) {
                    if (!race.name || race.name === "all") {
                        data[year][type.name] = procressData(content, race, type.name);
                    } else {
                        const raceUrl   = race?.name ? `${race.name}.html` : "";
                        const resResult = await fetchData(`/${year}/${type.name}/${raceUrl}`);

                        race = procressData(resResult, race, type.name);
                    }
                }
                data[year][type.name] = raceResults;
            }
        }
    }
    return data;
}

const _data = await crawlData();

console.log('DONE!!');
setTimeout(() => {
    console.log(JSON.stringify(_data));
}, 1000);
