/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SidebarIcymi
// ====================================================

export interface SidebarIcymi_viewer_recommendation_icymi_edges_node_author {
  __typename: "User";
  id: string;
  userName: string | null;
  /**
   * Display name on profile
   */
  displayName: string | null;
  /**
   * URL for avatar
   */
  avatar: any | null;
}

export interface SidebarIcymi_viewer_recommendation_icymi_edges_node_comments {
  __typename: "CommentConnection";
  totalCount: number;
}

export interface SidebarIcymi_viewer_recommendation_icymi_edges_node {
  __typename: "Article";
  id: string;
  title: string;
  slug: string;
  cover: any | null;
  author: SidebarIcymi_viewer_recommendation_icymi_edges_node_author;
  mediaHash: string | null;
  createdAt: any;
  /**
   * MAT recieved for this article
   */
  MAT: number;
  comments: SidebarIcymi_viewer_recommendation_icymi_edges_node_comments;
  /**
   * Viewer has subscribed
   */
  subscribed: boolean;
  topicScore: number | null;
}

export interface SidebarIcymi_viewer_recommendation_icymi_edges {
  __typename: "ArticleEdge";
  cursor: string;
  node: SidebarIcymi_viewer_recommendation_icymi_edges_node;
}

export interface SidebarIcymi_viewer_recommendation_icymi {
  __typename: "ArticleConnection";
  edges: SidebarIcymi_viewer_recommendation_icymi_edges[] | null;
}

export interface SidebarIcymi_viewer_recommendation {
  __typename: "Recommendation";
  /**
   * In case you missed it
   */
  icymi: SidebarIcymi_viewer_recommendation_icymi;
}

export interface SidebarIcymi_viewer {
  __typename: "User";
  id: string;
  recommendation: SidebarIcymi_viewer_recommendation;
}

export interface SidebarIcymi {
  viewer: SidebarIcymi_viewer | null;
}

export interface SidebarIcymiVariables {
  hasArticleDigestActionAuthor?: boolean | null;
  hasArticleDigestActionDateTime?: boolean | null;
  hasArticleDigestCover?: boolean | null;
  hasArticleDigestActionTopicScore?: boolean | null;
}
