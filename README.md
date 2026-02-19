# Employers Widget

This widget was created for the Boston College Law School's "[Our Employers](www.bc.edu/bc-web/schools/law/careers/employment-statistics/our-employers.html)" page. It displays a list of employment outcomes, interactively filterable by state, region, or country.

This widget pulls data in CSV form from a published Google Sheet, and parses it into an object using [Papa Parse](https://www.papaparse.com/). The object is then fed into a [DataTable](https://datatables.net/) with the [RowGroup](https://datatables.net/extensions/rowgroup/) extension to enable "State" subheaders. The filter buttons are created by us.
