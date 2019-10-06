<template>
    <div>
      <div id="container">
        <div id="itemA">
              <FreeDrawing 
              :mode="mode"
              :brushColor="brushColor"
              />
        </div>      
        <div id="itemB">
              <label for="mode">モード</label>
              <select v-model="mode" name="mode" id="mode">
                <option value="brush">ペン</option>
                <option value="eraser">消しゴム</option>
              </select>
              <chrome-picker  :value="brushColor"  @input="updateValue"></chrome-picker>
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
    defaultBrushColor: '#000000',
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

<style scoped>
#container {
    display: grid; /* グリッドレイアウト */
    grid-template-rows: 100px 50px;
    grid-template-columns: 250px 1fr;
}
#itemA {
    grid-row: 1 / 2;
    grid-column: 2 / 3;
}
#itemB {
    grid-row: 1 / 3;
    grid-column: 1 / 2;
}
</style>