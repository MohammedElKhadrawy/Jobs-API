const Job = require('../models/Job');
const throwCustomError = require('../errors/custom-error');
const collectValidationResult = require('./collectValidationResult');

module.exports = async (req, res, next) => {
  if (req.method === 'PATCH') {
    collectValidationResult(req);
  }
  const {
    params: { jobId },
    user: { userId },
  } = req;
  const job = await Job.findById(jobId);
  if (!job) {
    throwCustomError(`No Job with ID: ${jobId}`, 404);
  }
  if (job.createdBy.toString() !== userId.toString()) {
    throwCustomError(
      'Unauthorized, Only the user who created this job can access it.',
      403
    );
  }
  req.job = job;
  next();
};
