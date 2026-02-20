import Link from "next/link";

import {
  getAvailableNewsYears,
  getAvailableNewsMonths,
  getNewsForYear,
  getNewsForYearAndMonth,
} from "@/lib/news";
import NewsList from "@/components/news-list";

export default async function FilteredNewsPage({ params }) {
  const { filter } = params;
  console.log("filter:", filter);

  const selectedYear = filter?.[0]; //continue only if filter exists, if it is undefined get first element which is year
  const selectedMonth = filter?.[1]; //continue only if filter exists, if it is undefined get second element which is month

  let news = undefined;
  let links = await getAvailableNewsYears(selectedYear);

  // if year is selected but month is not selected
  if (selectedYear && !selectedMonth) {
    news = await getNewsForYear(selectedYear);
    links = getAvailableNewsMonths(selectedYear);
  }

  //if month and year both are selected
  if (selectedYear && selectedMonth) {
    news = await getNewsForYearAndMonth(selectedYear, selectedMonth);
    links = []; // no further links to show when both year and month are selected
  }

  let newsContent = <p>No news found for the selected period</p>; // fallback content when news is undefined or empty

  if (news && news.length > 0) {
    newsContent = <NewsList news={news} />;
  }

  const availableYears = await getAvailableNewsYears();
  // valid year and month check, eg: year=2022 and month=13 or month=abbbb(invalid month)
  // + sign converts string to number
  if (
    (selectedYear && !availableYears.includes(selectedYear)) ||
    (selectedMonth &&
      !getAvailableNewsMonths(selectedYear).includes(selectedMonth))
  ) {
    throw new Error("Invalid filter");
  }

  return (
    <>
      <header id="archive-header">
        <nav className="">
          <ul>
            {links.map((link) => {
              const href = selectedYear
                ? `/archive/${selectedYear}/${link}`
                : `/archive/${link}`;
              return (
                <li key={link}>
                  <Link href={href}>{link}</Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
      {newsContent}
    </>
  );
}
