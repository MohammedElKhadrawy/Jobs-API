const Job = require('../models/Job');
const throwCustomError = require('../errors/custom-error');
const collectValidationResult = require('../helpers/collectValidationResult');

exports.getAllJobs = async (req, res, next) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt');
  if (!jobs || jobs.length === 0) {
    throwCustomError('No jobs were found for this user!', 404);
  }
  res.status(200).json({ jobs, count: jobs.length });
};

exports.createJob = async (req, res, next) => {
  collectValidationResult(req);
  const job = await Job.create({ ...req.body, createdBy: req.user.userId });
  res.status(201).json({ message: 'Job Created.', job });
};

exports.getSingleJob = async (req, res, next) => {
  const job = req.job;
  res.status(200).json({ job });
};

exports.updateJob = async (req, res, next) => {
  const job = req.job;
  for (const prop in req.body) {
    job[prop] = req.body[prop];
  }
  const updatedJob = await job.save();
  res.status(200).json({ updatedJob });
};

exports.deleteJob = async (req, res, next) => {
  const job = req.job;
  await job.deleteOne();
  res.status(200).json({ message: 'Job deleted.' });
};
