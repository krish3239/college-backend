import { resultService } from "./result.service.js";

class ResultController {
  // Get result by roll number with optional period and session
  async getResultByRollNumber(req, res) {
    try {
      const { rollNumber } = req.params;
      const { period, session } = req.query;

      const result = await resultService.getResultByRollNumber(
        rollNumber,
        period,
        session
      );

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'No result found for given parameters'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Result fetched successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get all results for a student
  async getAllResultsByRollNumber(req, res) {
    try {
      const { rollNumber } = req.params;

      const results = await resultService.getAllResultsByRollNumber(rollNumber);

      if (!results || results.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No results found for given roll number'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Results fetched successfully',
        data: results
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Create new result
  async createResult(req, res) {
    try {
      const userId = req.user.id;
      const result = await resultService.createResult(req.body, userId);

      res.status(201).json({
        success: true,
        message: 'Result created successfully',
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update result
  async updateResult(req, res) {
    try {
      const { rollNumber } = req.params;
      const { period, session } = req.query;
      const userId = req.user.id;
      
      const result = await resultService.updateResult(
        rollNumber,
        period,
        session,
        req.body,
        userId
      );

      res.status(200).json({
        success: true,
        message: 'Result updated successfully',
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Delete result
  async deleteResult(req, res) {
    try {
      const { rollNumber } = req.params;
      const { period, session } = req.query;

      await resultService.deleteResult(rollNumber, period, session);

      res.status(200).json({
        success: true,
        message: 'Result deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get results by session
  async getResultsBySession(req, res) {
    try {
      const { session } = req.params;

      const results = await resultService.getResultsBySession(session);

      res.status(200).json({
        success: true,
        message: 'Results fetched successfully',
        data: results
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get results by period type
  async getResultsByPeriodType(req, res) {
    try {
      const { periodType } = req.params;

      if (!['semester', 'year'].includes(periodType)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid period type. Must be "semester" or "year"'
        });
      }

      const results = await resultService.getResultsByPeriodType(periodType);

      res.status(200).json({
        success: true,
        message: 'Results fetched successfully',
        data: results
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get all results with pagination and filters
  async getAllResults(req, res) {
    try {
      const { page = 1, limit = 10, session, course, status, period, periodType } = req.query;

      const filters = {};
      if (session) filters.session = session;
      if (course) filters.course = course;
      if (status) filters.status = status;
      if (period) filters.period = period;
      if (periodType) filters.periodType = periodType;

      const results = await resultService.getAllResults(page, limit, filters);

      res.status(200).json({
        success: true,
        message: 'Results fetched successfully',
        data: results.results,
        pagination: results.pagination
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get student statistics
  async getStudentStatistics(req, res) {
    try {
      const { rollNumber } = req.params;
      const { period, session } = req.query;

      const stats = await resultService.getStudentStatistics(
        rollNumber,
        period,
        session
      );

      res.status(200).json({
        success: true,
        message: 'Statistics fetched successfully',
        data: stats
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

export const ResultControllers = new ResultController();
