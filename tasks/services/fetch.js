/*
 * grunt-ps-fetch
 *
 * Copyright (c) 2023 Peter Selvaraj
 * Licensed under the MIT license.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { log } = require('console');

class FetchSvc {
  #opts;
  #fileIndex = 0;

  #createDest(dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
  }

  #fetch(opts, done) {
    this.#opts = opts;
    this.#createDest(path.dirname(opts.dest));

    const config = this.#getFetchConfig(opts);

    log(`Downloading ${opts.url}...`);

    axios(config).then(resp => {
      if (resp.status === 200) {
        this.#onComplete(resp, done);
      } else {
        this.#onError();
        done();
      }
    });
  }

  fetchFiles(files, done) {
    if (this.#fileIndex === files.length) {
      this.#fileIndex = 0;
      done();
    } else {
      this.#fetch(files[this.#fileIndex], () => {
        this.#fileIndex++;
        this.fetchFiles(files, done);
      });
    }
  }

  #getFetchConfig(opts) {
    return {
      url: opts.url,
      method: 'get',
      responseType: 'stream'
    };
  }

  #onComplete(resp, done) {
    const pipe = fs.createWriteStream(this.#opts.dest);

    resp.data.pipe(pipe).on('close', () => {
      log('Download complete!');
      done();
    });
  }

  #onError() {
    log(`Downloading ${this.#opts.url} failed!`);
  }
}

module.exports = new FetchSvc();
