import { Controller, Post, Get, HttpException, HttpStatus, Body } from '@nestjs/common';
import { SchedulerService } from '../../scheduler/scheduler.service';

@Controller('api/scheduler')
export class SchedulerController {
  constructor(private schedulerService: SchedulerService) {}

  @Get('status')
  async getStatus() {
    try {
      return {
        success: true,
        data: {
          status: 'running',
          message: 'LinkedIn Automation Scheduler is active',
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to get scheduler status',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('trigger/follow-requests')
  async triggerFollowRequests() {
    try {
      await this.schedulerService.processFollowRequests();

      return {
        success: true,
        message: 'Follow requests processing triggered successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to trigger follow requests processing',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('trigger/follow-responses')
  async triggerFollowResponses() {
    try {
      await this.schedulerService.processFollowResponses();

      return {
        success: true,
        message: 'Follow responses processing triggered successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to trigger follow responses processing',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('trigger/pending-jobs')
  async triggerPendingJobs() {
    try {
      await this.schedulerService.processPendingJobs();

      return {
        success: true,
        message: 'Pending jobs processing triggered successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to trigger pending jobs processing',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('trigger/linkedin-login')
  async triggerLinkedInLogin(@Body() body: { userId: string }) {
    try {
      const { userId } = body;
      
      if (!userId) {
        throw new HttpException(
          {
            success: false,
            message: 'User ID is required',
          },
          HttpStatus.BAD_REQUEST
        );
      }

      const sessionId = `${userId}_${Date.now()}`;
      
      return {
        success: true,
        sessionId,
        message: 'LinkedIn login session created successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to create LinkedIn login session',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 