const $Expect = require('chai').expect
const $spy = require('sinon').spy

const $Websocket = require('../src/index')
const $createServer = require('./fixture/server')

process.on('uncaughtException', function(e){
  console.log('Uncaught exception occurs.')
  console.error(e)
})

describe('Node-cq-websocket: A Node SDK for CoolQ HTTP API plugin.', function() {
  before("Launch servers", async function() {
    this.defaultServer = await $createServer('127.0.0.1', 6700)
    this.customServer = await $createServer('127.0.0.1', 7777)
  })

  after("Shut down servers", async function(){
    await this.defaultServer.shutDown()
    await this.customServer.shutDown()
  })

  afterEach("Reset server connections and listeners", function(){
    this.defaultServer.reset()
    this.customServer.reset()
  })

  describe('new Websocket(...).connect()', function(){
    it('should connect to a server with default parameters', function(done){
      let connTypesServer = [], connTypesClient = []
      this.defaultServer.on('connect', function(type, conn){
        connTypesServer.push(type)
      })

      let defaultBot = new $Websocket()
        .on('socket.connect', function(type, conn){
          connTypesClient.push(type)
          if(defaultBot.isConnected()){
            $Expect(connTypesClient, "Established connections types")
              .to.have.lengthOf(2)
              .and.to.have.same.members(connTypesServer)
            done()
          }
        })
        .connect()
    })

    it('should connect to a server with custom host and port', function(done){
      let connTypesServer = [], connTypesClient = []
      this.customServer.on('connect', function(type, conn){
        connTypesServer.push(type)
      })

      let customBot = new $Websocket({
        host: '127.0.0.1',
        port: 7777
      })
        .on('socket.connect', function(type, conn){
          connTypesClient.push(type)
          if(customBot.isConnected()){
            $Expect(connTypesClient, "Established connections types")
              .to.have.lengthOf(2)
              .and.to.have.same.members(connTypesServer)
            done()
          }
        })
        .connect()
    })

    it('should not establish the /api connection if it is disabled', function(done){
      let connTypesServer = [], connTypesClient = []
      this.defaultServer.on('connect', function(type, conn){
        connTypesServer.push(type)
      })

      let apiDisabledBot = new $Websocket({
        enableAPI: false
      })
        .on('socket.connect', function(type, conn){
          connTypesClient.push(type)
          if(apiDisabledBot.isConnected()){
            $Expect(connTypesClient, "Established connections types")
              .to.have.lengthOf(1)
              .and.to.have.same.members(connTypesServer)
            done()
          }
        })
        .connect()
    })

    it('should not establish the /event connection if it is disabled', function(done){
      let connTypesServer = [], connTypesClient = []
      this.defaultServer.on('connect', function(type, conn){
        connTypesServer.push(type)
      })

      let eventDisabledBot = new $Websocket({
        enableEvent: false
      })
        .on('socket.connect', function(type, conn){
          connTypesClient.push(type)
          if(eventDisabledBot.isConnected()){
            $Expect(connTypesClient, "Established connections types")
              .to.have.lengthOf(1)
              .and.to.have.same.members(connTypesServer)
            done()
          }
        })
        .connect()
    })

    it('should connect the server with a token if the token is provided', function(done){
      let connTypesServer = []
      this.defaultServer.on('token', function(type, token){
        connTypesServer.push(type)

        $Expect(token, `'access_token' for the ${type} connection`).to.equal(myToken)

        if(connTypesServer.length >= 2){
          done()
        }
      })

      let myToken = "asd123456", accessTokenBot = new $Websocket({
        access_token: myToken
      })
        .connect()
    })
  })
})
