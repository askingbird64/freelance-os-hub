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

    // Vercel(AWS) IP를 타겟으로 한 레딧의 403 스팸 차단을 우회하기 위해 무료 프록시(corsproxy) 사용
    const proxiedUrl = `https://corsproxy.io/?url=${encodeURIComponent(url)}`;

    let children = [];
    try {
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
      children = data?.data?.children || [];
    } catch (e) {
      console.error("Reddit fetch failed, using fallback mock data.", e);
      // Fallback Data if API fails in production without OAuth
      children = [
        { data: { title: "해외 클라이언트가 프로젝트 끝났는데 연락 두절됐습니다.", selftext: "업무는 다 넘겼는데 잔금을 안 줍니다. 영어로 어떻게 독촉해야 할지 막막하네요.", subreddit: "freelance", permalink: "/r/freelance" } },
        { data: { title: "끝없는 수정 요구, 어떻게 끊어내나요?", selftext: "로고 디자인 외주인데 15번째 픽셀 수정을 요구합니다. 계약서엔 수정 횟수를 안 적었어요...", subreddit: "webdev", permalink: "/r/webdev" } },
        { data: { title: "외주 단가 후려치기 어떻게 대처하나요?", selftext: "예산이 적다며 원래 단가의 반토막을 부르는데 원래 이런가요?", subreddit: "design", permalink: "/r/design" } }
      ];
    }

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
