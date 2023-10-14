import { defineStore } from "pinia";
import Papa from "papaparse";

export const useVillageStore = defineStore("village", {
  state: () => ({
    // 登录用户
    user: null,
    // 村庄所有住户数据信息（houseMsg）

    // 房屋住户
    houseHolderMsg: {},
    // 村庄信息
    villageMsg: {},
  }),
  getters: {
    //doubleCount: (state) => state.counter * 2,
    getVillageMsg(state) {
      return state.villageMsg;
    },

    getHouseHolderMsg(state) {
      return state.houseHolderMsg;
    },
  },
  actions: {
    // increment() {this.counter++;},
    // 加载houseHolderMsg信息
    // csvFilePath csv文件路径 '/csv/zhonggang.csv'
    async loadHouseHolderCSVData(aCsvName, csvFilePath) {
      try {
        const response = await fetch(csvFilePath);
        const csvString = await response.text();
        Papa.parse(csvString, {
          header: true, //是否有表头
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            // 存储村庄信息
            this.houseHolderMsg[aCsvName] = results.data;
          },
          error: () => {
            console.error("CSV parsing error:");
          },
        });
      } catch (error) {
        console.error("Error loading CSV data:", error);
      }
    },

    async loadCSVData(aVillage, csvFilePath) {
      try {
        const response = await fetch(csvFilePath);
        const csvString = await response.text();
        Papa.parse(csvString, {
          header: true, //是否有表头
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            // 存储村庄信息
            // this.villageMsg = results.data;
            this.villageMsg[aVillage] = results.data;
            console.log(this.villageMsg);
          },
          error: () => {
            console.error("CSV parsing error:");
          },
        });
      } catch (error) {
        console.error("Error loading CSV data:", error);
      }
    },
  },
});
