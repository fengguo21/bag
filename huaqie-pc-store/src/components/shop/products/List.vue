<template>
  <el-row :gutter="24">
    <Single :product="product" v-for="(product, index) in products" :key="index"></Single>
  </el-row>
</template>

<script>
  import Single from './Single';

  export default {
    name: 'products',
    props: {
      products: Array
    },
    components: {
      Single,
    },
  };
</script>
