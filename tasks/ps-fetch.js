/*
 * grunt-ps-fetch
 *
 * Copyright (c) 2023 Peter Selvaraj
 * Licensed under the MIT license.
 */

'use strict';

const grunt = require('grunt');
const fetchSvc = require('./services/fetch');

module.exports = function () {
  grunt.registerMultiTask('psFetch', 'Download files...', function () {
    const done = this.async();
    fetchSvc.fetchFiles(this.files, done);
  });
};
