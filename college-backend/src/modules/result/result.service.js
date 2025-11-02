import { Result } from "./result.model.js";

class ResultService {
  // Get result by roll number, period, and session
  async getResultByRollNumber(rollNumber, period, session) {
    try {
      const query = {
        'studentInfo.rollNumber': rollNumber.toUpperCase()
      };

      // Add period filter if provided
      if (period) {
        query['studentInfo.period'] = period;
      }

      // Add session filter if provided
      if (session) {
        query['studentInfo.session'] = session;
      }

      const result = await Result.findOne(query)
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email');
      
      return result;
    } catch (error) {
      throw new Error(`Error fetching result: ${error.message}`);
    }
  }

  // Get all results for a student (all semesters/years)
  async getAllResultsByRollNumber(rollNumber) {
    try {
      const results = await Result.find({ 
        'studentInfo.rollNumber': rollNumber.toUpperCase() 
      })
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email')
        .sort({ 'studentInfo.session': -1, 'studentInfo.period': 1 });
      
      return results;
    } catch (error) {
      throw new Error(`Error fetching results: ${error.message}`);
    }
  }

  // Create new result
  async createResult(resultData, userId) {
    try {
      // Check if result already exists for this combination
      const existingResult = await Result.findOne({ 
        'studentInfo.rollNumber': resultData.studentInfo.rollNumber.toUpperCase(),
        'studentInfo.period': resultData.studentInfo.period,
        'studentInfo.session': resultData.studentInfo.session
      });

      if (existingResult) {
        throw new Error('Result already exists for this roll number, period, and session');
      }

      const result = new Result({
        ...resultData,
        studentInfo: {
          ...resultData.studentInfo,
          rollNumber: resultData.studentInfo.rollNumber.toUpperCase()
        },
        createdBy: userId
      });

      await result.save();
      
      // Populate and return the created result
      return await Result.findById(result._id)
        .populate('createdBy', 'name email');
    } catch (error) {
      throw new Error(`Error creating result: ${error.message}`);
    }
  }

  // Update result
  async updateResult(rollNumber, period, session, updateData, userId) {
    try {
      const query = {
        'studentInfo.rollNumber': rollNumber.toUpperCase()
      };

      if (period) {
        query['studentInfo.period'] = period;
      }

      if (session) {
        query['studentInfo.session'] = session;
      }

      const result = await Result.findOne(query);

      if (!result) {
        throw new Error('Result not found');
      }

      // Update fields
      Object.keys(updateData).forEach(key => {
        if (key !== 'createdBy') {
          result[key] = updateData[key];
        }
      });

      result.updatedBy = userId;
      await result.save();

      return await Result.findById(result._id)
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email');
    } catch (error) {
      throw new Error(`Error updating result: ${error.message}`);
    }
  }

  // Delete result
  async deleteResult(rollNumber, period, session) {
    try {
      const query = {
        'studentInfo.rollNumber': rollNumber.toUpperCase()
      };

      if (period) {
        query['studentInfo.period'] = period;
      }

      if (session) {
        query['studentInfo.session'] = session;
      }

      const result = await Result.findOneAndDelete(query);

      if (!result) {
        throw new Error('Result not found');
      }

      return result;
    } catch (error) {
      throw new Error(`Error deleting result: ${error.message}`);
    }
  }

  // Get results by session
  async getResultsBySession(session) {
    try {
      const results = await Result.find({ 'studentInfo.session': session })
        .populate('createdBy', 'name email')
        .sort({ 'studentInfo.rollNumber': 1 });
      return results;
    } catch (error) {
      throw new Error(`Error fetching results by session: ${error.message}`);
    }
  }

  // Get results by period type (semester or year)
  async getResultsByPeriodType(periodType) {
    try {
      const results = await Result.find({ 'studentInfo.periodType': periodType })
        .populate('createdBy', 'name email')
        .sort({ 'studentInfo.rollNumber': 1 });
      return results;
    } catch (error) {
      throw new Error(`Error fetching results by period type: ${error.message}`);
    }
  }

  // Get student statistics
  async getStudentStatistics(rollNumber, period, session) {
    try {
      const query = {
        'studentInfo.rollNumber': rollNumber.toUpperCase()
      };

      if (period) {
        query['studentInfo.period'] = period;
      }

      if (session) {
        query['studentInfo.session'] = session;
      }

      const result = await Result.findOne(query);

      if (!result) {
        throw new Error('Result not found');
      }

      const stats = {
        totalSubjects: result.subjects.length,
        totalMarks: result.totalMarks,
        obtainedMarks: result.obtainedMarks,
        percentage: result.percentage,
        status: result.status,
        periodType: result.studentInfo.periodType,
        period: result.studentInfo.period,
        gradeDistribution: {}
      };

      // Calculate grade distribution
      result.subjects.forEach(subject => {
        stats.gradeDistribution[subject.grade] = (stats.gradeDistribution[subject.grade] || 0) + 1;
      });

      return stats;
    } catch (error) {
      throw new Error(`Error getting student statistics: ${error.message}`);
    }
  }
  
  // Get all results with pagination
  async getAllResults(page = 1, limit = 10, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      const query = {};

      // Apply filters
      if (filters.session) {
        query['studentInfo.session'] = filters.session;
      }
      if (filters.course) {
        query['studentInfo.course'] = { $regex: filters.course, $options: 'i' };
      }
      if (filters.status) {
        query.status = filters.status;
      }
      if (filters.period) {
        query['studentInfo.period'] = filters.period;
      }
      if (filters.periodType) {
        query['studentInfo.periodType'] = filters.periodType;
      }

      const results = await Result.find(query)
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Result.countDocuments(query);

      return {
        results,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalResults: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      throw new Error(`Error fetching results: ${error.message}`);
    }
  }
}

export const resultService = new ResultService();
