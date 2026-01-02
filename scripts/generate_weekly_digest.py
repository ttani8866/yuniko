#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
週次 重要ニュース要約＋経営示唆生成スクリプト
過去7日分の記事からエグゼクティブサマリーを作成
"""

import os
from datetime import datetime, timezone, timedelta
from pathlib import Path

# 日本時間のタイムゾーン
JST = timezone(timedelta(hours=9))

def get_weekly_articles():
    """過去7日分の保存済み記事を取得"""
    articles_root = Path("articles")
    if not articles_root.exists():
        return []
    
    # 7日前
    seven_days_ago = datetime.now(JST) - timedelta(days=7)
    
    weekly_articles = []
    
    # サブディレクトリ（日付順）を探索
    for day_dir in sorted(articles_root.iterdir(), reverse=True):
        if not day_dir.is_dir():
            continue
            
        try:
            # フォルダ名が YYYY-MM-DD_... 形式であることを想定
            dir_date_str = day_dir.name.split('_')[0]
            dir_date = datetime.strptime(dir_date_str, "%Y-%m-%d").replace(tzinfo=JST)
            
            if dir_date < seven_days_ago:
                continue
                
            for article_file in day_dir.glob("article_*.md"):
                content = article_file.read_text(encoding="utf-8")
                
                # 簡易的なパース
                title_match = content.split('\n')[0].replace('# ', '')
                
                # 「なぜ重要か」の部分を抽出
                summary = ""
                lines = content.split('\n')
                for i, line in enumerate(lines):
                    if "## なぜ重要か" in line:
                        summary = lines[i+2].strip() if i+2 < len(lines) else ""
                        break
                
                weekly_articles.append({
                    "title": title_match,
                    "summary": summary,
                    "date": dir_date_str
                })
        except Exception as e:
            print(f"ディレクトリ解析エラー: {day_dir.name} -> {e}")
            
    return weekly_articles[:10]  # 最大10件程度を候補にする

def generate_weekly_digest(articles):
    """週次サマリーの生成"""
    now = datetime.now(JST).strftime("%Y-%m-%d")
    
    # 実際にはここでLLMを使いたいが、現在はルールベースで上位5件を抽出
    selected = articles[:5]
    
    content = f"# Weekly Executive Summary {now}\n\n"
    content += "## 今週の重要ニュース（最大5件）\n"
    
    if not selected:
        content += "- 今週は対象となる重要ニュースがありませんでした。\n"
    else:
        for item in selected:
            content += f"- 【{item['title']}】{item['summary']}\n"
            
    content += "\n## 今週の経営示唆まとめ\n"
    content += "- **広告・PR・ブランド戦略の観点**: デジタル接点の多様化により、一つのメッセージを全チャネルに流すのではなく、文脈に応じた最適化が急務。\n"
    content += "- **デジタル／生成AI活用の観点**: AI導入は手段。自社のどのバリューチェーンが最もレバレッジがかかるかの特定が、ROI最大化の鍵。\n"
    content += "- **M&A・企業再生・事業構造の観点**: 業界のボラティリティが高い今、コア事業へのリソース集中と、非連続な成長のための外部リソース活用のバランスが重要。\n"
    content += "- **地域創生・産業構造転換の観点**: 労働人口減少は不可避。省人化技術と付加価値の高い「職人気質」の融合が、地域産業の生き残る道。\n"
    
    return content

def main():
    print("🚀 週次サマリー生成中...")
    articles = get_weekly_articles()
    
    if not articles:
        print("⚠️ 過去7日分の記事が見つかりませんでした。")
        # デモ用に空のフォルダがある場合はエラーにしない
        
    digest = generate_weekly_digest(articles)
    
    output_dir = Path("weekly_digest")
    output_dir.mkdir(exist_ok=True)
    
    now_str = datetime.now(JST).strftime("%Y-%m-%d")
    output_file = output_dir / f"weekly_summary_{now_str}.md"
    output_file.write_text(digest, encoding="utf-8")
    
    print(f"✅ 週次サマリーを保存しました: {output_file}")

if __name__ == "__main__":
    main()
