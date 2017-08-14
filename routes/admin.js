var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var User = require("../models/user");
var Question = require("../models/questions");
var CryptXLogs = require("../models/cryptxlogs");

router.get('/', (req, res, next) => {
  if(!req.user || req.user.username !== 'MINET') {
    res.redirect('/');
  } else {
    return res.render('./admin/index');
  }
});

//Render manage teams page
router.get('/teams', (req, res, next) => {
  if (!req.user || req.user.username !== 'MINET') {
    res.redirect('/');
  }
  User.find().sort('username').exec(function(err, teams) {
    Question.find().exec(function(err, questions) {
      return res.render('./admin/teams', { teams: teams, questions: questions });
    });
  });
});

//SET LEVEL for teams
router.post('/teams', (req, res, next) => {
  console.log(req.body.username + ' is on level ' + req.body.newLevel);
  User.findOne({username: req.body.username}, function(err, user) {
    if (err) {
      return red.render('./admin/teams', { error: 'Failure on setting Level ' + req.body.level + ' for team.' })
    }
    user.cryptxLevel = req.body.newLevel;
    user.lastLevelOn = new Date();
    user.save();
    return res.redirect('/admin/teams');
  });
});

//Render manage questions page
router.get('/questions', (req, res, next) => {
  if (!req.user || req.user.username !== 'MINET') {
    res.redirect('/');
  }
  Question.find().sort('level').exec(function(err, questions) {
    return res.render('./admin/questions', { questions: questions });
  });
});

//SET ANSWERS for questions
router.post('/questions', (req, res, next) => {
  Question.findOne({level: req.body.level}, function(err, question) {
    if (err) {
      return red.render('./admin/questions', { error: 'Failure on adding question for Level ' + req.body.level + '.' })
    }
    question.question = req.body.question;
    question.answer = req.body.answer;
    question.save();
    return res.redirect('/admin/questions');
  });
});

//Render manage questions page
router.get('/add-questions', (req, res, next) => {
  if (!req.user || req.user.username !== 'MINET') {
    res.redirect('/');
  }
  Question.find().exec(function(err, questions) {
    return res.render('./admin/add-questions', { questions: questions });
  });
});

//SET ANSWERS for questions
router.post('/add-questions', (req, res, next) => {
  Question.addQuestion(req.body.level, req.body.question, req.body.answer, (err) => {
    if (err) {
      return res.render('./admin/add-questions', { error: 'Question for Level ' + req.body.level + ' already exists.' });
    }
    return res.render('./admin/add-questions', { error: 'Question for Level ' + req.body.level + ' created successfully.' });
  });
});

//Render LOGS page
router.get('/logs', (req, res, next) => {
  if (!req.user || req.user.username !== 'MINET') {
    res.redirect('/');
  }
  CryptXLogs.find().sort('-time').limit(50).exec(function(err, logs) {
    return res.render('./admin/logs', { logs: logs, isLogs: true });
  });
});

router.get('/disqualify', (req, res, next) => {
  if (!req.user || req.user.username !== 'MINET') {
    res.redirect('/');
  }
  User.find({username:{$ne: 'MINET'}}).sort('username').exec(function(err, teams) {
    return res.render('./admin/disqualify', { teams: teams });
  });
});

router.post('/disqualify', (req, res, next) => {
  User.findOne({username: req.body.username}).remove().exec();
  return res.redirect('/admin/disqualify');
});

module.exports = router;
