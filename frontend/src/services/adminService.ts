import { apiClient } from './api';
import type { AdminStatistics, User, AssessmentType, Question } from '../types';
import { MOCK_ADMIN_STATS, MOCK_USERS, MOCK_ASSESSMENT_TYPES, MOCK_QUESTIONS_ACADEMIC } from '../data/mockData';

export const adminService = {
  async getAdminStats(): Promise<AdminStatistics> {
    try {
      const res = await apiClient.get('/admin/statistics');
      return res.data;
    } catch (err) {
      return MOCK_ADMIN_STATS;
    }
  },

  async getUsers(): Promise<User[]> {
    try {
      const res = await apiClient.get('/admin/users');
      return res.data;
    } catch (err) {
      return MOCK_USERS;
    }
  },

  async getAssessmentTypes(): Promise<AssessmentType[]> {
    try {
      const res = await apiClient.get('/admin/assessment-types');
      return res.data;
    } catch (err) {
      return MOCK_ASSESSMENT_TYPES;
    }
  },

  async getQuestions(typeId?: string): Promise<Question[]> {
    try {
      const res = await apiClient.get(`/admin/questions?typeId=${typeId || ''}`);
      return res.data;
    } catch (err) {
      return MOCK_QUESTIONS_ACADEMIC;
    }
  }
};
