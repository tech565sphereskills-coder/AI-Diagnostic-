import { apiClient } from './api';
import type { AssessmentResult, RecommendationItem } from '../types';
import { MOCK_RESULT_DEMO } from '../data/mockData';

export const resultService = {
  async getResultById(resultId: string): Promise<AssessmentResult> {
    try {
      const res = await apiClient.get(`/results/${resultId}`);
      return res.data;
    } catch (err) {
      return MOCK_RESULT_DEMO;
    }
  },

  async getRecommendations(): Promise<RecommendationItem[]> {
    try {
      const res = await apiClient.get('/recommendations');
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch (err) {
      // Fallthrough to local store check
    }

    const localRecsStr = localStorage.getItem('user_recommendations');
    if (localRecsStr) {
      try {
        return JSON.parse(localRecsStr);
      } catch (e) {}
    }

    // Default to 0 / empty array until user enters new data!
    return [];
  }
};
