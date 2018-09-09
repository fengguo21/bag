<template>
  <el-button
    :disabled="!product.basic.stock"
    @click="addToCart(product)"
  >
    Thêm vào giỏ hàng
  </el-button>
</template>

<script>
  import cart from '@/api/cart'
  import store from 'store'

  export default {
    props: {
      product: Object,
    },
    methods: {
      addToCart(pro) {
        // console.log(pro);
        if(store.get('user')) {
          cart.addToCart(pro);
          this.$router.push('/cart');
        } else {
          this.$message.error({
            message: 'Vui lòng đăng nhập trước'
          })
          this.$router.push('/signIn')
        } 
      }
    }
  };
</script>
