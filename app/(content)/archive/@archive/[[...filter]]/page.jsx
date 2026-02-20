import { Suspense } from "react";
import Link from "next/link";

import {
  getAvailableNewsYears,
  getAvailableNewsMonths,
  getNewsForYear,
  getNewsForYearAndMonth,
} from "@/lib/news";
import NewsList from "@/components/news-list";

async function FilterHeader({ year, month }) {
  const availableYears = await getAvailableNewsYears();
  let links = availableYears; // default links to show are years

  // if year is selected but month is not selected
  if (year && !month) {
    links = getAvailableNewsMonths(year);
  }

  //if month and year both are selected
  if (year && month) {
    links = []; // no further links to show when both year and month are selected
  }

  // valid year and month check, eg: year=2022 and month=13 or month=abbbb(invalid month)
  // +sign is removed because query params are always string, so we can directly compare with string values in getAvailableNewsMonths function
  if (
    (year && !availableYears.includes(year)) ||
    (month && !getAvailableNewsMonths(year).includes(month))
  ) {
    throw new Error("Invalid filter");
  }

  return (
    <header id="archive-header">
      <nav className="">
        <ul>
          {links.map((link) => {
            const href = year ? `/archive/${year}/${link}` : `/archive/${link}`;
            return (
              <li key={link}>
                <Link href={href}>{link}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

async function FilteredNews({ year, month }) {
  let news;
  if (year && !month) {
    news = await getNewsForYear(year);
  } else if (year && month) {
    news = await getNewsForYearAndMonth(year, month);
  }

  let newsContent = <p>No news found for the selected period</p>; // fallback content when news is undefined or empty

  if (news && news.length > 0) {
    newsContent = <NewsList news={news} />;
  }
  return newsContent;
}

export default async function FilteredNewsPage({ params }) {
  const { filter } = params;
  console.log("filter:", filter);

  const selectedYear = filter?.[0]; //continue only if filter exists, if it is undefined get first element which is year
  const selectedMonth = filter?.[1]; //continue only if filter exists, if it is undefined get second element which is month

  return (
    <>
      <Suspense fallback={<p>Loading filters...</p>}>
        <FilterHeader year={selectedYear} month={selectedMonth} />
      </Suspense>
      <Suspense fallback={<p>Loading news...</p>}>
        <FilteredNews year={selectedYear} month={selectedMonth} />
      </Suspense>
    </>
  );
}
