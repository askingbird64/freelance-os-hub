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

    // Vercel(AWS) IP를 타겟으로 한 레딧의 403 스팸 차단을 우회하기 위해 무료 프록시(allorigins) 사용
    const proxiedUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

    const response = await fetch(proxiedUrl, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            "Accept": "application/json"
        },
        cache: 'no-store'
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
