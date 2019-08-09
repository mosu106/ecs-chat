<template>
    <div>
        <div class="layout gutter">
          <div class="layout-item">
            <field style="float: right">
              <FreeDrawing 
              :mode="mode"
              :brushColor="brushColor"
              />
            </field>
            <field style="float: left">
              <label for="mode">モード</label>
              <select v-model="mode" name="mode" id="mode">
                <option value="brush">ペン</option>
                <option value="eraser">消しゴム</option>
                <option value="line">直線</option>
              </select>
            </field>

            <field style="float: left">
              <label for="brushColor">ペンの色</label>
              <chrome-picker  :value="brushColor"  @input="updateValue"></chrome-picker>
            </field>
          </div>
        </div>
    </div>
</template>

<script>
import FreeDrawing from './drawing.vue'
import {Chrome} from 'vue-color'

export default {
  name: 'callCanvas',
  components: {
    FreeDrawing,
    'chrome-picker': Chrome,
  },
  data: () => ({
    mode: '',
    brushColor: '',
    defaultMode: 'brush',
    defaultBrushColor: '#FFFFFF',
    colors: {
      hex: '#194d33',
      hsl: { h: 150, s: 0.5, l: 0.2, a: 1 },
      hsv: { h: 150, s: 0.66, v: 0.30, a: 1 },
      rgba: { r: 25, g: 77, b: 51, a: 1 },
      a: 1
    }
  }),
  mounted: function() {
    this.init();
  },
  methods: {
    // モードとペンの色を初期状態にする
    init: function() {
      this.mode = this.defaultMode;
      this.brushColor = this.defaultBrushColor;
    },
    updateValue: function(value) {
      this.brushColor = value.hex
    }
  }
}
</script>

<style lang="scss" scoped>
  .field {
    max-width: 110px;
  }
</style>
