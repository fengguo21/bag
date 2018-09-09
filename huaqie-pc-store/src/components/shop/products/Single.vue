<template>
    <el-col :span="7">
      <el-card :body-style="{ padding: '0px' }">
        <div @click='seePro(product)'>
          <img :src="product.basic.avatar==''?'http://lorempixel.com/300/400/':product.basic.avatar" class="image" :alt="product.basic.title">
        </div>
        <div style="padding: 10px;">
          <span class='list-title' @click='seePro(product)'><strong>{{product.basic.title}}</strong></span>
          <div class="bottom clearfix">
            <p class="card-text">
              <p style='color: #f00'>giá bán: {{product.basic.prices[product.basic.prices.length-1].price}} VND</p>
              <p>cổ phần: {{product.basic.stock}}</p>
            </p>
            <add-to-cart :product="product"></add-to-cart>
          </div>
        </div>
      </el-card>
    </el-col>
</template>

<script>
  import AddToCart from './AddToCart';
  import { mapActions } from 'vuex'
  import { set } from '@/api/common'
  export default {
    props: {
      product: Object,
    },
    data() {
      return {
        currentDate: new Date(),
      };
    },
    components: {
      AddToCart,
    },
    methods: {
      ...mapActions([
        'nowProduct'
      ]),
      seePro(prodata) {
        this.$router.push('/product');
        this.nowProduct(prodata);
        set('seePro', prodata);
      }
    }
  };
</script>

<style scoped>
  .image {
    width: 100%;
    height: 313.5px;
    display: block;
  }
  .el-col {
    border-radius: 4px;
    margin: 10px;
  }
  .list-title {
    display: block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; 
  }
  .card-text > p {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; 
  }
</style>
