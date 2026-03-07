// ============================================
// 逆転のAI戦略 - AI活用レベル診断アプリ
// Application Logic
// ============================================

// --- Question Data ---
const questions = [
  {
    id: 1,
    text: "ChatGPTやGeminiなどの生成AIを日常的に使用していますか？",
    hint: "週に数回以上、テキスト生成AI（ChatGPT, Gemini, Claude等）を業務や学習に利用している場合は「はい」を選択してください。"
  },
  {
    id: 2,
    text: "生成AIに対して、意図した回答を得るためにプロンプト（指示文）を工夫していますか？",
    hint: "単に質問を投げるだけでなく、役割設定・条件指定・出力形式の指定など、プロンプトを構造的に設計している場合は「はい」を選択してください。"
  },
  {
    id: 3,
    text: "NotionやObsidianなどのツールを使い、AIとの対話ログやプロンプトを体系的に蓄積・管理していますか？",
    hint: "Notion, Obsidian, Scrapbox等のナレッジ管理ツール、または同等の方法で、プロンプトテンプレートやAI出力を整理・再利用可能に管理している場合は「はい」を選択してください。"
  },
  {
    id: 4,
    text: "AIを使って文章やメールの下書きを作成し、業務を効率化していますか？",
    hint: "報告書、メール、議事録、ブログ記事などの文章作成にAIを日常的に活用し、作業時間を短縮している場合は「はい」を選択してください。"
  },
  {
    id: 5,
    text: "AIを使ってデータの分析・要約・翻訳などの知識処理を行っていますか？",
    hint: "大量のテキストの要約、市場データの分析、多言語翻訳、リサーチの効率化などにAIを活用している場合は「はい」を選択してください。"
  },
  {
    id: 6,
    text: "AIで生成されたアウトプットに対して、事実確認や品質チェックを行い、自分の判断で修正・改善していますか？",
    hint: "AIの出力を鵜呑みにせず、ファクトチェック・論理の整合性確認・品質向上のための編集を行っている場合は「はい」を選択してください。"
  },
  {
    id: 7,
    text: "画像生成AI（Midjourney, DALL-E, Stable Diffusion等）や音声AI、動画AI等を活用していますか？",
    hint: "テキスト以外のモダリティ（画像・音声・動画・音楽等）の生成AIを業務やプロジェクトに活用している場合は「はい」を選択してください。"
  },
  {
    id: 8,
    text: "複数のAIツールやサービスを組み合わせて、一つの成果物やワークフローを構築していますか？",
    hint: "例：ChatGPTで企画→Midjourneyで画像生成→Canvaでデザイン→動画AIで動画化など、複数のAIを連携させたワークフローを構築している場合は「はい」を選択してください。"
  },
  {
    id: 9,
    text: "Cursor, GitHub Copilot, Claude Code等のAIコーディングツールを使用して、ソフトウェア開発やスクリプト作成を行っていますか？",
    hint: "Cursor, GitHub Copilot, Cody, Aider, Claude Code等のAIペアプログラミングツール、またはChatGPTのCode Interpreter等を使ってコードを書いている場合は「はい」を選択してください。プログラマーでなくても、ノーコード/ローコードをAIで補助している場合も含みます。"
  },
  {
    id: 10,
    text: "AIを活用して、Webサイト・アプリ・ツールなどのプロダクトやプロトタイプを実際に作成・公開したことがありますか？",
    hint: "AIの支援を受けて、実際に動作するWebサイト、アプリ、Chrome拡張、業務ツールなどを作成し、社内外に展開した経験がある場合は「はい」を選択してください。"
  },
  {
    id: 11,
    text: "AIの出力結果を用いた業務改善施策を提案し、チームや組織に導入した経験がありますか？",
    hint: "個人利用にとどまらず、AIを使った業務プロセスの改善提案を行い、チーム・組織レベルで採用・実行された経験がある場合は「はい」を選択してください。"
  },
  {
    id: 12,
    text: "LLMのAPI（OpenAI API, Gemini API等）を使ったシステム連携やカスタム実装を行ったことがありますか？",
    hint: "ChatGPTのWeb版だけでなく、API経由でLLMを呼び出し、自社システム・業務ツール・チャットボットなどに組み込んだ経験がある場合は「はい」を選択してください。"
  },
  {
    id: 13,
    text: "RAG（検索型拡張生成）やファインチューニング等、AIモデルのカスタマイズ手法を理解し、実践していますか？",
    hint: "RAG（Retrieval-Augmented Generation）、ファインチューニング、エンベディングなどの手法を理解し、社内ドキュメント検索システムやカスタムAIの構築に活用した経験がある場合は「はい」を選択してください。"
  },
  {
    id: 14,
    text: "AIを組み込んだプロダクトやサービスを企画し、開発チームをリードまたは主体的に関与して、実際にローンチしたことがありますか？",
    hint: "AIをコア機能として組み込んだサービス・プロダクトの企画〜開発〜ローンチまでのプロセスに、PM・テックリード・起業家等のロールで深く関与した経験がある場合は「はい」を選択してください。"
  },
  {
    id: 15,
    text: "AIエージェント（自律的にタスクを実行するAI）を設計・構築し、業務やプロダクトに導入していますか？",
    hint: "LangChain, AutoGen, CrewAI等のフレームワーク、またはカスタム実装で、目標達成のために自律的に判断・行動するAIエージェントを構築・運用している場合は「はい」を選択してください。"
  },
  {
    id: 16,
    text: "AI戦略の策定や組織全体のAI活用推進をリードする役割を担っていますか？",
    hint: "CTO、CDO、AI推進責任者、DX推進リーダー等として、組織のAI導入戦略の策定、人材育成、ガバナンス構築などをリードしている場合は「はい」を選択してください。"
  },
  {
    id: 17,
    text: "独自のAIモデル開発、最先端の研究応用、または業界の標準や常識を変えるようなAI活用を行っていますか？",
    hint: "自社独自のAIモデルの開発・学習、最先端論文の実応用、業界における画期的なAI活用事例の創出など、AI分野のフロンティアで活動している場合は「はい」を選択してください。"
  }
];

// --- Level Definitions ---
const levels = [
  {
    level: 0,
    title: "AI未体験",
    subtitle: "まだAIの世界への第一歩を踏み出していません",
    description: "生成AIをまだ使い始めていない段階です。しかし、これは大きなチャンスでもあります。AI活用の波は今まさに始まったばかり。今日からスタートすれば、すぐに周囲をリードできる立場になれます。",
    nextStep: "まずはChatGPT（chat.openai.com）またはGemini（gemini.google.com）にアクセスし、無料アカウントを作成しましょう。「今日の天気を教えて」「メールの返信を考えて」など、日常の小さな質問から始めてみてください。",
    bookRecommend: "書籍『逆転のAI戦略』の第1章「AIの民主化」を読んで、なぜ今AIを使い始めるべきかの全体像を把握しましょう。",
    color: "#64748b"
  },
  {
    level: 1,
    title: "AI初心者",
    subtitle: "AIとの会話を始めた段階です",
    description: "生成AIを使い始めていますが、まだ「聞けば答えが返ってくるツール」としての認識にとどまっています。AIの真のポテンシャルは、指示の仕方（プロンプト）次第で劇的に変わります。",
    nextStep: "プロンプトの基本パターンを3つ覚えましょう。①役割設定（「あなたはマーケティングの専門家です」）②条件指定（「300字以内で」「箇条書きで」）③出力形式指定（「表形式で」「Markdown形式で」）。この3つを意識するだけで、AIの回答品質が飛躍的に向上します。",
    bookRecommend: "書籍『逆転のAI戦略』の第2章「プロンプトエンジニアリングの基本」で、効果的な指示の出し方を学びましょう。",
    color: "#94a3b8"
  },
  {
    level: 2,
    title: "プロンプト実践者",
    subtitle: "AIに的確な指示を出せるようになりました",
    description: "プロンプトを工夫してAIから意図した回答を引き出せるスキルを身につけています。次のステップは、この知見を「資産」として蓄積し、再利用できる仕組みを作ることです。",
    nextStep: "NotionやObsidianなどのナレッジ管理ツールを導入し、効果的だったプロンプトをテンプレートとして保存しましょう。「文章校正用」「企画書作成用」「データ分析用」などカテゴリ別に整理すると、チームでの共有にも役立ちます。",
    bookRecommend: "書籍『逆転のAI戦略』の第3章「知識管理とプロンプト資産化」で、AIナレッジベースの構築方法を学びましょう。",
    color: "#06b6d4"
  },
  {
    level: 3,
    title: "AI業務活用者",
    subtitle: "日常業務にAIが浸透し始めています",
    description: "プロンプト設計ができ、ナレッジの蓄積も始めていますが、AIの業務活用がまだ一部の領域に限られています。文章作成・データ分析・品質チェックなど、業務の幅広い領域でAIを活用し、かつAIの出力を適切に評価できる力が次の目標です。",
    nextStep: "AIを使っていない業務を3つリストアップし、それぞれ「AIで効率化できないか？」を検討してみましょう。特にデータ分析・要約・翻訳の分野では、AIが大きな力を発揮します。また、AI出力のファクトチェックを習慣化し、「AIと協働する」マインドセットを確立しましょう。",
    bookRecommend: "書籍『逆転のAI戦略』の第4章「AI業務実装マニュアル」で、業務別のAI活用パターンを学びましょう。",
    color: "#3b82f6"
  },
  {
    level: 4,
    title: "マルチモーダルAI活用者",
    subtitle: "テキストを超えた多様なAI活用ができています",
    description: "テキスト生成だけでなく、画像・音声・動画など複数のモダリティのAIツールを使いこなし始めています。さらに、複数のAIサービスを組み合わせた高度なワークフローを構築することで、AIの相乗効果を最大化できます。",
    nextStep: "「AIパイプライン」を構築してみましょう。例：①ChatGPTで企画書を作成 → ②Midjourneyでプレゼン画像を生成 → ③動画AIでプロモーション動画を作成 → ④音声AIでナレーションを追加。このように複数AIを連携させるワークフローを1つ完成させましょう。",
    bookRecommend: "書籍『逆転のAI戦略』の第5章「マルチモーダルAI戦略」で、テキストを超えたAI活用の全体像を把握しましょう。",
    color: "#8b5cf6"
  },
  {
    level: 5,
    title: "AIプロダクトの作り手",
    subtitle: "AIを使ってモノを創り出す力を持っています",
    description: "AIコーディングツールを活用しながら実際にプロダクトやプロトタイプを作成・公開できる段階です。さらに、組織への改善提案やAPI連携、AIモデルのカスタマイズまで手を広げることで、「AIを使う人」から「AIで変革を起こす人」へと進化できます。",
    nextStep: "以下の3つの挑戦を段階的に進めましょう。①自分のAI活用ノウハウを社内提案としてまとめ、チームに導入する ②OpenAI APIやGemini APIを使った簡単な自動化ツールを作る ③RAG（検索型拡張生成）の基本を学び、社内ドキュメントを使ったカスタムAIを試作する。",
    bookRecommend: "書籍『逆転のAI戦略』の第6章「AIプロダクト開発入門」と第7章「API活用とカスタムAI」を通読し、技術的な実装力を高めましょう。",
    color: "#ec4899"
  },
  {
    level: 6,
    title: "AI変革推進者",
    subtitle: "AIを組織やプロダクトに実装し、変革を起こしています",
    description: "AIコーディング・プロダクト開発・組織への導入提案・API連携・カスタムAI構築まで、幅広いAI活用スキルを持っています。次のステップは、AIをコアに据えたプロダクトやサービスを企画からローンチまで主導することです。",
    nextStep: "AIを中核機能としたプロダクトまたはサービスの企画書を作成してみましょう。ユーザー課題の定義→AIでの解決策設計→プロトタイプ開発→ユーザーテストの一連のプロセスを経験することで、AIプロダクトマネジメントの力が身につきます。",
    bookRecommend: "書籍『逆転のAI戦略』の第8章「AIプロダクトマネジメント」で、AIプロダクトの企画からローンチまでのフレームワークを学びましょう。",
    color: "#f59e0b"
  },
  {
    level: 7,
    title: "AIプロダクトリーダー",
    subtitle: "AIプロダクトの企画からローンチまでを主導できます",
    description: "AIを組み込んだプロダクトを実際にローンチした経験があり、技術と事業の両面からAI活用をリードできる人材です。次のフロンティアは、より自律的なAIシステム「AIエージェント」の設計・構築です。",
    nextStep: "AIエージェントの構築に挑戦しましょう。LangChain、AutoGen、CrewAI等のフレームワークを学び、特定のタスク（情報収集→分析→レポート作成など）を自律的に実行するエージェントを設計・実装してみてください。",
    bookRecommend: "書籍『逆転のAI戦略』の第9章「AIエージェント設計論」で、自律型AIシステムの設計パターンとベストプラクティスを学びましょう。",
    color: "#10b981"
  },
  {
    level: 8,
    title: "AIエージェント・アーキテクト",
    subtitle: "自律的に動くAIシステムを設計・構築できます",
    description: "AIエージェントの設計・構築・運用を実践できる、極めて高い技術力を持っています。この力を組織全体のAI戦略策定に活かすことで、個人の技術力を組織変革の推進力に転換できます。",
    nextStep: "組織のAI戦略を体系的に策定する役割に挑戦しましょう。現状分析→課題定義→AI導入ロードマップ作成→人材育成計画→ガバナンス構築という一連の戦略策定プロセスをリードすることで、AI推進リーダーとしての市場価値が飛躍的に高まります。",
    bookRecommend: "書籍『逆転のAI戦略』の第10章「AI組織戦略」で、組織全体のAI活用を推進するためのフレームワークを学びましょう。",
    color: "#06b6d4"
  },
  {
    level: 9,
    title: "AI戦略リーダー",
    subtitle: "組織のAI戦略を策定し、変革をリードしています",
    description: "技術の深い理解と組織を動かすリーダーシップを兼ね備えた、日本でも数%のAI活用トップランナーです。最後の一歩は、業界の常識そのものを変えるような、独自のAIモデル開発や画期的なAI活用を実現することです。",
    nextStep: "あなたの組織やドメインならではの独自AIモデルの開発、最先端論文の事業応用、または業界の標準を塗り替えるAI活用事例の創出に挑戦しましょう。あなたが次のゲームチェンジャーです。",
    bookRecommend: "書籍『逆転のAI戦略』の終章「逆転の先に見える景色」で、AI活用の未来ビジョンと、リーダーとしての使命について深く考えましょう。",
    color: "#8b5cf6"
  },
  {
    level: 10,
    title: "AIヴィジョナリー",
    subtitle: "AI活用の最前線で未来を切り拓いています",
    description: "おめでとうございます。あなたはAI活用のすべてのレベルを達成した「AIヴィジョナリー」です。生成AIの基本から、プロンプト設計、マルチモーダル活用、プロダクト開発、エージェント構築、組織戦略、そして独自のAI開発まで。あなたの知見と経験は、後に続く人たちの道標となります。",
    nextStep: "あなたの知見を社会に還元しましょう。書籍の執筆、カンファレンスでの登壇、メンタリング、オープンソースへの貢献など、あなただからこそできる方法でAI活用の知見を広めてください。次世代のAIヴィジョナリーを育てることが、あなたの新たな使命です。",
    bookRecommend: "書籍『逆転のAI戦略』をすでに体現しているあなたへ。ぜひレビューの執筆や、この本をきっかけに後輩・同僚へのメンタリングを始めてください。あなたの言葉が、誰かの「逆転」を助けます。",
    color: "#f59e0b"
  }
];

// --- Diagnostic Logic ---
function calculateLevel(answers) {
  // answers: array of 17 booleans (true = はい, false = いいえ)
  // Highest achievement based determination

  if (answers[16]) return 10; // Q17: AI Visionary
  if (answers[15]) return 9;  // Q16: AI Strategy Leader
  if (answers[14]) return 8;  // Q15: AI Agent Architect
  if (answers[13]) return 7;  // Q14: AI Product Leader
  if (answers[8] || answers[9] || answers[10] || answers[11] || answers[12]) return 6; // Q9-13: AI Change Driver (6 and up)
  if (answers[6] || answers[7]) return 5; // Q7-8: Multi-modal
  if (answers[3] || answers[4] || answers[5]) return 4; // Q4-6: Business Use
  if (answers[2]) return 3; // Q3: Prompt Practitioner (Asset building)
  if (answers[1]) return 2; // Q2: Prompt Practitioner
  if (answers[0]) return 1; // Q1: AI Beginner

  return 0; // AI Inexperienced
}

// --- App State ---
let currentQuestion = 0;
let answers = new Array(17).fill(null); // null = unanswered

// --- DOM References ---
const homeScreen = document.getElementById('home-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const btnStart = document.getElementById('btn-start');
const progressFill = document.getElementById('progress-fill');
const progressCount = document.getElementById('progress-count');
const questionNumber = document.getElementById('question-number');
const questionText = document.getElementById('question-text');
const questionHint = document.getElementById('question-hint');
const tooltipContent = document.getElementById('tooltip-content');
const tooltipText = document.getElementById('tooltip-text');
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');

// Result DOM
const resultLevel = document.getElementById('result-level');
const resultTitle = document.getElementById('result-title');
const resultLevelBar = document.getElementById('result-level-bar');
const resultDescription = document.getElementById('result-description');
const resultNextStep = document.getElementById('result-next-step');
const resultBookRecommend = document.getElementById('result-book-recommend');
const btnRetry = document.getElementById('btn-retry');
const shareX = document.getElementById('share-x');
const shareFb = document.getElementById('share-fb');
const shareLine = document.getElementById('share-line');

// --- Screen Management ---
function showScreen(screen) {
  [homeScreen, quizScreen, resultScreen].forEach(s => s.classList.remove('active'));
  screen.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Quiz Logic ---
function startQuiz() {
  currentQuestion = 0;
  answers = new Array(17).fill(null);
  showScreen(quizScreen);
  renderQuestion();
}

function renderQuestion() {
  const q = questions[currentQuestion];
  const progress = ((currentQuestion) / questions.length) * 100;

  progressFill.style.width = `${progress}%`;
  progressCount.textContent = `${currentQuestion + 1} / ${questions.length}`;
  questionNumber.textContent = `Q${q.id}`;
  questionText.textContent = q.text;
  tooltipText.textContent = q.hint;
  tooltipContent.classList.remove('visible');

  // Re-trigger animation
  const card = document.querySelector('.question-card');
  card.style.animation = 'none';
  card.offsetHeight; // force reflow
  card.style.animation = '';
}

function answerQuestion(isYes) {
  answers[currentQuestion] = isYes;

  // Multi-step comprehensive judging: Continue until the final question
  if (currentQuestion >= questions.length - 1) {
    showResult();
  } else {
    currentQuestion++;
    renderQuestion();
  }
}

function toggleHint() {
  tooltipContent.classList.toggle('visible');
}

// --- Result Logic ---
function showResult() {
  const level = calculateLevel(answers);
  const levelData = levels[level];

  // Log anonymous data
  logAnonymousData(level, answers);

  // Populate result
  resultLevel.textContent = `Lv.${level}`;
  resultTitle.textContent = levelData.title;

  // Level bar
  resultLevelBar.innerHTML = '';
  for (let i = 0; i <= 10; i++) {
    const dot = document.createElement('div');
    dot.className = 'level-dot' + (i <= level ? ' filled' : '');
    resultLevelBar.appendChild(dot);
  }

  resultDescription.textContent = levelData.description;
  resultNextStep.textContent = levelData.nextStep;
  resultBookRecommend.textContent = levelData.bookRecommend;

  // Set share links
  const shareText = `私のAI活用レベルはLv.${level}「${levelData.title}」でした！あなたのレベルは？ #逆転のAI戦略診断`;
  const shareUrl = window.location.href;

  shareX.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  shareFb.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
  shareLine.href = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;

  // Update progress to 100%
  progressFill.style.width = '100%';

  showScreen(resultScreen);
}

function retryQuiz() {
  showScreen(homeScreen);
}

function logAnonymousData(level, answers) {
  // Extract index of first 'false' to see where people stop
  const firstFalseIndex = answers.indexOf(false);
  const stopAt = firstFalseIndex !== -1 ? firstFalseIndex + 1 : (answers.includes(null) ? answers.indexOf(null) : 17);

  console.info("Diagnostic completed:", {
    level: level,
    stopAtQuestion: stopAt,
    timestamp: new Date().toISOString()
  });

  // Example: Google Analytics event
  if (typeof gtag === 'function') {
    gtag('event', 'diagnostic_complete', {
      'level': level,
      'stop_at': stopAt
    });
  }
}

// --- Event Listeners ---
btnStart.addEventListener('click', startQuiz);
btnYes.addEventListener('click', () => answerQuestion(true));
btnNo.addEventListener('click', () => answerQuestion(false));
questionHint.addEventListener('click', toggleHint);
btnRetry.addEventListener('click', retryQuiz);

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (!quizScreen.classList.contains('active')) return;

  if (e.key === 'ArrowRight' || e.key === 'y' || e.key === 'Y') {
    answerQuestion(true);
  } else if (e.key === 'ArrowLeft' || e.key === 'n' || e.key === 'N') {
    answerQuestion(false);
  }
});
