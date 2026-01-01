#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Yahoo!ニュース自動収集スクリプト
毎日の重要ニュースを収集してMarkdownファイルとして保存
"""

import os
import re
from datetime import datetime, timezone, timedelta
from pathlib import Path

import requests
from bs4 import BeautifulSoup

# 日本時間のタイムゾーン
JST = timezone(timedelta(hours=9))

# 優先テーマのキーワード
PRIORITY_KEYWORDS = {
    "広告・PR・デジタルマーケティング": [
        "広告", "PR", "マーケティング", "デジタル広告", "SNS広告",
        "インフルエンサー", "プロモーション", "ブランド", "CM"
    ],
    "生成AI・AIビジネス・AI政策": [
        "AI", "人工知能", "ChatGPT", "生成AI", "機械学習",
        "ディープラーニング", "OpenAI", "Google AI", "LLM"
    ],
    "M&A・企業再生・事業再編": [
        "M&A", "買収", "合併", "企業再生", "事業再編",
        "経営統合", "TOB", "MBO", "事業譲渡", "倒産", "再建"
    ],
    "地域創生・地方経済・自治体施策": [
        "地方創生", "地域活性", "自治体", "過疎", "移住",
        "ふるさと納税", "地方経済", "地域振興", "まちづくり"
    ]
}

# 除外キーワード（エンタメ・ゴシップ・スポーツ）
EXCLUDE_KEYWORDS = [
    "野球", "サッカー", "ゴルフ", "テニス", "バスケ",
    "芸能", "アイドル", "ジャニーズ", "AKB", "熱愛",
    "離婚", "不倫", "スキャンダル", "ゴシップ",
    "アニメ", "ゲーム", "漫画", "映画", "ドラマ",
    "エンタメ", "お笑い", "バラエティ"
]

# Yahoo!ニュースのURL
YAHOO_NEWS_TOP = "https://news.yahoo.co.jp/"
YAHOO_NEWS_TOPICS = "https://news.yahoo.co.jp/topics"


def get_soup(url: str) -> BeautifulSoup:
    """URLからBeautifulSoupオブジェクトを取得"""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    response = requests.get(url, headers=headers, timeout=30)
    response.raise_for_status()
    return BeautifulSoup(response.text, "lxml")


def extract_articles_from_top() -> list[dict]:
    """トップページから記事を抽出"""
    articles = []
    
    try:
        soup = get_soup(YAHOO_NEWS_TOP)
        
        # トピックスのリンクを探す
        # Yahoo!ニュースの構造に合わせて複数のセレクタを試行
        selectors = [
            "a[href*='/articles/']",
            "a[href*='/pickup/']",
            ".newsFeed_item a",
            ".topics a",
        ]
        
        seen_urls = set()
        
        for selector in selectors:
            links = soup.select(selector)
            for link in links:
                href = link.get("href", "")
                title = link.get_text(strip=True)
                
                # URLの正規化
                if href.startswith("/"):
                    href = "https://news.yahoo.co.jp" + href
                
                # フィルタリング
                if not title or len(title) < 10:
                    continue
                if href in seen_urls:
                    continue
                if not ("news.yahoo.co.jp" in href and ("/articles/" in href or "/pickup/" in href)):
                    continue
                
                seen_urls.add(href)
                articles.append({
                    "title": title,
                    "url": href,
                    "source": "トップページ"
                })
                
                if len(articles) >= 20:  # 十分な候補を収集
                    break
            
            if len(articles) >= 20:
                break
                
    except Exception as e:
        print(f"トップページの取得に失敗: {e}")
    
    return articles


def is_excluded(title: str) -> bool:
    """除外対象の記事かどうかを判定"""
    return any(keyword in title for keyword in EXCLUDE_KEYWORDS)


def get_priority_category(title: str) -> tuple[str, int]:
    """優先カテゴリとスコアを返す"""
    for category, keywords in PRIORITY_KEYWORDS.items():
        for keyword in keywords:
            if keyword in title:
                return category, 10  # 優先テーマに該当
    return "主要ニュース（総合）", 5  # 一般ニュース


def generate_importance_reason(title: str, category: str) -> str:
    """ビジネス視点での重要性を生成"""
    if "AI" in category:
        return f"AI・テクノロジー分野の最新動向として注目。企業のDX戦略や競争環境に影響を与える可能性がある。"
    elif "広告" in category or "マーケティング" in category:
        return f"広告・マーケティング業界のトレンドを反映。クライアント提案やメディア戦略の参考になる。"
    elif "M&A" in category or "企業再生" in category:
        return f"業界再編や企業動向の重要指標。ビジネス機会や競合分析の観点で注視すべき。"
    elif "地域" in category or "地方" in category:
        return f"地域経済・自治体施策の動向。地方クライアントとの連携や新規事業の参考になる。"
    else:
        return f"主要ニュースとして社会的関心が高い話題。ビジネス環境の変化を示唆する可能性がある。"


def select_top_articles(articles: list[dict], max_count: int = 5) -> list[dict]:
    """記事を選別して上位を返す"""
    scored_articles = []
    
    for article in articles:
        title = article["title"]
        
        # 除外判定
        if is_excluded(title):
            continue
        
        # カテゴリとスコア
        category, score = get_priority_category(title)
        article["category"] = category
        article["score"] = score
        article["importance"] = generate_importance_reason(title, category)
        
        scored_articles.append(article)
    
    # スコア順にソート
    scored_articles.sort(key=lambda x: x["score"], reverse=True)
    
    return scored_articles[:max_count]


def save_article_as_markdown(article: dict, output_dir: Path, index: int) -> None:
    """記事をMarkdownファイルとして保存"""
    now = datetime.now(JST)
    
    content = f"""# {article['title']}

- **URL**: {article['url']}
- **カテゴリ**: {article['category']}
- **取得日時**: {now.strftime('%Y年%m月%d日 %H:%M:%S')} (JST)

## なぜ重要か

{article['importance']}
"""
    
    filename = output_dir / f"article_{index}.md"
    filename.write_text(content, encoding="utf-8")
    print(f"保存: {filename}")


def main():
    """メイン処理"""
    print("=" * 50)
    print("Yahoo!ニュース自動収集スクリプト")
    print("=" * 50)
    
    # 記事を収集
    print("\n📰 トップページから記事を収集中...")
    articles = extract_articles_from_top()
    print(f"  → {len(articles)}件の候補を取得")
    
    # フィルタリングと選別
    print("\n🔍 記事を選別中...")
    top_articles = select_top_articles(articles, max_count=5)
    print(f"  → {len(top_articles)}件を選出")
    
    if not top_articles:
        print("\n⚠️ 保存対象の記事がありませんでした")
        return
    
    # 出力ディレクトリを作成
    now = datetime.now(JST)
    output_dir = Path("articles") / now.strftime("%Y-%m-%d_%H%M%S")
    output_dir.mkdir(parents=True, exist_ok=True)
    print(f"\n📁 保存先: {output_dir}")
    
    # 記事を保存
    for i, article in enumerate(top_articles, 1):
        save_article_as_markdown(article, output_dir, i)
    
    print("\n✅ 完了!")
    print(f"  保存件数: {len(top_articles)}件")


if __name__ == "__main__":
    main()
