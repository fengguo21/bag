<template>
  <div class="detailbox mainbox">
    <div class="detail_box1">
        <div class="bnr">
        <div class="bnrimg"><img :src="detail.store_image"></div>
        <div class="logo"><img :src="(detail.store_logo=='' || detail.store_logo==null)?defaultlogo:detail.store_logo">
        </div></div>
        <h1>{{detail.store_display_name}}

        </h1>
        <ul>
        <li class="li1" v-if="detail.store_location">{{detail.store_location}}<!--<a class="icon_favor" href="javascript:void(0)">收藏</a>--></li>
        <li class="li2" v-if="detail.store_phone">{{detail.store_phone}}<div class="icon_tel" @click="opentel(detail.store_phone)">拔打</div></li>
        <li class="li3" v-if="this.countnum>0">
        <span v-for="(item,index) in vip" v-if="item.discount">{{item.grade_name}}：{{item.discount}}</span>
        </li>
        <li class="li4" v-if="detail.shopping_card_accepted==1">可使用IFS购物卡</li>
        </ul>
        <div class="saledscp" v-if="detail.store_description">
        <h2>商户简介</h2>
        <div class="brandtxt" v-if="detail.store_description" v-html="detail.store_description"></div>
        </div>
    </div>
     <el-dialog title="一键拔打" class="smallDialog" :visible.sync="dialog_phone" width="65%" :modal-append-to-body="false" center top="25vh">
      <center>
       <div v-for="item in phone_arr">
       <a :href="'tel:'+item" class="tel">{{item}}</a>s
       </div>
      </center>
    </el-dialog>
  </div>
</template>
<style lang="less" rel="stylesheet/less">
  @import '../../static/css/main.less';
  .detailbox .bnr img{width:100%;}
  .detailbox .bnr{position:relative;}
  .detailbox .bnrimg{height:6.015625rem;overflow-y:hidden;}
  .detailbox .bnr .logo{position:absolute;top:4.53125rem;left:.390625rem;width:2.46875rem;}
  .detailbox .bnr .logo img{border:1px solid #f8f8f8;}
  .detailbox  h1{margin-left:3.203125rem;margin-top:0.4rem;font-size:@ttsize3;height:1.25rem;}
  .detailbox ul{font-size:@ttsize;}
  .detailbox li{padding:.32rem .390625rem;border-top:.015625rem solid #f6f6f6;padding-left:1.328125rem;min-height:0.5rem;}
  .detailbox li.li1{background:url('~assets/images/brand/icon-addr.png') .3125rem center no-repeat;background-size:.625rem auto;}
  .detailbox li.li2{background:url('~assets/images/brand/icon-phone1.png') .3125rem center  no-repeat;background-size:.625rem auto;position:relative;}
  .detailbox li.li3{background:url('~assets/images/brand/icon-event.png')  .3125rem center no-repeat;background-size:.625rem auto;}
  .detailbox li.li4{background:url('~assets/images/brand/icon-card.png')  .35rem center no-repeat;background-size:.6rem auto;}
  .detailbox li.li3 span{padding-right:10px;}
  .detailbox .saledscp{border-top:.15625rem solid #f7f7f7;padding:.390625rem 0 .546875rem .390625rem;}
  .detailbox .saledscp h2{margin-bottom:.3125rem;}
  .detailbox .icon_tel{background:#fff;border-radius:@radius;width:1.328125rem;float:right;padding:0.06rem 0;
  text-align:center;color:@iconcolor;border:1px solid @iconcolor;}
  .detailbox .brandtxt{width:95%;line-height:180%;}
  .detailbox .icon_favor{background:url('~assets/images/brand/icon-favor.jpg') no-repeat;background-size:.5rem auto;padding-left:.625rem;float:right;}
</style>
<script>
 export default {
   data(){
     return{
        detail:[],
        vip:[],
        brandtitle:"",
        countnum:0,
        phone_arr:[],
        dialog_phone:false,
        defaultlogo:'https://shengyiplus.idata.mobi/saas_images/ifs/store/defaultlogo.jpg'
     }
   },
   created(){
      if(document.getElementById('appLoading'))       {document.body.removeChild(document.getElementById('appLoading'))}
     var that=this;
     let id=that.$router.history.current.params.id;
      //获取品牌详情 start
       this.$http.get(
          this.global_config.datapost.data_url+'/saas-api/api/portal/custom', {
            params: {
              dataSourceCode: this.global_config.datapost.dataSourceCode,
              repCode:'REP_001543',
              wechat_id:this.$store.state.id,
              store:id
            }
          })
        .then(res => {
           var that=this

          that.detail = res.data.data[0];
          that.detail.store_description = decodeURI(
            res.data.data[0].store_description
          );
         that.brandtitle=res.data.data[0].store_name
         document.title = "成都IFS" + that.brandtitle
        }).catch(function (res) {
          console.log(res);
        });
      //获取品牌详情 end
       //获取折扣详情 start
       that.$http.get(
          this.global_config.datapost.data_url+'/saas-api/api/portal/custom', {
            params: {
              dataSourceCode: this.global_config.datapost.dataSourceCode,
              repCode:'REP_001544',
              wechat:this.$store.state.id,
              store:id
            }
          })
        .then(res => {
         that.vip = res.data.data;
         let viparr=that.vip;
         //判断有没有折扣，没有折扣则不显示
         for(var i=0;i<=viparr.length;i++)
         {
           viparr[i].discount=viparr[i].discount
           if(viparr[i].discount)
              that.countnum++
         }
        }).catch(function (res) {
          console.log(res);
        });
      //获取折扣详情 end
   },
   mounted(){
        // DOM 更新了
    //  console.log(this.$router.query.id);
   },
   methods: {
     //确定拔打电话
     //确定拔打电话
      opentel(tel) {
        //this.opentel1(tel);
        this.phone_arr=tel.split(' ')
        this.dialog_phone=true
      },
     //确定拔打电话 end
  }
 }
</script>
