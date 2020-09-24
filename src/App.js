import {
  FormControl,
  MenuItem,
  Select,
  Card,
  CardContent,
  
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import "./App.css";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import Map from "./Map";
import Table from "./Table";
import { sortData } from "./util";
import { prettyPrintStat } from "./util";
import "leaflet/dist/leaflet.css";
import Footerr from "./Footerr";
function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapContries, setMapContries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  //for worldwide data featching
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((Response) => Response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  // for featching data
  useEffect(() => {
    // we are using async becouse when we send reques to server we wait and the do something with data

    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((Response) => Response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, // Gives Countory Name Like:-  United Kingdom , United State Amerika,  India
            value: country.countryInfo.iso2, // Gives UK, USA, IN
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapContries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  // for remember the select countory
  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode);

    // for exact match of select countory data
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((Response) => Response.json())
      .then((data) => {
        setCountry(countryCode);

        // All of the data from the country response
        setCountryInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  console.log(countryInfo);

  // Dark Mode

  return (
    <div>
      <div className="app">
        <div className="app__left">
          <div className="app__header">
            <h1 className="app__headerTitle">COVID-19 TRACKER</h1>

            <FormControl className="app__dropdown">
              <Select
                variant="outlined"
                onChange={onCountryChange}
                value={country}
              >
                <MenuItem value="worldwide">worldwide</MenuItem>

                {countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* InfoBoxs */}
          <div className="app__stats">
            <InfoBox
              isRed
              active={casesType === "cases"}
              onClick={(e) => setCasesType("cases")}
              title="Active Cases"
              cases={prettyPrintStat(countryInfo.todayCases)}
              total={prettyPrintStat(countryInfo.cases)}
            />

            <InfoBox
              active={casesType === "recovered"}
              onClick={(e) => setCasesType("recovered")}
              title="Recoverd"
              cases={prettyPrintStat(countryInfo.todayRecovered)}
              total={prettyPrintStat(countryInfo.recovered)}
            />

            <InfoBox
              isRed
              active={casesType === "deaths"}
              onClick={(e) => setCasesType("deaths")}
              title="Deaths"
              cases={prettyPrintStat(countryInfo.todayDeaths)}
              total={prettyPrintStat(countryInfo.deaths)}
            />
          </div>

          {/* Map  */}

          <Map
            casesType={casesType}
            countries={mapContries}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>
        <Card className="app__right">
          <CardContent>
            {/* Table */}
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />

            {/* Graph  */}
            <h3 className="app__graphTitle">World wide new {casesType}</h3>
            <LineGraph className="app__graph" casesType={casesType} />
          </CardContent>
        </Card>
      </div>
      <Footerr />
    </div>
  );
}

export default App;
