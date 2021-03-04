<template>
  <div class="d-flex flex-column flex-grow-1 form form-border m-2 p-2" ref="table">
    <b-row no-gutters>
      <b-col cols="12">
        <div class="form-title text-center">
          <span>新營汽車客運股份有限公司薪津表</span>
        </div>
      </b-col>
    </b-row>
    <b-row no-gutters>
      <b-col cols="6">
        <div class="text-center">姓名：{{ item ? item.姓名 : '' }}</div>
      </b-col>
      <b-col cols="6">
        <div class="text-center">薪資月份：中華民國 {{ item ? item.民國年 : '-' }} 年 {{ item ? item.月份 : '-' }} 月</div>
      </b-col>
    </b-row>
    <b-row no-gutters>
      <b-col cols="4">
        <div class="block-one">
          <table class="w-100 custom-table">
            <thead>
              <tr>
                <th class="text-center" colspan="3">應發項目</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowspan="9" class="left-span-title text-center p-3">基本薪資結構</td>
                <td class="text-center">項目</td>
                <td class="amount-column text-center">金額</td>
              </tr>
              <tr>
                <td class="yellow-background">薪俸</td>
                <td class="text-right">
                  <input type="number" class="input-width" :disabled="isNaN(item.薪俸)" v-model.number="item.薪俸" :class="{ 'edited': item.薪俸 !== originSelectedItem.薪俸 }">
                </td>
              </tr>
              <tr>
                <td class="yellow-background">伙食津貼</td>
                <td class="text-right">
                  <input type="number" class="input-width" :disabled="isNaN(item.伙食津貼)" v-model.number="item.伙食津貼" :class="{ 'edited': item.伙食津貼 !== originSelectedItem.伙食津貼 }">
                </td>
              </tr>
              <tr>
                <td class="orange-background">平日里程獎金</td>
                <td class="text-right">
                  {{ item && item.平日里程獎金 ? item.平日里程獎金 : '0' | thousandsComma }}
                </td>
              </tr>
              <tr>
                <td class="orange-background">平日區域津貼</td>
                <td class="text-right">
                  {{ item && item.平日區域津貼 ? item.平日區域津貼 : '0' | thousandsComma }}
                </td>
              </tr>
              <tr>
                <td class="green-background">夜值津貼</td>
                <td class="text-right">
                  <input type="number" class="input-width" :disabled="isNaN(item.夜值津貼)" v-model.number="item.夜值津貼" :class="{ 'edited': item.夜值津貼 !== originSelectedItem.夜值津貼 }">
                </td>
              </tr>
              <tr>
                <td class="green-background">特殊津貼</td>
                <td class="text-right">
                  <input type="number" class="input-width" :disabled="isNaN(item.特殊津貼)" v-model.number="item.特殊津貼" :class="{ 'edited': item.特殊津貼 !== originSelectedItem.特殊津貼 }">
                </td>
              </tr>
              <tr>
                <td class="green-background">一人2車保管津貼</td>
                <td class="text-right">
                  <input type="number" class="input-width" :disabled="isNaN(item.一人2車津貼)" v-model.number="item.一人2車津貼" :class="{ 'edited': item.一人2車津貼 !== originSelectedItem.一人2車津貼 }">
                </td>
              </tr>
              <tr>
                <td class="green-background">里程補貼</td>
                <td class="text-right">
                  <input type="number" class="input-width" :disabled="isNaN(item.里程補貼)" v-model.number="item.里程補貼" :class="{ 'edited': item.里程補貼 !== originSelectedItem.里程補貼 }">
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" class="orange-background text-right font-weight-bold">小計(A)</td>
                <td class="text-right font-weight-bold">
                  {{ item && item['小計A'] ? item['小計A'] : '0' | thousandsComma }}
                </td>
              </tr>
              <tr>
                <td class="orange-background" colspan="2">平日每日工資額(F)=(A)÷{{ item ? item.當月上班日 : '0' }}</td>
                <td class="text-right">
                  {{ item && item['平日每日工資額F'] ? item['平日每日工資額F'] : '0' | thousandsComma }}
                </td>
              </tr>
              <tr>
                <td class="orange-background" colspan="2">平日每小時工資額(G)=(F)÷8</td>
                <td class="text-right">{{ item && item['平日每小時工資額G'] ? item['平日每小時工資額G'] : '0' | thousandsComma }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div class="block-two">
          <table class="w-100 custom-table">
            <tbody>
              <tr>
                <td rowspan="16" class="left-span-title text-center p-3">非固定支付項目</td>
                <td colspan="4" class="text-center">項目</td>
                <td class="amount-column text-center">金額</td>
              </tr>
              <tr>
                <td colspan="4" class="orange-background">假日加班費(例假 + 國定)</td>
                <td class="text-right">{{ item && item.假日加班費 ? item.假日加班費 : '0' | thousandsComma }}</td>
              </tr>
              <tr>
                <td colspan="4" class="orange-background">休息日加班費</td>
                <td class="text-right">{{ item && item.休息日加班費 ? item.休息日加班費 : '0' | thousandsComma }}</td>
              </tr>
              <tr>
                <td colspan="4" class="orange-background">假日、休息日里程獎金</td>
                <td class="text-right">{{ item && item['加班里程獎金'] ? item['加班里程獎金'] : '0' | thousandsComma }}</td>
              </tr>
              <tr>
                <td colspan="4" class="orange-background">假日、休息日區域津貼</td>
                <td class="text-right">{{ item && item['加班區域津貼'] ? item['加班區域津貼'] : '0' | thousandsComma }}</td>
              </tr>
              <tr>
                <td colspan="4" class="green-background">交通費補貼</td>
                <td class="text-right">
                  <input type="number" class="input-width" :disabled="isNaN(item.交通費補貼)" v-model.number="item.交通費補貼" :class="{ 'edited': item.交通費補貼 !== originSelectedItem.交通費補貼 }">
                </td>
              </tr>
              <tr>
                <td colspan="4" class="green-background">其他非勤務所得獎金</td>
                <td class="text-right">
                  <input type="number" class="input-width" :disabled="isNaN(item.其他非勤務所得獎金)" v-model.number="item.其他非勤務所得獎金" :class="{ 'edited': item.其他非勤務所得獎金 !== originSelectedItem.其他非勤務所得獎金 }">
                </td>
              </tr>
              <tr>
                <td colspan="4" class="green-background">活動配合獎金</td>
                <td class="text-right">
                  <input type="number" class="input-width" :disabled="isNaN(item.加班車津貼)" v-model.number="item.加班車津貼" :class="{ 'edited': item.加班車津貼 !== originSelectedItem.加班車津貼 }">
                </td>
              </tr>
              <tr>
                <td colspan="4" class="green-background">季獎金</td>
                <td class="text-right">
                  <input type="number" class="input-width" :disabled="isNaN(item.季獎金)" v-model.number="item.季獎金" :class="{ 'edited': item.季獎金 !== originSelectedItem.季獎金 }">
                </td>
              </tr>
              <tr>
                <td colspan="4" class="green-background">小費</td>
                <td class="text-right">
                  <input type="number" class="input-width" :disabled="isNaN(item.小費)" v-model.number="item.小費" :class="{ 'edited': item.小費 !== originSelectedItem.小費 }">
                </td>
              </tr>
              <tr>
                <td colspan="4" class="green-background">旅費</td>
                <td class="text-right">
                  <input type="number" class="input-width" :disabled="isNaN(item.旅費)" v-model.number="item.旅費" :class="{ 'edited': item.旅費 !== originSelectedItem.旅費 }">
                </td>
              </tr>
              <tr>
                <td colspan="4" class="green-background">教育補助費</td>
                <td class="text-right">
                  <input type="number" class="input-width" :disabled="isNaN(item.教育補助費)" v-model.number="item.教育補助費" :class="{ 'edited': item.教育補助費 !== originSelectedItem.教育補助費 }">
                </td>
              </tr>
              <tr>
                <td colspan="4" class="green-background">年終獎金</td>
                <td class="text-right">
                  <input type="number" class="input-width" :disabled="isNaN(item.年終獎金)" v-model.number="item.年終獎金" :class="{ 'edited': item.年終獎金 !== originSelectedItem.年終獎金 }">
                </td>
              </tr>
              <tr>
                <td colspan="4" class="green-background">慰問金</td>
                <td class="text-right">
                  <input type="number" class="input-width" :disabled="isNaN(item.慰問金)" v-model.number="item.慰問金" :class="{ 'edited': item.慰問金 !== originSelectedItem.慰問金 }">
                </td>
              </tr>
              <tr>
                <td class="orange-background">屆期未補休折發工資</td>
                <td class="count-days">計</td>
                <td class="count-days"></td>
                <td class="count-days">日</td>
                <td class="text-right">{{ item ? item.屆期未補休折發工資 : '-' }}</td>
              </tr>
              <tr>
                <td class="orange-background">未休特別休假工資</td>
                <td class="count-days">計</td>
                <td class="count-days">
                  <template v-if="item.未休特別休假工資 > 0">{{ item && item.未休特別休假日數 ? item.未休特別休假日數 : '-' }}</template>
                </td>
                <td class="count-days">日</td>
                <td class="text-right">
                  <template v-if="item.未休特別休假工資 > 0">{{ item && item.未休特別休假工資 ? item.未休特別休假工資 : '0' | thousandsComma }}</template>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="5" class="orange-background text-right font-weight-bold bottom-border-bold">小計(B)</td>
                <td class="text-right font-weight-bold bottom-border-bold">{{ item && item['小計B'] ? item['小計B'] : '0' | thousandsComma }}</td>
              </tr>
              <tr>
                <td colspan="5" class="orange-background text-center">應領金額(H)=(A)+(B)</td>
                <td class="text-right font-weight-bold">{{ item && item['應領金額H'] ? item['應領金額H'] : '0' | thousandsComma }}</td>
              </tr>
              <tr>
                <td colspan="5" class="yellow-background text-center">公司提撥勞工退休金</td>
                <td class="text-center font-weight-bold">
                  <input type="number" class="input-width" :disabled="isNaN(item.公司提撥勞工退休金)" v-model.number="item.公司提撥勞工退休金" :class="{ 'edited': item.公司提撥勞工退休金 !== originSelectedItem.公司提撥勞工退休金 }">
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </b-col>
      <b-col cols="4">
        <div class="block-three mx-5">
          <table class="w-100 custom-table">
            <tbody>
              <tr>
                <td colspan="4" class="text-center">應代扣項目</td>
              </tr>
              <tr>
                <td rowspan="15" class="left-span-title text-center p-3">員工自負額</td>
                <td colspan="2" class="text-center">項目</td>
                <td class="amount-column text-center">金額</td>
              </tr>
              <tr>
                <td colspan="2" class="yellow-background">勞保費</td>
                <td><input type="number" class="input-width" :disabled="isNaN(item.勞保費)" v-model.number="item.勞保費" :class="{ 'edited': item.勞保費 !== originSelectedItem.勞保費 }"></td>
              </tr>
              <tr>
                <td colspan="2" class="yellow-background">健保費</td>
                <td><input type="number" class="input-width" :disabled="isNaN(item.健保費)" v-model.number="item.健保費" :class="{ 'edited': item.健保費 !==  originSelectedItem.健保費 }"></td>
              </tr>
              <tr>
                <td colspan="2" class="green-background">暫借款</td>
                <td><input type="number" class="input-width" :disabled="isNaN(item.暫借款)" v-model.number="item.暫借款" :class="{ 'edited': item.暫借款 !== originSelectedItem.暫借款 }"></td>
              </tr>
              <tr>
                <td colspan="2" class="yellow-background">福利費</td>
                <td><input type="number" class="input-width" :disabled="isNaN(item.福利費)" v-model.number="item.福利費" :class="{ 'edited': item.福利費 !== originSelectedItem.福利費 }"></td>
              </tr>
              <tr>
                <td colspan="2" class="green-background">薪資所得稅</td>
                <td><input type="number" class="input-width" :disabled="isNaN(item.薪資所得稅)" v-model.number="item.薪資所得稅" :class="{ 'edited': item.薪資所得稅 !== originSelectedItem.薪資所得稅 }"></td>
              </tr>
              <tr>
                <td colspan="2" class="yellow-background">勞退自提</td>
                <td><input type="number" class="input-width" :disabled="isNaN(item.勞退自提)" v-model.number="item.勞退自提" :class="{ 'edited': item.勞退自提 !== originSelectedItem.勞退自提 }"></td>
              </tr>
              <tr>
                <td colspan="2" class="yellow-background">保險費</td>
                <td><input type="number" class="input-width" :disabled="isNaN(item.保險費)" v-model.number="item.保險費" :class="{ 'edited': item.保險費 !== originSelectedItem.保險費 }"></td>
              </tr>
              <tr>
                <td colspan="2" class="green-background">雜費</td>
                <td><input type="number" class="input-width" :disabled="isNaN(item.雜費)" v-model.number="item.雜費" :class="{ 'edited': item.雜費 !== originSelectedItem.雜費 }"></td>
              </tr>
              <tr>
                <td colspan="2" class="green-background">補充保費</td>
                <td><input type="number" class="input-width" :disabled="isNaN(item.補充保費)" v-model.number="item.補充保費" :class="{ 'edited': item.補充保費 !== originSelectedItem.補充保費 }"></td>
              </tr>
              <tr>
                <td colspan="2" class="green-background">執行命令代扣款</td>
                <td><input type="number" class="input-width" :disabled="isNaN(item.執行命令代扣款)" v-model.number="item.執行命令代扣款" :class="{ 'edited': item.執行命令代扣款 !== originSelectedItem.執行命令代扣款 }"></td>
              </tr>
              <tr>
                <td colspan="2" class="green-background">車損協議分攤</td>
                <td><input type="number" class="input-width" :disabled="isNaN(item.車損協議分擔)" v-model.number="item.車損協議分擔" :class="{ 'edited': item.車損協議分擔 !== originSelectedItem.車損協議分擔 }"></td>
              </tr>
              <tr>
                <td colspan="2" class="green-background">肇事和解分攤</td>
                <td><input type="number" class="input-width" :disabled="isNaN(item.肇事和解分擔)" v-model.number="item.肇事和解分擔" :class="{ 'edited': item.肇事和解分擔 !== originSelectedItem.肇事和解分擔 }"></td>
              </tr>
              <tr>
                <td colspan="2" class="green-background">出險保險費協議分攤</td>
                <td><input type="number" class="input-width" :disabled="isNaN(item.保險費協議分擔)" v-model.number="item.保險費協議分擔" :class="{ 'edited': item.保險費協議分擔 !== originSelectedItem.保險費協議分擔 }"></td>
              </tr>
              <tr><td colspan="2"></td><td></td></tr>
              <tr>
                <td colspan="3" class="orange-background text-center font-weight-bold">小計(C)</td>
                <td class="text-right font-weight-bold">{{ item && item['小計C'] ? item['小計C'] : '0' | thousandsComma }}</td>
              </tr>
              <tr><td colspan="4"></td></tr>
              <tr>
                <td rowspan="4">勤缺</td>
                <td class="text-center">項目</td>
                <td class="text-center days-column">日數</td>
                <td class="text-center">金額</td>
              </tr>
              <tr>
                <td>事假</td>
                <td class="orange-background text-right">{{ item ? item.事假日數 : '-' }}</td>
                <td class="orange-background text-right">{{ item && item.事假金額 ? item.事假金額 : '0' | thousandsComma }}</td>
              </tr>
              <tr>
                <td>病假</td>
                <td class="orange-background text-right">{{ item ? item.病假日數 : '-' }}</td>
                <td class="orange-background text-right">{{ item && item.病假金額 ? item.病假金額 : '0' | thousandsComma }}</td>
              </tr>
              <tr>
                <td>曠職</td>
                <td class="orange-background text-right">{{ item ? item.曠職日數 : '-' }}</td>
                <td class="orange-background text-right">{{ item && item.曠職金額 ? item.曠職金額 : '0' | thousandsComma }}</td>
              </tr>
              <tr>
                <td colspan="3" class="orange-background text-center font-weight-bold">小計(D)</td>
                <td class="text-right font-weight-bold">{{ item && item['小計D'] ? item['小計D'] : '0' | thousandsComma }}</td>
              </tr>
              <tr><td colspan="4"></td></tr>
              <tr><td colspan="4"></td></tr>
              <tr>
                <td rowspan="4" class="text-center">獎金現金已發</td>
                <td colspan="2" class="text-center">項目</td>
                <td class="text-center">金額</td>
              </tr>
              <tr>
                <td colspan="2" class="green-background text-center">獎金(紅包)</td>
                <td class="text-right">
                  <input type="number" class="input-width" :disabled="isNaN(item[`獎金紅包`])" v-model.number="item[`獎金紅包`]" :class="{ 'edited': item[`獎金紅包`] !== originSelectedItem[`獎金紅包`] }">
                </td>
              </tr>
              <tr><td colspan="2"></td><td></td></tr>
              <tr><td colspan="2"></td><td></td></tr>
              <tr>
                <td colspan="3" class="orange-background text-center font-weight-bold bottom-border-bold">小計(E)</td>
                <td class="text-right font-weight-bold bottom-border-bold">{{ item && item['小計E'] ? item['小計E'] : '0' | thousandsComma }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </b-col>
      <b-col cols="4">
        <div class="block-four">
          <table class="w-100 custom-table">
            <thead class="invisible">
              <tr class="fix-column-head">
                <th style="width: 40%;"></th>
                <th style="width: 15%"></th>
                <th style="width: 7.5%"></th>
                <th style="width: 7.5%"></th>
                <th style="width: 15%"></th>
                <th style="width: 15%"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="6" class="text-center">當月出勤統計</td>
              </tr>
              <tr>
                <td colspan="2" class="text-center">上班日統計</td>
                <td></td>
                <td colspan="3" class="orange-background text-center">本月行駛總里程</td>
              </tr>
              <tr>
                <td class="text-center">項目</td>
                <td class="text-center">日數</td>
                <td></td>
                <td colspan="2" class="text-center">{{ item && item.本月行駛總里程 ? item.本月行駛總里程 : '0' | thousandsComma }}</td>
                <td class="text-center">公里</td>
              </tr>
              <tr>
                <td class="orange-background">當月上班日</td>
                <td class="text-center">{{ item ? item.當月上班日 : '-' }}</td>
                <td></td>
                <td colspan="3" class="orange-background text-center">里程獎金總計</td>
              </tr>
              <tr>
                <td class="orange-background">實際上班日</td>
                <td class="text-center">{{ item ? item.實際上班日 : '-' }}</td>
                <td></td>
                <td colspan="2" class="text-center">{{ item && item.里程獎金總計 ? item.里程獎金總計 : '0' | thousandsComma }}</td>
                <td class="text-center">元</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td colspan="3" class="orange-background text-center">區域津貼總計</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td colspan="2" class="text-center">{{ item && item.區域津貼總計 ? item.區域津貼總計 : '0' | thousandsComma }}</td>
                <td class="text-center">元</td>
              </tr>
              <tr><td colspan="6"></td></tr>
              <tr>
                <td colspan="6" class="text-center">當月休假日數</td>
              </tr>
              <tr>
                <td class="text-center">假別</td>
                <td class="text-center">應給日數</td>
                <td colspan="2" class="text-center ">休假日數</td>
                <td class="text-center">加班日數</td>
                <td></td>
              </tr>
              <tr>
                <td>例假日</td>
                <td class="orange-background">{{ item ? item.例假日應給日數 : '-' }}</td>
                <td colspan="2" class="orange-background">{{ item ? item.例假日休假日數 : '-' }}</td>
                <td class="orange-background">{{ item ? item.例假日加班日數 : '-' }}</td>
                <td></td>
              </tr>
              <tr>
                <td>休息日</td>
                <td class="orange-background">{{ item ? item.休息日應給日數 : '-' }}</td>
                <td colspan="2" class="orange-background">{{ item ? item.休息日休假日數 : '-' }}</td>
                <td class="orange-background">{{ item ? item.休息日加班日數 : '-' }}</td>
                <td></td>
              </tr>
              <tr>
                <td>國定假日</td>
                <td class="orange-background">{{ item ? item.國定假日應給日數 : '-' }}</td>
                <td colspan="2" class="orange-background">{{ item ? item.國定假日休假日數 : '-' }}</td>
                <td class="orange-background">{{ item ? item.國定假日加班日數 : '-' }}</td>
                <td>(F)*1</td>
              </tr>
              <tr>
                <td>特休</td>
                <td class="orange-background">{{ item ? item.特休應給日數 : '-' }}</td>
                <td colspan="2" class="orange-background">{{ item ? item.特休休假日數 : '-' }}</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>病假</td>
                <td></td>
                <td colspan="2" class="orange-background">{{ item ? item.病假日數 : '-' }}</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>事假</td>
                <td></td>
                <td colspan="2" class="orange-background">{{ item ? item.事假日數 : '-' }}</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>喪假</td>
                <td></td>
                <td colspan="2" class="orange-background">{{ item ? item.喪假 : '-' }}</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>公假</td>
                <td></td>
                <td colspan="2" class="orange-background">{{ item ? item.公假 : '-' }}</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>婚假</td>
                <td></td>
                <td colspan="2" class="orange-background">{{ item ? item.婚假 : '-' }}</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>陪產假</td>
                <td></td>
                <td colspan="2" class="orange-background">{{ item ? item.陪產假 : '-' }}</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>災防假</td>
                <td></td>
                <td colspan="2" class="orange-background">{{ item ? item.災防假休假日數 : '-' }}</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td class="bottom-border-bold">選舉假</td>
                <td class="bottom-border-bold"></td>
                <td colspan="2" class="orange-background bottom-border-bold">{{ item ? item.選舉假休假日數 : '-' }}</td>
                <td class="bottom-border-bold"></td>
                <td class="bottom-border-bold"></td>
              </tr>
              <tr>
                <td colspan="6" class="no-border"></td>
              </tr>
              <tr>
                <td colspan="6" class="no-border"></td>
              </tr>
              <tr>
                <td colspan="4" class="text-center">當月加班日數(J)</td>
                <td>{{ item ? item.當月加班日數 : '-' }}</td>
                <td>日</td>
              </tr>
              <tr>
                <td colspan="4" class="text-center">平日上班日數(K)</td>
                <td>{{ item ? item.平日上班日數 : '-' }}</td>
                <td>日</td>
              </tr>
              <tr>
                <td colspan="6" class="no-border"></td>
              </tr>
              <tr>
                <td colspan="6" class="text-center orange-background font-weight-bold">本月實領金額=(H)-(C)-(D)-(E)</td>
              </tr>
              <tr>
                <td colspan="6" class="text-center font-weight-bold bottom-border-bold">{{ item && item.本月實領金額 ? item.本月實領金額 : '0' | thousandsComma }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'CompensationTable',
  components: {

  },
  props: {
    originSelectedItem: Object,
    selectedItem: Object,
    writable: Boolean,
  },
  data() {
    return {
    };
  },
  mounted() {
    // this.item = Object.assign({}, this.selectedItem);
  },
  computed: {
    item: {
      get() {
        console.log(this.selectedItem);
        return this.selectedItem;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  watch: {
  },
  filters: {
    thousandsComma(value) {
      const n = Number(value);

      // return `${n.toFixed(0).replace(/./g, (c, i, a) => {
      //   const currency = (i && c !== '.' && ((a.length - i) % 3 === 0) ? `, ${c}`.replace(/\s/g, '') : c);
      //   return currency;
      // })}`;

      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
  },
  methods: {
    trialCalculate() {
      const $el = this.item;

      // 檢查 this.item 是否為空物件，是的話不做試算
      const isEmpty = ((obj) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
        }

        return true;
      })($el);

      if (!this.item || isEmpty) {
        alert('尚無資料');
        return;
      }

      this.$emit('calculate');
    },
    update() {
      const $el = this.item;

      // 檢查 this.item 是否為空物件，是的話不做更新
      const isEmpty = ((obj) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
        }

        return true;
      })($el);

      if (!this.item || isEmpty) {
        alert('尚無資料');
        return;
      }

      this.$emit('updatePayroll');
    },
  },
};
</script>

<style lang="scss" scoped>
input {
  text-align: right;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}

.border {
  border: 1px solid #000000;
}

.yellow-background {
  background-color: #ffff00;
}

.orange-background {
  background-color: #ffc000;
}

.green-background {
  background-color: #92d050;
}

.operate-button-set {
  position: sticky;
  right: 0;
  top: 20px;
  z-index: 99;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.form {
  &.form-border {
    border: 1px solid #aaaaaa;
  }

  .form-title {
    font-size: 1.25rem;
    padding: .5rem 0;
  }
}

.block-two {
  margin-top: 38px;
}

.custom-table {
  th, td {
    border: 1px solid #000000;
    height: 38px;
  }

  td {
    padding: 0.2rem 0.25rem;
  }

  .fix-column-head > th {
    visibility: hidden;
    height: 0;
    border: none;
  }

  .left-span-title {
    width: 50px;
  }

  .amount-column {
    width: 100px;
  }

  .days-column {
    width: 50px;
  }

  .input-width {
    width: 100%;
    padding: 0 .4rem;
  }

  .edited {
    background-color: #ffc0c0;
  }

  .count-days {
    width: 30px;
  }

  .no-border {
    border: none;
  }

  .bottom-border-bold {
    border-bottom: 2px solid #000000;
  }
}
</style>
