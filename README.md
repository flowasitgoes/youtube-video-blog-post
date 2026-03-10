# YouTube 摘要博客

将 AI 生成的 YouTube 视频摘要发布为结构化双语博客的 Web 应用。

## 技术栈

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Node.js 解析脚本
- 静态生成，支持 Vercel 部署

## 快速开始

```bash
npm install
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)，点击「进入博客」查看文章列表。

## 工作流程

1. 将摘要文章放入 **`/content`** 目录，使用 `.txt` 格式。
2. 运行解析脚本：**`npm run parse`**
3. 脚本将 TXT 转为 JSON 并写入 **`/data/articles`**。
4. 博客列表页 **`/blog`** 与文章页 **`/blog/[slug]** 自动读取这些 JSON 并渲染。

## TXT 文章格式

解析器支援兩種格式，會依**第一行**自動判斷：

### 格式一：關鍵字 + # 小節（傳統）

```
TITLE: 中文标题
TITLE_EN: English Title

DESCRIPTION:
中文简介（可多行）

DESCRIPTION_EN:
English description (multi-line ok)


# 1. 第一个小节标题
小节内容...

# 2. 第二个小节标题
小节内容...
```

- 以 `#` 开头的行表示小节标题，其后到下一个 `#` 之前为该小节正文。

### 格式二：編號小節（常見 AI 摘要）

```
第一行：英文標題
第二行：中文標題

接著一段或數段為「簡介」，直到出現 "1. " 這種編號行為止。

1. 第一个小节标题
小节内容...

2. 第二个小节标题
小节内容...

18. 最后一节
内容...
```

- 第 1 行 = 英文標題，第 2 行 = 中文標題。
- 簡介 = 從下一行到第一個以 `數字. ` 開頭的行之前。
- 小節 = 每一行 `數字. 標題` 開始一個小節，內容到下一條 `數字. ` 或檔案結尾。

- Slug 由**檔名**生成（去掉 `.txt`，轉小寫、空格變 `-`）。

### 在文章最上方嵌入 YouTube 影片（兩種格式皆可）

在檔案**最上方**（格式二為標題之前、格式一為 TITLE 之前）加上一行：

- `VIDEO_ID: 影片ID`（例如 `VIDEO_ID: WjckELpzLOU`）
- 或 `YOUTUBE: https://www.youtube.com/watch?v=影片ID`（支援 watch、embed、youtu.be 連結）

**手動填寫影片/頻道資訊（選填，建議填寫）**：在 `VIDEO_ID` 下一行起可加以下欄位，直接顯示在影片下方，不需 API key：

- `CHANNEL_SUBSCRIBERS: 462K`（頻道訂閱數）
- `VIDEO_LIKES: 3.2K`（影片讚數）
- `VIEWS: 209K`（觀看次數）
- `PUBLISHED: 12 days ago`（上傳時間，可寫 "12 days ago" 或任意說明）

解析後，文章頁頂部會顯示 16:9 的 YouTube 內嵌播放器，以及你填寫的訂閱數、讚數、觀看次數、上傳說明。

**影片資訊擷取**：執行 `npm run parse` 時，腳本會依 `VIDEO_ID` 自動向 YouTube 擷取並寫入：

- **不需 API key**：使用 YouTube oEmbed，可取得「影片標題」「頻道名稱」，顯示在 iframe 下方。
- **選填 `YOUTUBE_API_KEY`**：在環境變數設定 [YouTube Data API v3](https://developers.google.com/youtube/v3) 的 API key，可多擷取「觀看次數」「讚數」「頻道訂閱數」「上傳日期」「影片描述」並一併顯示。
  - 例：`YOUTUBE_API_KEY=your_key npm run parse`

## 脚本与构建

- **`npm run parse`**：解析 `/content` 下所有 `.txt`，输出到 `/data/articles/*.json`。
- **`npm run build`**：先执行 `parse`，再执行 `next build`，适合部署前一次性生成数据。

## 路由与功能

- **`/`**：首页，链接到博客。
- **`/blog`**：文章列表，显示标题与简介，支持 `?lang=zh` / `?lang=en`。
- **`/blog/[slug]`**：文章详情，支持中英切换与 SEO（title、description、Open Graph）。

## 项目结构

- **`/content`**：原始 TXT 文章
- **`/data/articles`**：解析后的 JSON（勿手改，由脚本生成）
- **`/scripts/parse-content.ts`**：解析脚本
- **`/lib`**：类型定义、`getArticle`、`getArticles`
- **`/app/blog`**：博客列表与动态文章页
- **`/components`**：ArticleLayout、SectionBlock、LanguageSwitch

## 部署（Vercel）

- 构建命令：`npm run build`
- 输出为 Next.js 静态/混合站点，可直接部署到 Vercel。
# youtube-video-blog-post
