// src/types/dashboard.ts
export interface DashboardStats {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalCategories: number;
    totalUsers: number;
    totalViews: number;
    viewsTrend: number; // yüzde olarak artış/azalış
  }
  
  export interface ViewsData {
    date: string;
    views: number;
  }
  
  export interface PopularPost {
    id: string;
    title: string;
    slug: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    publishDate: string;
    category?: string;
  }
  
  export interface ActivityLog {
    id: string;
    type: 'post_created' | 'post_updated' | 'post_published' | 'user_registered' | 'comment_added';
    message: string;
    user: string;
    timestamp: Date;
    entityId?: string;
    entityTitle?: string;
  }
  
  export interface TopicTrend {
    topic: string;
    count: number;
    trend: number; // yüzde olarak artış/azalış
  }
  
  export interface CategoryData {
    name: string;
    count: number;
    percentage: number;
  }
  
  export interface UserActivity {
    date: string;
    newUsers: number;
    activeUsers: number;
  }