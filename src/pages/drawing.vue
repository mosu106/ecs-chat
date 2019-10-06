<template>
  <div>
    <div ref="container" id="myCanvas">
      <canvas
        :width="width"
        :height="height"
        ref="canvas">
      </canvas>
    </div>
  </div>
</template>

<script>
import Konva from 'konva'
import io from 'socket.io-client'

export default {
  name: 'FreeDrawing',
  // propsは親の「CallCanvas.vue」から値を受け取るためのプロパティ
  props: {
    mode: {
      type: String,
      default: ''
    },
    brushColor: {
      type: String,
      default: ''
    },
    backgroundImage: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    width: 980,
    height: 500,
    stage: null,
    canvas: null,
    context: null,
    drawingLayer: null,
    drawingScope: null,
    lastPointerPosition: {},
    beforeLocalPos: {
      x: 0,
      y: 0
    },
    localPos: {
      x: 0,
      y: 0
    },
    pos: null,
    isPaint: false,
    socket: '',
  }),
  mounted: function () {
    // VueインスタンスがDOMにマウントされたらSocketインスタンスを生成する
    this.socket = io()

    var container = this.$refs.container;
    this.stage = new Konva.Stage({
      container,
      width: this.width,
      height: this.height
    })
    this.drawingLayer = new Konva.Layer()
    this.stage.add(this.drawingLayer)

    this.canvas = this.$refs.canvas
    this.drawingScope = new Konva.Image({
      image: this.canvas,
      x: 0,
      y: 0,
      stroke: 'black',
      fill: 'white',
    })
    this.drawingLayer.add(this.drawingScope)
    this.stage.draw()

    this.context = this.canvas.getContext('2d')
    this.context.strokeStyle = this.brushColor
    this.context.lineJoin = 'round'
    this.context.lineWidth = 5

    // イベント追加
    this.drawingScope.on('mousedown', this.mousedown)
    this.stage.addEventListener('mouseup', this.mouseup)
    this.stage.addEventListener('mousemove', this.mousemove)
    this.drawingScope.on('touchstart', this.mousedown)
    this.stage.addEventListener('touchend', this.mouseup)
    this.stage.addEventListener('touchmove', this.mousemove)

    // サーバー側で保持している描画情報を受信する
    this.socket.on('drawing',  data => {
        this.context.strokeStyle = data.color
        this.context.beginPath()
        // 描画開始座標を指定する
        this.context.moveTo(data.before.x, data.before.y)
        // 描画開始座標から、lineToに指定された座標まで描画する
        this.context.lineTo(data.after.x, data.after.y)
        this.context.closePath()
        this.context.stroke()
        this.drawingLayer.draw()
    })
  },
  methods: {
    mousedown: function () {
      this.isPaint = true
      // マウスダウン時の座標を取得しておく
      this.lastPointerPosition = this.stage.getPointerPosition()
    },
    mouseup: function () {
      this.isPaint = false
    },
    mousemove: function () {
      if (!this.isPaint) {
        return;
      }
      // ペンモード時
      if (this.isTargetMode('brush')) {
        this.context.globalCompositeOperation = 'source-over';
      }
      // 消しゴムモード時
      if (this.isTargetMode('eraser')) {
        this.context.globalCompositeOperation = 'destination-out';
      }

      this.context.beginPath()

      this.localPos.x = this.lastPointerPosition.x - this.drawingScope.x()
      this.localPos.y = this.lastPointerPosition.y - this.drawingScope.y()

      // 描画開始座標を指定する
      this.context.moveTo(this.localPos.x, this.localPos.y)
      this.beforeLocalPos.x = this.localPos.x
      this.beforeLocalPos.y = this.localPos.y

      this.pos = this.stage.getPointerPosition()
      this.localPos.x = this.pos.x - this.drawingScope.x()
      this.localPos.y = this.pos.y - this.drawingScope.y()

      // 描画開始座標から、lineToに指定された座標まで描画する
      this.context.lineTo(this.localPos.x, this.localPos.y)
      this.context.closePath()
      this.context.stroke()
      this.drawingLayer.draw()

      // メッセージオブジェクトを作る
      let data = {
        color: this.context.strokeStyle,
        before: this.beforeLocalPos,
        after: this.localPos,
      }
      // サーバー側から描画情報を送信
      this.socket.emit('send-drawing', data)

      this.lastPointerPosition = this.pos
    },
    onClearCanvas: function () {
      this.context.globalCompositeOperation = 'destination-out'
      this.context.fillRect(0, 0, this.width, this.height)
      this.drawingLayer.draw()
      this.$emit('on-reset')
    },
    // 現在のモードが指定されたモードと一致するかどうか
    isTargetMode: function (targetMode) {
      return this.mode === targetMode
    }
  },
  watch: {
    // ペンの色変更
    brushColor: function () {
      this.context.strokeStyle = this.brushColor
    }
  }
}
</script>
