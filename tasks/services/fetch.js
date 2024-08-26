/*
 * grunt-ps-fetch
 *
 * Copyright (c) 2023 Peter Selvaraj
 * Licensed under the MIT license.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const log = require('grunt-ps-log');
const { Downloader } = require('nodejs-file-downloader');

class FetchSvc {
  #fileIndex = 0;

  #createDest(dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
  }

  async #fetchFile(opts, done) {
    const dest = path.dirname(opts.dest);

    this.#createDest(dest);

    log.log(`Downloading ${opts.url}...`);

    const downloader = new Downloader({
      url: opts.url,
      directory: dest
    });

    try {
      await downloader.download();
      done();
    } catch (error) {
      log.fail(`Downloading ${opts.url} failed!`);
    }
  }

  fetchFiles(files, done) {
    if (this.#fileIndex === files.length) {
      this.#fileIndex = 0;
      done();
    } else {
      this.#fetchFile(files[this.#fileIndex], () => {
        this.#fileIndex++;
        this.fetchFiles(files, done);
      });
    }
  }
}

module.exports = new FetchSvc();
