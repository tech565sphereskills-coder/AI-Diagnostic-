import { apiClient } from './api';
import type { Feedback } from '../types';

export const feedbackService = {
  async submitFeedback(resultId: string, isHelpful: boolean, rating: number, comment?: string): Promise<{ success: boolean; data: Feedback }> {
    try {
      const res = await apiClient.post(`/results/${resultId}/feedback`, {
        isHelpful,
        rating,
        comment
      });
      return res.data;
    } catch (err) {
      const feedbackObj: Feedback = {
        id: `fbk-${Date.now()}`,
        resultId,
        userId: 'usr-1',
        userName: 'Alex Johnson',
        isHelpful,
        rating,
        comment,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
      return { success: true, data: feedbackObj };
    }
  }
};
