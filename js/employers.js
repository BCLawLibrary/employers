async function fetchCSVData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch CSV");
    return Papa.parse(await response.text(), {
      header: true,
      skipEmptyLines: true,
    });
  } catch (error) {
    console.error(error);
    return { data: [] }; // Return empty data in case of error
  }
}

async function convertDataToObject(url) {
  const CSVdata = await fetchCSVData(url);
  return CSVdata.data;
}

function initializeTable(data) {
  const custom_columns = [
    { title: "Employer", data: "Employer" },
    { title: "State", data: "State", visible: false },
    { title: "Region", data: "Region", visible: false },
    { title: "Country", data: "Country", visible: false },
  ];

  const table = new DataTable("#employers__table", {
    dom: "Brt", // buttons, processing, table
    autoWidth: false,
    paging: false,
    data: data,
    columns: custom_columns,
    order: [
      [3, "desc"],
      [1, "asc"],
      [0, "asc"],
    ],
    rowGroup: { dataSrc: "State" }, // relies on RowGroup extension
  });

  return table;
}

function makeButtons(values, containerId, colIndex, table, stateRegionMap) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  values.forEach((value) => {
    const button = document.createElement("button");
    button.textContent = value;

    button.addEventListener("click", () => {
      if (value === "All") {
        table.columns().search("").draw();
      } else {
        table.columns(colIndex).search(value).draw();
      }

      if (colIndex === 2) {
        table.columns(1).search("").draw();
        filterStateButtons(value, stateRegionMap);
      }
    });
    container.appendChild(button);
  });
}

function filterStateButtons(region, stateRegionMap) {
  const stateButtons = document.querySelectorAll("#state-buttons button");
  stateButtons.forEach((button) => {
    const state = button.textContent;
    if (region === "All" || stateRegionMap[state] === region) {
      button.style.display = "inline-block";
    } else {
      button.style.display = "none";
    }
  });
}

$(document).ready(function () {
  async function main() {
    const url =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSM6woYFCrMJ-0t9H-ANb5rn8TnUt7nWwybiOA4r-onVw1GozHk6mu6hslGQH5kIf1sURjnipuiPMky/pub?gid=0&single=true&output=csv";
    const data = await convertDataToObject(url);

    var table = initializeTable(data);
    var stateRegionMap = {};
    data.forEach((item) => {
      stateRegionMap[item.State] = item.Region;
    });

    // ... is the spread operator
    const states = [...Object.keys(stateRegionMap)];
    const regions = [
      "All",
      "New England",
      "Mid-Atlantic",
      "Midwest",
      "South",
      "West",
      "International",
    ];

    makeButtons(states, "state-buttons", 1, table, stateRegionMap);
    makeButtons(regions, "region-buttons", 2, table, stateRegionMap);

    $(".policies__loading").hide();
  }

  main();
});
