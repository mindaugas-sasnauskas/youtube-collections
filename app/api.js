// Copyright 2015-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

var express = require('express');
var bodyParser = require('body-parser');

module.exports = function (model) {

  var router = express.Router();

  // Automatically parse request body as JSON
  router.use(bodyParser.json());

  /**
   * GET /api/books
   *
   * Retrieve a page of books (up to ten at a time).
   */
  router.get('/yout', function list(req, res, next) {
    model.list(10, req.query.pageToken, function (err, entities, cursor) {
      if (err) {
        return next(err);
      }
      res.json({
        items: entities,
        nextPageToken: cursor
      });
    });
  });
  router.get('/userItems', function list(req, res, next) {
    console.log(req.session.profile.id + req.query.pageToken);
    model.listBy(50, req.session.profile.id, req.query.pageToken, function (err, entities, cursor) {
      if (err) {
        return next(err);
      }
      res.json({
        items: entities,
        nextPageToken: cursor
      });
    });
  });

  /**
   * POST /api/books
   *
   * Create a new book.
   */
  router.post('/yout', function insert(req, res, next) {
    req.body.createdById = req.session.profile.id;
    model.create(req.body, function (err, entity) {
      if (err) {
        return next(err);
      }
      res.json(entity);
    });
  });

  /**
   * GET /api/books/:id
   *
   * Retrieve a book.
   */
  router.get('/:yout', function get(req, res, next) {
    model.read(req.params.book, function (err, entity) {
      if (err) {
        return next(err);
      }
      res.json(entity);
    });
  });

  /**
   * PUT /api/books/:id
   *
   * Update a book.
   */
  router.put('/:collection', function update(req, res, next) {
    if (req.body.type == "add") {
      console.log("ll");


      model.read(req.params.collection, function (err, entity) {
        if (err) {
          return next(err);
        }

        if (entity.items == undefined) {
          entity.items = [];
        }
        entity.items.push(req.body);
        model.update(req.params.collection, entity, function (err, entity) {
          if (err) {
            return next(err);
          }
          res.json(entity);
        });
      });


    } else if (req.body.type == "remove") {
      model.read(req.params.collection, function (err, entity) {
        if (err) {
          return next(err);
        }

        for (var i = 0; i < entity.items.length; i++) {

          if (entity.items[i].channelId == req.body.channelId) {
         entity.items.splice(i, 1);
          }
        }
        model.update(req.params.collection, entity, function (err, entity) {
          if (err) {
            return next(err);
          }
          res.json(entity);
        });
      });
    } else {
      model.update(req.params.collection, req.body, function (err, entity) {
        if (err) {
          return next(err);
        }
        res.json(entity);
      });

    }
  });

  /**
   * DELETE /api/books/:id
   *
   * Delete a book.
   */
  router.delete('/:collection', function _delete(req, res, next) {
    console.log(req.params);
    model.delete(req.params.collection, function (err) {
      if (err) {
        return next(err);
      }
      res.status(200).send('OK');
    });
  });

  /**
   * Errors on "/api/books/*" routes.
   */
  router.use(function handleRpcError(err, req, res, next) {
    // Format error and forward to generic error handler for logging and
    // responding to the request
    err.response = {
      message: err.message,
      internalCode: err.code
    };
    next(err);
  });

  return router;
};
