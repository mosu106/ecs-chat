const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  let server = app.listen(port, host)
  socketStart(server)

  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

let messages = [];
let datas = [];

function socketStart(server) {
      // Websocketサーバーインスタンスを生成する
      const io = require('socket.io').listen(server)
  
      // クライアントからサーバーに接続があった場合のイベントを作成する
      io.on('connection', socket => {
        // 接続されたクライアントのidをコンソールに表示する
        console.log('id: ' + socket.id + ' is connected')

        //入室時のユーザー名のセット
        socket.on('name-set', function (user) {
          let now = new Date()  // 現在時刻（世界標準時）を取得
      　　 now.setTime(now.getTime() + 1000 * 60 * 60 * 9) // 日本時間に変換
      　　 now = now.toJSON().split('T')[1].slice(0, 5)  // 時刻のみを取得
          let message = {
            user: user,
            date: now,
            text: "お絵描きチャットに参加しました。",
            systemMessageFlag:true
          }
          socket.broadcast.emit('new-message', message)
          // サーバーで保持している変数にメッセージを格納する
          messages.push(message)
        });
  
        // サーバー側で保持しているメッセージをクライアント側に送信する
        if (messages.length > 0) {  
          messages.forEach(message => {
            socket.emit('new-message', message)
          })
        }

        // サーバー側で保持しているデータをクライアント側に送信する
        if (datas.length > 0) {  
          datas.forEach(data => {
            socket.emit('drawing', data)
          })
        }
  
        // クライアントから送信があった場合のイベントを作成する
        socket.on('send-message', message => {
          messages.push(message)
          socket.broadcast.emit('new-message', message)
        })

        //　クライアントからお絵かき情報の送信があった場合のイベントを作成する
        socket.on('send-drawing', data => {
          datas.push(data);
          socket.broadcast.emit('drawing', data)
        })
      })
}
  
start()
