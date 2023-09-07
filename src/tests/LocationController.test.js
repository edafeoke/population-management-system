import chai from 'chai';
import supertest from 'supertest';
import dotenv from 'dotenv';
import app from '../index';
import { Location } from '../models/Location';

import { getTotalResidents, errorHandler } from '../utils/helper';

import customResponseObject from '../utils/responses';
import statusCodes from '../utils/statusCodes';

dotenv.config();

import {
  success,
  updateSuccess,
  allLocations,
  created,
  recordNotFound,
  serverError,
  noRecords,
  appWelcomeMessage
} from '../utils/messages';

const createLocationErrorMessages = [ 
  'Location name is required.',
  'Number of male residents is required.',
  'Number of female residents is required.',
  'Number of male residents should be an integer.',
  'Number of female residents should be an integer.'
]

const expect = chai.expect;
const request = supertest(app);
const baseUrl = '/api/v1';

let locationId = null;

describe('Population Management System', () => {
  before((done) => {
    Location.remove({}).then(() => done());
  });

  describe('endpoints', () => {
    it('should load the initial page', (done) => {
      request
      .get(`${baseUrl}/`)
      .set({'Content-Type': 'application/json'})
      .end((error, res) => {
        expect(res.status).to.eql(statusCodes.success)
        expect(res.body.message).to.eql(appWelcomeMessage);
        done();
      });
    });

    it('should return no records for get all locations', (done) => {
      request
      .get(`${baseUrl}/locations`)
      .set({'Content-Type': 'application/json'})
      .end((error, res) => {
        expect(res.status).to.eql(statusCodes.success)
        expect(res.body.message).to.eql(noRecords);
        done();
      });
    });

    it('should return record not found for get a location', (done) => {
      request
      .get(`${baseUrl}/locations/5ca11d69f5cf154aa5d0c0d1`)
      .set({'Content-Type': 'application/json'})
      .end((error, res) => {
        expect(res.status).to.eql(statusCodes.notFound)
        expect(res.body.message).to.eql(recordNotFound);
        done();
      });
    });

    it('should return record not found for editing non-existent a location', (done) => {
      request
      .put(`${baseUrl}/locations/5ca11d69f5cf154aa5d0c0d1`)
      .set({'Content-Type': 'application/json'})
      .end((error, res) => {
        expect(res.status).to.eql(statusCodes.badRequest)
        expect(res.body.message).to.be.an('array');
        expect(res.body.message[0]).to.eql(createLocationErrorMessages[0]);
        expect(res.body.message[1]).to.eql(createLocationErrorMessages[1]);
        expect(res.body.message[2]).to.eql(createLocationErrorMessages[2]);
        done();
      });
    });

    it('should return error message for editing with incomplete location details',
    (done) => {
        request
        .put(`${baseUrl}/locations/5ca11d69f5cf154aa5d0c0d1`)
        .set({'Content-Type': 'application/json'})
        .send({ name: '', maleResidents: '', femaleResidents: ''})
        .end((error, res) => {
          expect(res.status).to.eql(statusCodes.badRequest)
          expect(res.body.message).to.be.an('array');
          expect(res.body.message[0]).to.eql(createLocationErrorMessages[0]);
          expect(res.body.message[1]).to.eql(createLocationErrorMessages[1]);
          expect(res.body.message[2]).to.eql(createLocationErrorMessages[2]);
          expect(res.body.message[3]).to.eql(createLocationErrorMessages[3]);
          expect(res.body.message[4]).to.eql(createLocationErrorMessages[4]);
          done();
        });
      });

      it('should return error message for editing with incomplete location details',
      (done) => {
        request
        .put(`${baseUrl}/locations/5ca11d69f5cf154aa5d0c0d1`)
        .set({'Content-Type': 'application/json'})
        .send({ name: 'Location', maleResidents: '', femaleResidents: ''})
        .end((error, res) => {
          expect(res.status).to.eql(statusCodes.badRequest)
          expect(res.body.message).to.be.an('array');
          done();
        });
      });

      it('should return error message for editing with incomplete location details',
      (done) => {
        request
        .put(`${baseUrl}/locations/5ca11d69f5cf154aa5d0c0d1`)
        .set({'Content-Type': 'application/json'})
        .send({ name: 'Location', maleResidents: 1, femaleResidents: ''})
        .end((error, res) => {
          expect(res.status).to.eql(statusCodes.badRequest)
          expect(res.body.message).to.be.an('array');
          done();
        });
      });

      it('should return error message for deleting a non-existent location',
      (done) => {
        request
        .delete(`${baseUrl}/locations/5ca11d69f5cf154aa5d0c0d1`)
        .set({'Content-Type': 'application/json'})
        .end((error, res) => {
          expect(res.status).to.eql(statusCodes.notFound)
          expect(res.body.message).to.eql(recordNotFound);
          done();
        });
      });

      it('should create a location', (done) => {
        request
        .post(`${baseUrl}/locations/`)
        .set({'Content-Type': 'application/json'})
        .send({ 
            name: 'Location',
            maleResidents: 1, 
            femaleResidents: 5,
            totalResidents: getTotalResidents(5+1)
          })
        .end((error, res) => {
          locationId = res.body._id;
          expect(res.status).to.eql(statusCodes.created)
          expect(res.body.message).to.eql(created);
          expect(res.body.name).to.eql('Location');
          expect(res.body.maleResidents).to.eql(1);
          expect(res.body.femaleResidents).to.eql(5)
          expect(res.body.totalResidents).to.eql(5+1);
          done();
        });
      });

      it('should get a location', (done) => {
        request
        .get(`${baseUrl}/locations/${locationId}`)
        .set({'Content-Type': 'application/json'})
        .end((error, res) => {
          expect(res.status).to.eql(statusCodes.success)
          expect(res.body.message).to.eql(success);
          expect(res.body.details.name).to.eql('Location');
          expect(res.body.details.maleResidents).to.eql(1);
          expect(res.body.details.femaleResidents).to.eql(5)
          expect(res.body.details.totalResidents).to.eql(5+1);
          done();
        });
      });

      it('should modify an existing location', (done) => {
        request
        .put(`${baseUrl}/locations/${locationId}`)
        .set({'Content-Type': 'application/json'})
        .send({ 
          name: 'New Location',
          maleResidents: 11, 
          femaleResidents: 15,
          totalResidents: getTotalResidents(15+11)
        })
        .end((error, res) => {
          expect(res.status).to.eql(statusCodes.success)
          expect(res.body.message).to.eql(updateSuccess);
          expect(res.body.name).to.eql('New Location');
          expect(res.body.maleResidents).to.eql(11);
          expect(res.body.femaleResidents).to.eql(15)
          expect(res.body.totalResidents).to.eql(15+11);
          done();
        });
      });

      it('should fetch an existing location', (done) => {
        request
        .get(`${baseUrl}/locations/`)
        .set({'Content-Type': 'application/json'})
        .end((error, res) => {
          expect(res.status).to.eql(statusCodes.success)
          expect(res.body.message).to.eql(allLocations);
          expect(res.body.locations).to.be.an('array');
          expect(res.body.locations.length).to.be.greaterThan(0);
          res.body.locations.map(location => {
            expect(location.name).to.not.be.empty;
            expect(location.maleResidents).to.not.eql(0);
            expect(location.femaleResidents).to.not.eql(0)
            expect(location.totalResidents).to.eql(location.maleResidents + location.femaleResidents);
          })
          done();
        });
      });

      it('should delete an existing location', (done) => {
        request
        .delete(`${baseUrl}/locations/${locationId}`)
        .set({'Content-Type': 'application/json'})
        .end((error, res) => {
          expect(res.status).to.eql(statusCodes.success)
          expect(res.body.message).to.eql(success);
          done();
        });
      });
  });
});