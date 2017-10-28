const $Expect = require('chai').expect
const $spy = require('sinon').spy

const $Websocket = require('../src/index')
const $createServer = require('./fixture/server')

describe('Node-cq-websocket: A Node SDK for CoolQ HTTP API plugin.', function() {
  describe('new Websocket(...)', function(){
    before("Launch servers", function(done) {
      $createServer('127.0.0.1', 6700).then(dserver => {
        this.defaultServer = dserver

        // $createServer('127.0.0.1', 7777).then(cserver =>{
        //   this.customServer = cserver
        // })
        // .catch(function(err){
        //   throw err
        // })

        done()
      })
      .catch(function(err){
        throw err
      })
    })

    after("Shut down servers", function(){
      return this.defaultServer.shutDown()
    })

    it('should connect to a server with default parameters', function(done){
      let connTypes = []
      this.defaultServer.on('connect', function(type){
        connTypes.push(type)

        if(connTypes.length == 2){
          $Expect(connTypes, "Established connections types")
            .to.have.lengthOf(2)
            .and.to.include('/api')
            .and.to.include('/event')
          done()
        }
      })

      let defaultBot = new $Websocket().connect()
    })

    // it('should connect to a server with custom host and port', function(){
    //   this.customBot = new $Websocket({
    //     host = '127.0.0.1',
    //     port = 7777
    //   })
    // })
    //
    // it('should not establish the api connection if it is disabled', function(){
    // })

  })
})
