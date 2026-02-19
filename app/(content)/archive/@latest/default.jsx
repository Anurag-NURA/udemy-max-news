import NewsList from "@/components/news-list";
import { getLatestNews } from "@/lib/news";

export default function DefaultLatestNews() {
    const latestNews = getLatestNews();
    return (
        <>
            <h1>Latest News</h1>
            <NewsList news={latestNews} />
        </>
    );
}
