export type Locale = "zh" | "en";

export type Bilingual = {
  zh: string;
  en: string;
};

export type Section = {
  title: Bilingual;
  content: Bilingual;
};

export type Article = {
  slug: string;
  title: Bilingual;
  description: Bilingual;
  sections: Section[];
  tags?: string[];
  category?: string;
  videoId?: string;
  /** 從 YouTube 擷取的影片資訊（parse 時自動或手動填入） */
  videoTitle?: string;
  channelTitle?: string;
  viewCount?: string;
  likeCount?: string;
  channelSubscriberCount?: string;
  publishedAt?: string;
  videoDescription?: string;
  /** 發文日期（parse 時依 .txt 檔案 mtime 寫入），用於列表排序與顯示 */
  addedAt?: string;
};
