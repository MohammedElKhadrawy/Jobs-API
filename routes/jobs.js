const express = require('express');

const jobsController = require('../controllers/jobs');
const validateFields = require('../helpers/validateJobFields');
const checkAuthorization = require('../helpers/checkAuthorization');

const router = express.Router();

router
  .route('/')
  .get(jobsController.getAllJobs)
  .post(validateFields(), jobsController.createJob);

router
  .route('/:jobId')
  .get(checkAuthorization, jobsController.getSingleJob)
  .patch(validateFields(), checkAuthorization, jobsController.updateJob)
  .delete(checkAuthorization, jobsController.deleteJob);

module.exports = router;
