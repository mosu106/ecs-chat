<template>
  <section class="section">
    <div id="wrapper" class="container">
      <div id=canvas>
    <!-- componentに追加したものはタグとして使用できるようになる -->
        <callCanvas />
      </div>
      <div id="chat">
      <article class="media" v-for="(message, index) in getMessages" :key="index">
        <figure class="media-left">
        </figure>
        <div class="media-content">
          <div class="content">
              <strong>{{ message.user }}</strong>    <small>{{ message.date }}</small>
              <br>
              <div v-bind:class="{ systemMessage: message.systemMessageFlag }">{{ message.text }}</div>
          </div>
        </div>
      </article>
      <article class="media">
        <div class="media-content">
          <div class="field is-grouped">
            <p class="control is-expanded">
              <input class="input message" type="text" v-model="message" @keyup.enter="sendMessage" placeholder="message">
            </p>
            <p class="control">
              <button class="button is-info" @click="sendMessage">
                送信
              </button>
            </p>
          </div>
        </div>
      </article>
      <b-loading :is-full-page="false" :active.sync="isLoading" :can-cancel="false"></b-loading>
      </div>
    </div>
  </section>
</template>

<script>
import io from 'socket.io-client'
import Cookies from "universal-cookie";
import callCanvas from './canvas.vue' // 作成したCallCanvas.vueをインポート

export default {
  components: {
    callCanvas // componentsにインポートしたCallCanvasを追加する。
  },
  data() {
    return {
      message: '',
      messages: [],
      myname:null,
      socket: '',
      isLoading: true,
      systemMessageFlag:false
    }
  },
  computed: {
    getMessages: function() {
      return this.messages
    },
  },
  mounted() {
    // VueインスタンスがDOMにマウントされたらSocketインスタンスを生成する
    this.socket = io()

    // サーバー側で保持しているメッセージを受信する
    this.socket.on('new-message', message => {
        this.messages.push( message || {} );
      }
    )
    // コンポーネントがマウントされてから1秒間はローディングする
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  },
  methods: {
    sendMessage() {
      // スペースのみの場合は即時リターンをする
      if (!this.message.trim()) {
        return
      }

      const cookies = new Cookies();
      this.myname = cookies.get("user");

      let now = new Date()  // 現在時刻（世界標準時）を取得
      now.setTime(now.getTime() + 1000 * 60 * 60 * 9) // 日本時間に変換
      now = now.toJSON().split('T')[1].slice(0, 5)  // 時刻のみを取得

      // メッセージオブジェクトを作る
      let message = {
        user: this.myname,
        date: now,
        text: this.message.trim(),
        systemMessageFlag:false
      }

      this.messages.push(message)
      this.socket.emit('send-message', message)
      this.message = ''
    }
  }
}
</script>

<style scoped>
.section{
  margin:0;
}
#wrapper
{
  display: grid;
  grid-template-rows: 520px 1fr;
}
.systemMessage{
    color:darkgray;
}
.container{
  margin: 0px;
}
input{
  display: inline-block;
}
.message{
  background-color: white;
  color: #000;
  width:300px;
  display: inline-block; 
}
button{
  position: relative;
  left: 310px;
}
p.control{
  position: fixed;
  bottom: 30px;
  display: inline-block; 
}

#chat{
  height: 100px;
  overflow: scroll;
}
</style>