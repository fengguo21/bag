<template>
  <div class="page-container">
    <el-row>
      {{msg}}
    </el-row>

    <el-row :gutter="24">
      <el-col :span="24"> 
        <ProductList :products='products'></ProductList>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="page"
          :page-size="12"
          layout="total, prev, pager, next"
          :total="total">
        </el-pagination>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import ProductList from './products/List';
  import { getProductList } from '@/api/api'

  export default {
    name: 'shop',
    data() {
      return {
        msg: '',
        total: 0,
        page: 1,
        products: []
      };
    },
    components: {
      ProductList,
    },
    created() {
      this.getProducts()
    },
    watch: {
      tagName() {
        this.getProducts();
      }
    },
    computed: {
      tagName() {
        return this.$route.query.tagName;
      }
    },
    methods: {
      getProducts() {
        // console.log(tagName);
        getProductList({
          tagName: this.tagName,
          page: this.page,
          size: 12
        }).then(res => {
          if(res.code === 0) {
            // console.log(res.data.list);
            this.products = res.data.list;
            this.total = res.data.total
          } else {
            this.$message.error({
              message: res.message
            })
          }
        })
      },
      handleCurrentChange(val) {
        // console.log(val);
        this.page = val;
        this.getProducts();
      }
    }
  };
</script>
<style>
  .el-row {
    margin-bottom: 20px;
  }
  .el-row:last-child {
    margin-bottom: 0;
  }
  .el-col {
    border-radius: 4px;
  }

</style>
