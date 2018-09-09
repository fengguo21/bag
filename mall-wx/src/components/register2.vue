<template>
  <div class="regbox">
    <div class="ttbox">
      <el-row>
        <el-col :span="12">验证手机
          <span>1</span>
        </el-col>
        <el-col :span="12" class="active">成为会员
          <span>2</span>
        </el-col>
      </el-row>
    </div>
    <div class="loginbox">
      <h3>请填写以下信息，完成会员注册</h3>
      <div class="inputbox inputbox1">
        <input type="text" value="" placeholder="请输入姓名(必填)" v-model="txtNme">
      </div>
      <div class="inputbox inputbox2">
        <select v-model="txtSex">
          <option value="">请选择性别(必填)</option>
          <option value="1">男</option>
          <option value="2">女</option>
        </select>
      </div>

      <div class="inputbox inputbox2">
        <select v-model="txtCardtype">
          <option value="">请选择证件类型(必填)</option>
          <option value="0">身份证</option>
        </select>
      </div>
      <div class="inputbox inputbox3">
        <input type="text" value="" placeholder="请输入证件号码(必填)" v-model="txtCard" @blur="validate_card">
      </div>
      <div class="inputbox inputbox5">
        <input type="date" value="" placeholder="生日(选填)" v-model="txtbirth" :disabled="isbirth">
      </div>
      <div style="margin-bottom:0.3rem">宝宝性别和生日选填</div>
      <div class="inputbox inputbox4">
        <select v-model="txtbabySex">
          <option value="">宝宝性别(选填)</option>
          <option value="1">男</option>
          <option value="2">女</option>
        </select>
      </div>
      <div class="inputbox inputbox5">
        <input type="date" value="" placeholder="宝宝生日(选填)" v-model="babybirth">
      </div>
      <div class="inputbox inputbox6">
        <select v-model="txtFavor">
          <option value="0">喜爱的活动类型(选填)</option>
          <option v-for="option in favor_arr" :value="option.id">
            {{ option.tag_name }}
          </option>
        </select>
      </div>
      <div class="inputbox inputbox7">
        <select v-model="prov" style="width:30%">
          <option v-for="option in arr" :value="option.name=='请选择'?' ':option.name">
            {{ option.name }}
          </option>
        </select>
        <select v-model="city" style="width:30%">
          <option v-for="option in cityArr" :value="option.name=='请选择'?' ':option.name">
            {{ option.name }}
          </option>
        </select>
        <select v-model="district" v-if="district" style="width:30%">
          <option v-for="option in districtArr" :value="option.name=='请选择'?' ':option.name">
            {{ option.name }}
          </option>
        </select>
      </div>
      <div class="inputbox inputbox7">
        <input type="text" value="" placeholder="请输入详细地址" v-model="addr">
      </div>
    </div>

    <input type="button" value="确定" class="btn_step" @click="validatereg"></input>
  </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
  @import '../../static/css/main.less';
  @import '../../static/css/register.less';

</style>
<script>
//地区选择
  var area = require('@/assets/js/area.js')
  //身份证识别
  var aCity = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门",
    91: "国外"
  }
  //arr_all end
  export default {
    data() {
      return {
        txtNme: "",
        txtSex: "",
        txtCardtype: "",
        txtCard: "",
        txtbabySex: "",
        babybirth: "",
        txtbirth: "",
        txtFavor:0,
        favor_arr: [],
        login: false,
        arr: area.arr_all,
        prov: '四川',
        city: '成都',
        district: ' ',
        cityArr: [],
        districtArr: [],
        addr: "",
        isfirst: true,
        isbirth:false,
      }
    },
    created() {
      
      if (document.getElementById('appLoading')) {
        document.body.removeChild(document.getElementById('appLoading'))
      }
    },
    mounted() {
      this.getfavor()
    },
    methods: {
      //喜爱的活动类型
      getfavor() {
        var that = this
        let url = that.global_config.datapost.data_url + '/saas-api/api/portal/custom'
        let params = {
          dataSourceCode: that.global_config.datapost.dataSourceCode,
          repCode: 'REP_001752'
        }
        that.$http.get(url, {
            params: params
          })
          .then(res => {
            if (res.data.code == 0) {
              this.favor_arr = res.data.data
            } else {
              that.popwarn1(res.data.msg, "提示")
            }
          }).catch(function (res) {

          });
      },
      isCardID(sId) {//验证身份证
        var iSum = 0;
        var info = "";
        if (!/^\d{17}(\d|x)$/i.test(sId)) return "你输入的身份证长度或格式错误";
        sId = sId.replace(/x$/i, "a");
        if (aCity[parseInt(sId.substr(0, 2))] == null) return "你的身份证地区非法";
        var sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
        var d = new Date(sBirthday.replace(/-/g, "/"));
        if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) return "身份证上的出生日期非法";
        for (var i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11);
        if (iSum % 11 != 1) return "你输入的身份证号非法";
        //aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女");//此次还可以判断出输入的身份证号的人性别
        return true;
      },      
    validate_card(){
       if(this.isCardID(this.txtCard)!=true)
        {this.popwarn(this.isCardID(this.txtCard))}
    },
      IdCard(UUserCard, num) { //根据身份证获取信息
        var birth
        if (num == 1) {
          //获取出生日期
          birth = UUserCard.substring(6, 10) + "-" + UUserCard.substring(10, 12) + "-" + UUserCard.substring(12, 14);
          return birth;
        }
        if (num == 2) {
          //获取性别
          if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
            //男
            return "1";
          } else {
            //女
            return "2";
          }
        }
        if (num == 3) {
          //获取年龄
          var myDate = new Date();
          var month = myDate.getMonth() + 1;
          var day = myDate.getDate();
          var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
          if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <=
            day) {
            age++;
          }
          return age;
        }
      },
      popwarn(message, title) {
        var that = this
        that.$alert(message, title, {
          confirmButtonText: '确定',
          type: 'warning',
          confirmButtonClass: "confirmbtn_1",
          center: true,
          callback: action => {
            if (that.login) {
              that.gologin()
            }
          }
        });
      },
      gologin() {
        //注册成功后返回原来的页面
        var that = this
        var redirect = ""
        if (that.$route.query.redirect) {
          redirect = that.$route.query.redirect
        }
        if (redirect != "") {
          that.$router.replace(redirect)
        } else {
          that.$router.replace({
            name: 'mc'
          })
        }
      },
      validatereg() { //验证注册
        var that = this
        if (that.txtNme.length <= 0) {
          that.popwarn("请输入姓名", "提示")
          return
        }
        if (that.txtSex == "") {
          that.popwarn("请选择性别", "提示")
          return
        }
        if (that.txtbirth == "") {
          that.popwarn("请输入生日", "提示")
          return
        }
        if (that.txtCardtype == "") {
          that.popwarn("请选择证件类型", "提示")
          return
        }
        if (that.txtCard == "") {
          that.popwarn("请输入身份证号", "提示")
          return
        }
        if (that.txtCard == "") {
          that.popwarn("请输入身份证号", "提示")
          return
        }
        if (that.txtCard == "") {
          that.popwarn("请输入身份证号", "提示")
          return
        }
        if (that.prov == " ") {
          that.popwarn("请选择省市区", "提示")
          return
        }
        if (that.city == " ") {
          that.popwarn("请选择省市区", "提示")
          return
        }
        if (that.district == " ") {
          that.popwarn("请选择省市区", "提示")
          return
        }
        let phone = that.$route.query.phone
        //console.log("电话" + phone)
        //注册 start
        that.$http.get(
            that.global_config.datapost.codeurl + '/wechat/ifs/wechator/' + that.$store.state.id + '/register', {
              params: {
                phone: phone,
                name: that.txtNme,
                gender: that.txtSex,
                birth: that.txtbirth,
                idtype: that.txtCardtype,
                idno: that.txtCard,
                babygender: that.txtbabySex,
                babybirth: that.babybirth,
                fav: that.txtFavor,
                sheng: that.prov+"省",
                shi: that.city+"市",
                qu: that.district,
                addr: that.addr
              }
            })
          .then(res => {
            let rescode = res.data.code
            if (rescode == 0) {
              that.login = true
              /*==注册成功 写入会员信息==*/
              let data = res.data.data[0]
              that.$store.state.member.memberid = data.member_id
              that.$store.state.member.cardnum = data.card_num
              that.$store.state.member.pastpoint = data.member_past_point
              that.$store.state.member.memberpoint = data.member_point
              that.$store.state.member.gradenme = data.grade_code
              /*==注册成功 end==*/
              that.popwarn("注册成功")
            } else {
              if (res.data.msg.indexOf('微信号已经绑定会员') != -1) {
                that.login = true
              }
              that.popwarn(res.data.msg)
            }
          }).catch(function (res) {
            that.popwarn("接口调用失败", "提示")
          });
        //注册 end
      }, //三级联动 start
      updateCity: function () {
        for (var i in this.arr) {
          var obj = this.arr[i];
          if (obj.name == this.prov) {
            this.cityArr = obj.sub;
            break;
          }
        }
        this.city = this.cityArr[1].name;
      },
      updateDistrict: function () {
        for (var i in this.cityArr) {
          var obj = this.cityArr[i];
          if (obj.name == this.city) {
            this.districtArr = obj.sub;
            break;
          }
        }
        if (!this.isfirst) {
          if (this.districtArr && this.districtArr.length > 0 && this.districtArr[1].name) {
            this.district = this.districtArr[1].name
          } else {
            this.district = ''
          }
        }
        this.isfirst = false
      }

    },
    beforeMount: function () {
      this.updateCity();
      this.updateDistrict();
    },
    watch: {
      prov: function () {
        this.updateCity();
        this.updateDistrict();
      },
      city: function () {
        this.updateDistrict();
      },
      txtCard(curVal) {
        this.txtbirth = this.IdCard(curVal, 1)
        this.isbirth=true//身份证带出的生日不可修改
      }
    } //三级联动 end
  }

</script>
