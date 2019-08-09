<template>
<section class="container">
        <h1>OekakiChat</h1>
        <hr>
        <h4>名前を入力してスタート！</h4>
        <table>
        <tr>
            <th>名前</th>
            <td><input type="text" name="user" 
                class="user" size="20"
                v-model="user">
            </td>
        </tr>
        </table>
        <button @click="sendUserName">入室</button>
        <hr>
        <hr>
    </section>
</template>


<script>
import io from 'socket.io-client'
import Cookies from "universal-cookie";

export default {
  data() {
    return {
      socket: '',
      isLoading: true
    }
  },
  computed: {
  },
  mounted() {
    this.socket = io()

    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  },
  methods: {
    sendUserName() {
      //ユーザー名をCookieに保存
      const cookies = new Cookies();
      cookies.set("user", this.user, { maxAge: 60 * 60 * 24 * 7 });
      this.socket.emit('name-set', this.user);
      this.$router.push('/oekakichat');
    }
  }
}
</script>


<style scoped>
a {
  font-size:16pt;
}
.link {
  background-color: #def;
  padding:10px;
}
.container {
  padding:5px 10px;
}
h1 {
  font-size: 60pt;
  color: #345980;
}
p {
  padding-top:5px;
  font-size: 20pt;
}
pre {
  padding: 10px;
  font-size: 18pt;
  background-color: #efefef;
}
hr {
  margin:10px 0px;
}
button{
  color:#efefef;
  width: 50px;
  display:block;
  text-align:center;
  background-color:#345980;
}
.user{
  background-color: #efefef;
  color:#345980;
  margin:5px;
}
</style>