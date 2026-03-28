import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { mainKeyword, subredditList, maxPosts } = await req.json();
    
    let url = `https://www.reddit.com/search.json?q=${encodeURIComponent(mainKeyword)}&limit=${maxPosts}`;
    
    // If subreddit is specified, search only in the first one
    const subreddits = subredditList ? subredditList.split(",").map((s: string) => s.trim().replace('r/', '')) : [];
    if (subreddits.length > 0 && subreddits[0] !== "") {
       url = `https://www.reddit.com/r/${subreddits[0]}/search.json?q=${encodeURIComponent(mainKeyword)}&restrict_sr=1&limit=${maxPosts}`;
    }

    const response = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Accept": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Reddit API returned ${response.status}`);
    }

    const data = await response.json();
    const children = data?.data?.children || [];

    const rawContents = children.map((child: any, idx: number) => {
        let text = `${child.data.title}\n\n${child.data.selftext}`.trim();
        // If it's too long, safely truncate
        if (text.length > 1500) text = text.slice(0, 1500) + "...";
        
        return {
            id: idx + 1,
            sourceType: "post",
            subreddit: `r/${child.data.subreddit}`,
            rawText: text,
            url: `https://www.reddit.com${child.data.permalink}`
        };
    }).filter((c: any) => c.rawText.length > 20); // filter out empty metadata posts

    return NextResponse.json({ success: true, count: rawContents.length, rawContents });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
