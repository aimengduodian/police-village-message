<template>
  <div id="leaflet-map">
    <div class="q-pa-md">
      <div class="q-gutter-md row items-start">
        <q-select
          style="min-width: 250px; max-width: 300px"
          filled
          v-model="selectedItem"
          :options="firstLevelOptions"
          label="选择搜索的乡镇"
          @new-value="createValue"
        />
        <q-select
          style="min-width: 250px; max-width: 300px"
          filled
          v-model="selectedSubItem"
          :options="secondLevelOptions"
          label="选择搜索的村庄"
          :disable="!selectedItem"
        />
      </div>
      <q-btn @click="getFirstLevelOption">加载乡镇</q-btn>
      <q-btn @click="onFirstLevelChange">加载村庄</q-btn>
    </div>
    <l-map
      :center="center"
      :zoom="zoom"
      :max-zoom="maxZoom"
      :min-zoom="minZoom"
    >
      <l-tile-layer :url="'/map/{z}/{x}/{y}.jpg'" :max-zoom="maxZoom" />
      <!--添加到地图上 -->
      <leaflet-marker />
    </l-map>
  </div>
</template>

<script>
// 引入leaflet插件的样式和脚本
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet";
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";
import LeafletMarker from "components/LeafletMarker.vue";
// 引入pinia插件
import { useVillageStore } from "stores/village-store";
import { ref, onUpdated } from "vue";

export default {
  components: {
    LMap,
    LTileLayer,
    LeafletMarker,
  },
  setup() {
    const store = useVillageStore();
    const selectedItem = ref(null);
    const selectedSubItem = ref(null);
    const firstLevelOptions = ref([]);
    const secondLevelOptions = ref([]);
    const zoom = ref(16);
    const maxZoom = ref(19);
    const minZoom = ref(15);

    const center = ref([34.60999648, 114.43005323]);
    // 地图滑动边界设置，设置地图最大边界范围
    const maxBounds = ref([
      [34.61936, 114.44316],
      [34.59549, 114.41917],
    ]);
    // 自定义图标
    const customIcon = null;

    // 设置一级下拉选项
    function getFirstLevelOption() {
      firstLevelOptions.value = [];
      store.villageMsg.祥符区.forEach((element) => {
        const aOptions = {};
        if (element.行政区代码.toString().length == 9) {
          aOptions.center = element.center;
          aOptions.maxBounds = element.maxBounds;
          aOptions.maxZoom = element.maxZoom;
          aOptions.minzoom = element.minZoom;
          aOptions.zoon = element.zoom;
          aOptions.label = element.行政区;
          aOptions.value = element.行政区代码;
          firstLevelOptions.value.push(aOptions);
        }
      });
      console.log(firstLevelOptions);
    }
    // 设置二级下拉选项
    // aCode上一级行政区代码，aCode数字类型
    function getSecondLevelOption(aCode) {
      secondLevelOptions.value = [];
      store.villageMsg.祥符区.forEach((element) => {
        const aOptions = {};
        if (aCode == element.行政区代码.toString().slice(0, 9)) {
          aOptions.center = element.center;
          aOptions.maxBounds = element.maxBounds;
          aOptions.maxZoom = element.maxZoom;
          aOptions.minzoom = element.minZoom;
          aOptions.zoon = element.zoom;
          aOptions.label = element.行政区;
          aOptions.value = element.行政区代码;
          secondLevelOptions.value.push(aOptions);
        }
      });
      console.log(secondLevelOptions);
    }
    function onFirstLevelChange() {
      const villageCode = selectedItem.value.value.toString();
      getSecondLevelOption(villageCode);
      // 处理一级下拉框变化事件
      // 这里可以根据选择的一级选项进行逻辑处理
    }
    function createValue(val, done) {
      console.log(val);
      console.log(done);
    }
    return {
      zoom,
      maxZoom,
      minZoom,
      center,
      maxBounds,
      customIcon,
      store,
      selectedItem,
      selectedSubItem,
      firstLevelOptions,
      secondLevelOptions,
      onFirstLevelChange,
      getFirstLevelOption,
      getSecondLevelOption,
      createValue,
    };
  },
};
</script>

<style scoped>
#leaflet-map {
  width: 100%;
  height: 600px;
}
</style>
