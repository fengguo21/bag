<template>
  <div class="scoremainbox">
    <div class="cont">
      <div class="infoitem info1">
        <label>消费商铺</label>
        <el-autocomplete class="inline-input" v-model="storename" :fetch-suggestions="querySearch" placeholder="请输入消费商铺" :trigger-on-focus="false"
          @select="handleSelect"></el-autocomplete>
      </div>
      <div class="infoitem ">
        <label>消费金额</label>
        <input type="number" v-model="amount">
      </div>
      <div class="infoitem2">
        <label>消费日期</label>
        <input type="date" v-model="sdate">
      </div>
      <div class="imgupload" v-if="!showphoto">
        <!--imgtxt start-->
        <div class="imgtxt1" @click="uploadphoto">
          <img src="~assets/images/score/icon-photo.jpg">
          <br>拍照上传
        </div>
      </div>
      <!--imgtxt end-->
    </div>
    <div class="imgshow" v-if="showphoto">
      <img :src="wximg">
    </div>
    <input class="btn" type="button" :value="btnvalue" :disabled="disabled" @click="saveScore">
    </input>
    <div id="bulletin">
      <div class="tt1">温馨提示:</div>
      <div class="dscp">
        <p>1.请将购物小票清晰、无误地拍照上传，准确填写相应消费记录，工作人员会在7日内进行审核，审核确认前请您保留小票以便核对；</p>
        <p>2.购物小票须整张拍照，购物小票中流水号码、消费日期、消费金额、消费店铺等信息须清晰可见；</p>
        <p>3.如出现上传照片失真、信息缺失或填写信息与小票内容不一致等情况，积分将作失效；</p>
        <p>4.请于消费之日起7日内完成积分操作，逾期不再积分；</p>
        <p>5.会员可通过“我的积分”，查询14天内积分明细；</p>
        <p>6.积分规则详请参见
          <router-link to="/article_electronic">会员手册</router-link>。</p>
      </div>

    </div>

  </div>
</template>
<script type="text/javascript">
  import wx from 'weixin-js-sdk'
  /* import {
    wxInit
  } from '../../static/js/wxbase.js' */
  var wxbase = require('@/assets/js/wxbase.js')
  var wxInit = wxbase.wxInit
  export default {
    data() {
      return {
        showphoto: false,
        wximg: "",
        storename: "",
        amount: "",
        sdate: "",
        serverId: "",
        localIds: "",
        disabled: true,
        btnvalue: "确认上传",
        restaurants: [],
        imageList: [],
        mindate: "",
        maxdate: ""
      }
    },
    mounted() {
      var mindate = new Date()
      this.sdate = mindate.Format("yyyy-MM-dd")
      mindate.setDate(mindate.getDate() - 6)
      this.mindate = mindate.Format("yyyy-MM-dd")
      this.maxdate = new Date().Format("yyyy-MM-dd")
      wxInit()
      wx.error(function (res) {
        console.log(res)
      });
      this.getstore()
    },
    created() {
      if (document.getElementById('appLoading')) {
        document.body.removeChild(document.getElementById('appLoading'))
      }
    },

    methods: {
      ParseDate(s) { // 将字串解析成日期值
        var dv = new Date(Date.parse(s.replace(/-/g, "/")))
        return dv
      },
      getstore() {
        var that = this
        let url = that.global_config.datapost.codeurl + "/wechat/ifs/store/getstorename"
        let params = {}
        that.$http.get(url, {
            params: params
          })
          .then(res => {
            if (res.data.code == 0) {
              that.restaurants = res.data.data
            }
          }).catch(function (res) {
            console.log(res);
            // alert(res)
          });
      },
      querySearch(queryString, cb) {
        var restaurants = this.restaurants
        var len=restaurants.length
        var results=[]
        for(var i=0;i<len;i++){
        //如果字符串中不包含目标字符会返回-1
        if(restaurants[i].value.toUpperCase().indexOf(queryString.toUpperCase())>=0){
            results.push(restaurants[i]);
        }
        }
       // var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        console.log(item.value);
      },
      uploadphoto() {
        var that = this
       // that.validate_upload()
        wx.ready(function () {
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              that.localIds = res.localIds[0] // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
              if (window.__wxjs_is_wkwebview == true) { //是ios
                that.iosImage()
              } else {
                that.wximg = that.localIds
              }
              that.showphoto = !this.showphoto
              that.disabled = false
              //预览图片
              //  that.imageList.concat(res.localIds)
              //预览图片 end
            }
          });
        })
      },
      /* previewimg() {
           var that = this;
           var dataid = 0;
           var imageList = that.imageList;
           alert(imageList[0])
           wx.previewImage({
             current: imageList[0],
             urls: that.imageList
           });
       },*/
      iosImage() {
        var that = this
        wx.getLocalImgData({
          localId: that.localIds, // 图片的localID
          success: function (res) {
            that.wximg = res.localData // localData是图片的base64数据，可以用img标签显示
          }
        });
      },
      validate_upload() {
        var that = this
        /*==验证start==*/
        if (!that.storename) {
          that.popwarn1("请输入店铺名", "提示")
          return false
        }
        if (!that.amount) {
          that.popwarn1("请输入消费金额", "提示")
          return false
        }
        if (!that.sdate) {
          that.popwarn1("请输入消费日期", "提示")
          return false
        }
        if (that.sdate < that.mindate || that.sdate > that.maxdate) {
          that.popwarn1("请选择7天以内的日期", "提示")
          return false
        }
        /*==验证end==*/
      },
      saveScore() {
        var that = this
        that.validate_upload()
        that.disabled = true
        that.btnvalue = "上传中"
        wx.uploadImage({
          localId: that.localIds, // 需要上传的图片的本地ID，由chooseImage接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res) {
            that.serverId = res.serverId; // 返回图片的服务器端ID
            that.uploadscore()
          }
        });
      },
      uploadscore() { //上传拍照积分
        var that = this
        let url = that.global_config.datapost.codeurl + "/wechat/ifs/wechator/" + that.$store.state.id + "/photo"
        let params = {
          mediaId: that.serverId,
          storename: that.storename,
          amount: that.amount,
          date: that.sdate
        }
        that.$http.get(url, {
            params: params
          })
          .then(res => {
            if (res.data.code == 0) {
              that.showsucc()
            } else {
              that.popwarn1(res.data.msg, "提示")
              that.disabled = false
              that.btnvalue = "确认上传"
            }
          }).catch(function (res) {
            alert("error" + res)
            that.disabled = false
            that.btnvalue = "确认上传"
            // alert(res)
          });

      },
      showsucc() { //上传成功提示信息
        var that = this
        that.$confirm(
          '我们将在7日内对阁下提供的此笔消费进行核查，确认无误后将为阁下录入积分，如不符合成都IFS积分规则的，我们将拒绝为阁下此笔消费积分。<br><span style="font-size:0.27rem;color: #5d5d5d;">*积分规则请详见成都IFS VIP会员手册。</span>',
          '上传成功，积分待审核', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确认',
            showCancelButton: false,
            confirmButtonClass: "confirmbtn_1",
            center: true,
            callback: action => {
              that.disabled = false
              that.btnvalue = "确认上传"
              that.$router.push({
                name: 'selfscore'
              })
            }
          }).then(() => {

        }).catch(() => {});
      }
    }
  }

</script>
<style lang="less" rel="stylesheet/less">
  @import '../../static/css/main.less';
  .scoremainbox {
    .cont {
      padding: .7rem 0 .4rem 1.09375rem;
    }
    .img {
      border-bottom: 0.1875rem solid #f8f8f8;
      img {
        width: 4.84375rem;
        line-height: 3.953125rem;
        margin: 0.3125rem auto;
        margin-left: 50%;
        transform: translateX(-50%);
      }
    }

    @pdlfrt: .390625rem;
    #bulletin {
      padding-left: @pdlfrt;
      padding-right: @pdlfrt;
      padding-top: 0.46875rem;
      color: #5d5d5d;
      font-size: 0.265625rem;
      line-height: 1.6;
      border-top: .2rem solid #f5f5f5;
    }
    #bulletin .tt1 {
      font-size: @ttsize2;
      font-weight: bold;
      margin-bottom: 0.1rem;
    }
    #bulletin .dscp {
      padding-left: .2rem;

    }
    #bulletin a {
      color: @yellow;
      text-decoration: underline;
    }
    .btn {
      width: 85%;
      margin: 0px auto;
      display: block;
      height: 1.015625rem;
      background: #be9d56;
      line-height: 1.015625rem;
      text-align: center;
      font-size: 0.46875rem;
      color: white;
      margin-bottom: 0.46875rem;
      border: none;
      border-radius: @radius;
    }

    .btn:disabled {
      background: #b6b6b6;
    }

    .imgupload {
      padding: 0px;
      margin: .28125rem 0 0 2rem;
    }

    .imgupload .imgtxt1 {
      text-align: center;
      color: @yellow;
      font-size: @ttsize;
      width: 3rem;
      border: 1px solid @yellow;
      border-radius: @radius;
      padding: .1rem 0;
    }

    .imgupload .imgtxt1 img {
      width: .546875rem;
      margin-bottom: .1rem;
    }

    .imgshow {
      text-align: center;
      padding-bottom: .3125rem;
      width: 42%;
      margin-left: 3.1rem;
    }
    .imgshow img {
      width: 100%;
      border-radius: @radius;
    }
     .infoitem {
      font-size: @ttsize;
      margin-bottom: .3rem;
      line-height: 30px;
      vertical-align: middle;
      label {
        width: 1.9rem;
        display: inline-block;
      }
    }
    .infoitem input,.infoitem2 input {
      border: 1px solid @yellow;
      line-height: 30px;
      height: 30px;
      width: 4.47rem;
      border-radius: 4px;
      padding-left: 0.3rem;
      -webkit-appearance: none;
      background: #fff;
    }
    .info1 input {
      width: 4.82rem;
      height: 32px;
    }
    .infoitem2{font-size: @ttsize;
      margin-bottom: .3rem;
      vertical-align: middle;
      label {
        width: 1.9rem;
        display: inline-block;
      }
    }
    .infoitem2,.infoitem2 input{
      vertical-align:top;}

    .infoitem2 label{ margin-top:7px; vertical-align:top;}
  }

  @media only screen and (min-device-height:810px) {
    .scoremainbox #bulletin .dscp {
      line-height: 200%;
    }
    .scoremainbox .cont {
      padding-top: 1rem;
    }
  }


  /*
  .el-message-box__wrapper .el-message-box--center .el-message-box__header {
    padding-top: 0px;
  }
.scoremainbox .infoitem .el-input__inner{border: 1px solid @yellow;
      line-height: 30px;
      height: 30px;
      width: 4.47rem;
      border-radius: 4px;
      padding-left: 0.3rem;
      -webkit-appearance: none;
      background: #fff;} */

</style>
