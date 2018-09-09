<template>
  <div class="myself">
    <div class="title">
      <div class="inner">最近14天的消费明细，点击查看小票图片</div>
    </div>
    <div class="listitem" v-for='item in consume'>
      <div class="info">

        <div class="content" @click="getimg(global_config.datapost.codeurl+item.image_path)">
          <p class="gmfl">消费店铺： {{item.store_name}}</p>
          <div class="gmfr">
          <div class="foot" v-if="item.point_status==1">
            审核中
          </div>
          <div class="foot" v-if="item.point_status==2">已通过
          </div>
          <div class="foot" v-if="item.point_status==3">未通过
          </div>
          </div>
          <div class="clearfix"></div>
          <!--<p>消费金额： {{item.amount/100}}</p>-->
          <p>上传日期： {{item.create_time?item.create_time.substr(0,10):''}}</p>
          <p>消费日期： {{item.consume_date}}</p>
        </div>
      </div>

    </div>
    <div class="imgshow" v-show="showimg" @click="showimg=false">
      <div class="overlay"></div>
      <div class="imgcont">
        <img :src="imgpath">
        <div class="icon_close" @click="showimg=false">
          <img src="~assets/images/mc/icon-close2.png">
        </div>
      </div>

    </div>
  </div>

</template>
<script type="text/javascript">
  export default {
    data() {
      return {
        showimg: false,
        consume: [],
        imgpath: ""
      }
    },
    created() {
      if (document.getElementById('appLoading')) {
        document.body.removeChild(document.getElementById('appLoading'))
      }
    },
    mounted() {
      this.getscore()
    },
    methods: {
      getscore() {
        var that = this
        let url = that.global_config.datapost.codeurl + "/wechat/ifs/member/pointhist/" + that.$store.state.id
        let params = {
          type: 1
        }
        that.$http.get(url, {
            params: params
          })
          .then(res => {
            if (res.data.code == 0) {
              that.consume = res.data.data

            } else {
              that.popwarn1(res.data.msg, "提示")
            }
          }).catch(function (res) {
            console.log(res);
            alert("错误" + res)
          });
      },
      getimg(obj) {
        this.imgpath = obj
        this.showimg = true
      }

    }
  }

</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import '../../static/css/main.less';
  .title {
    text-align: center;
    color: @yellow;
    padding: .3rem 0;
    background: url('~assets/images/mc/jf-bg1.jpg') left center no-repeat;
    background-size: 20% .3125rem;
  }

  .title .inner {
    background: url('~assets/images/mc/jf-bg2.jpg') right center no-repeat;
    background-size: 20% .3125rem;
  }
 .listitem{padding-bottom:10px;}
  .content {
    padding: .125rem 5%;
    border-bottom: 1px solid #f7f7f7;
    border-top: 1px solid #f7f7f7;
  }

  .content .foot {
    text-align: right;

  }

  .imgshow .imgcont {
    width: 90%;
    margin: 0px auto;
    position: absolute;
    left: 50%;
    top: 10%;
    z-index: 101;
    margin-left: -45%;
    border-radius: @radius;
  }

  .imgshow img {
    width: 100%;
  }

  .imgshow .overlay {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background: rgba(7, 17, 27, 0.6);
  }

  .imgshow .icon_close {
    position: absolute;
    right: -.2rem;
    top: -.2rem;
  }

  .imgshow .icon_close img {
    width: 0.7rem;
    height: auto;
  }

</style>
