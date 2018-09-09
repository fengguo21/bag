<template>
  <div class="cart">
    <div id="type">
      <div v-show="!tableData.length">
        <h3>Giỏ hàng của bạn trống</h3>
        <p><i>Vui lòng thêm một số sản phẩm vào giỏ hàng.</i></p>
        <el-button type="success" size="large" @click='$router.push("/")'>Trở về nhà</el-button>
      </div>

<!--  <Items
        v-for="product in products"
        :product="product"
        :key="product.id">
      </Items> -->
      <el-table
        v-show='tableData.length'
        ref="cartTable"
        :data="tableData"
        border
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleChange">
        <el-table-column
          type="selection"
          width="100">
        </el-table-column>
        <el-table-column
          prop="title"
          label="Tên sản phẩm"
        >
        </el-table-column>
        <el-table-column
          prop="specs"
          label="Tham số"
        >
          <template scope='scope'>
            <el-tag type='primary' class='tag-class'>{{scope.row.specs}}</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="specs"
          label="颜色"
        >
          <template scope='scope'>
            <el-tag type='primary' class='tag-class'>{{scope.row.specs}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="specs"
          label="参数"
        >
          <template scope='scope'>
            <el-tag type='primary' class='tag-class'>{{scope.row.specs}}</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column
          label="Số lượng"
          inline
          width="200"
        >
          <template scope='scope'>
            <el-button size="small" icon="minus" :disabled='scope.row.disMinus' @click='minus(scope.row)'></el-button> 
            <el-input style='display: inline-block; width: 90px' size='small' v-model="scope.row.count" @change='numChange(scope.row.count, scope.row)'></el-input> 
            <el-button size="small" icon="plus" :disabled='scope.row.disPlus' @click='plus(scope.row)'></el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="Đơn giá"
        >
        </el-table-column>
        <el-table-column
          prop="total"
          label="Tổng cộng"
          :formatter='formatTotal'
        >
        </el-table-column>

        <!-- <el-table-column
          prop="specs"
          label="备注"
        >
          <template scope='scope'>
            <el-tag type='primary' class='tag-class'>{{scope.row.specs}}</el-tag>
          </template>
        </el-table-column> -->

        </el-table-column>
        <el-table-column label="Hoạt động" width='120'>
          <template scope="scope">
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">Xóa sản phẩm</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="frieght">Phí giao hàng là <span class="addcost">{{addCost}}</span> VND cho dù bạn mua bao nhiêu hàng thì phí không đổi</div>
      <div v-show='tableData.length'>
        <el-button class='all-del' type="danger" @click="toggleSelection()">Xóa giỏ hàng</el-button>     
        <el-button type="success" size="large" @click='goCheckout'>Đi kiểm tra</el-button>
      </div>
    </div>    
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Items from './Items';
  import Summery from './Summery';
  import cart from '@/api/cart'
  import store from 'store'
  import { set, get, remove } from '@/api/common'
  export default {
    name: 'cart',
    components: {
      Items,
      Summery,
    },
    computed: {
      ...mapGetters({
        products: 'cartProducts',
      }),
      addCost() {
      	return store.get('app').extra.freight;
      },
      total() {
        return this.products.reduce((total, p) => total + (p.price * p.quantity), 0);
      },
    },
    data() {
      return {
        tableData: [],
        selection: [],
        disMinus: false,
        disPlus: false
      }
    },
    created() {
      this.tableData = cart.getCart();
    },
    mounted() {
      // this.selection = JSON.parse(JSON.stringify(this.tableData));
      this.tableData.forEach(item => {
        this.$refs.cartTable.toggleRowSelection(item);
      })
      // console.log(cart.getCart());
    },
    methods: {
      formatTotal(scope) {
        // console.log(scope);
        scope.total = scope.count * scope.price;
        return scope.total.toFixed(2)
      },
      handleChange(val) {
        // console.log(val);
        this.selection = val;
      },
      getPrice(val, row) {
        let length = row.prices.length;
        let num = Number(val);
        for(let i=0; i<length; i++) {
            // console.log(row.prices[i]);
            if(row.prices[i].count != -1&&num<Number(row.prices[i].count)) {
              row.price = Number(row.prices[i].price);
              return;
            } else if(row.prices[i].count == -1&&num>=Number(row.prices[i-1].count)) {
              // console.log(val, row.prices[i-1].count, num>=Number(row.prices[i-1].count));
              row.price = Number(row.prices[i].price);
              return;
            }
            // else if(val>=row.prices[i-1].count&&row.prices[i].count == -1) {
            //   // row.price = row.prices[i].price;
            //   return;
            // }
        }
      },
      // 删除商品
      handleDelete(index, row) {
        cart.removeCart(row);
      },
      // 商品数目改变 0 清空购物车
      numChange(val, row) {
        // console.log(val, row);
        this.getPrice(val, row);
        cart.changeCount(row);
        cart.getCart()
      },
      minus(row) {
        if(row.count <= 1) {
          // cart.removeCart(row);
          row.disMinus = true;
          row.count = 1;
          return;
        }
        row.disMinus = false;
        row.disPlus = false;
        row.count -= 1;
        this.getPrice(row.count, row);
        cart.changeCount(row);
        cart.getCart()
      },
      plus(row) {
        if(row.count >= row.stock-1) {
          row.count = row.stock;
          row.disPlus = true;
          return;
        }
        row.disMinus = false;
        row.disPlus = false;
        row.count = Number(row.count) + 1;
        this.getPrice(row.count, row);
        cart.changeCount(row);
        cart.getCart();
      },
      // 清空购物车
      toggleSelection() {
        cart.removeCart();
        this.$router.push('/');
      },
      goCheckout() {
        cart.order(this.selection);
        // this.$router.push('/checkout')
        // console.log(this.selection);
      }
    }
  };
</script>
<style scoped>
.cart {
  overflow: hidden;
  margin-top: 20px;
}
.cart #type {
  box-sizing: border-box;
  padding: 40px 20px;
}
.all-del {
  margin:  10px 0;
}
.addcost{
	color: red;
	font-size: 19px;;
}
.frieght{
	font-size: 17px;
	line-height: 30px;
	text-align: right;
	margin-right: 30px;
}
.tag-class {
  margin-top: 7px;
   width: 100%;
   overflow: hidden;
   white-space: nowrap;
   text-overflow: ellipsis
}
</style>
