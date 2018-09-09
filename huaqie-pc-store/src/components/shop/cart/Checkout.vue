<template>
  <div class="checkout">
    <div v-if='getOrder'>
      <el-table
        :data="tableData"
        stripe
        border
        style="width: 100%">
        <el-table-column
          type="index"
          width="50">
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
          prop="count"
          label="Số lượng"
        >
        </el-table-column>
        <el-table-column
          prop="price"
          label="Đơn giá">
          <template scope='scope'>
            {{scope.row.price}}
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
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
      </el-table>
      <div class='total'>
      	
        <span>Tổng</span>
        <span style='color: #f00'>{{total.toFixed(2)}}</span>
      </div>
      <div class='address'>
        <el-form :model="orderForm" :rules="rules" ref='orderForm'>
          <el-form-item prop='name'>
            <div class='item-wrap'>
              <div>Tên：</div>
              <el-input placeholder='Vui lòng nhập tên người nhận hàng' v-model="orderForm.name" auto-complete="off"></el-input>
            </div>
          </el-form-item>
          <el-form-item prop='phone'>
            <div class='item-wrap'>
              <div>Điện thoại：</div>
              <el-input placeholder='Vui lòng nhập điện thoại nhận hàng' v-model="orderForm.phone" auto-complete="off"></el-input>
            </div>
          </el-form-item>
          <el-form-item prop='address'>
            <div class='item-wrap'>
              <div>Địa chỉ người nhận nhận hàng：</div>
              <el-input placeholder='Xin nhập địa chỉ của người nhận' v-model="orderForm.address" auto-complete="off"></el-input>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <el-button type='danger' @click='clearOrder'>LỆNH CLEAR</el-button>
      <el-button @click='submitOrder'>NỘP ĐƠN ĐẶT HÀNG</el-button>
      <!-- <el-button type='primary' @click='dialogVisible = true' :disabled='canCheck'>PAY? CLICK!</el-button> -->
    </div>
    <h1 style='padding: 30px; font-size: 24px;' v-else>
      <p>BẠN KHÔNG CÓ THỂ LỆNH!</p>
      <el-button type="primary" @click="$router.push('/')">Quay lại trang chủ</el-button>
    </h1>
  </div>
</template>

<script>
  import { set, get, remove } from '@/api/common'
  import { createOffline, offlinePay, getApp } from '@/api/api'
  import cart from '@/api/cart'
  import store from 'store'
  export default {
    data() {
      return {
        tableData:[],
        canCheck: true,
        dialogVisible: false,
        submitVisible: false,
        bank: {},
        subForm: {
          orderId: '',
          transactionId: '',
          transactionName: '',
          transactionAmount: ''
        },
        orderForm: {
          name: '',
          phone: '',
          address:''
        },
        rules: {
          name: [
            { required: true, message: 'Vui lòng nhập tên người nhận hàng', trigger: 'blur' },
          ],
          phone: [
            { required: true, message: 'Vui lòng nhập điện thoại nhận hàng', trigger: 'blur' },
          ],
          address: [
            { required: true, message: 'Xin nhập địa chỉ của người nhận', trigger: 'blur' },
          ]
        }
      }
    },
    created() {
      if(get('orderId')) {
        this.canCheck = false;
      } else {
        this.canCheck = true;
      }
      this.tableData = get('orderCart')||[];
      // getApp({}).then(res => {
      //   this.bank = res.data.extra.bank
      // })
    },
    computed: {
      total() {
      	let app = store.get('app');
      	
        let sum = 0;
        this.tableData.forEach(item => {
          sum += item.count*item.price
        })
        sum += app.extra.freight
        return sum;
      },
      getOrder() {
        if(get('orderCart')) {
          return true;
        } else {
          return false;
        }
      }
    },
    methods: {
      formatTotal(row, col) {
        return (row.count*row.price).toFixed(2)
      },
      clearOrder() {
        remove('orderCart');
        this.$router.push('/cart');
      },
      submitOrder() {
        this.$refs['orderForm'].validate(valid => {
          if(valid) {
            let para = {
              products: [],
              address: this.orderForm.address
            };
            this.tableData.forEach(item => {
              para.products.push({
                productId: item.productId,
                specs: item.specs,
                count: item.count
              })
            })
            // cart.cartClear();
            // console.log(para);
            createOffline(para).then(res => {
              if(res.code === 0) {
                // console.log(res);
                this.$message.success({
                  message: 'Lệnh đã thành công！'
                })
                cart.cartClear();
                this.$router.push('/orders')
                // this.submitVisible = false;
                // this.canCheck = false;
              } else {
                this.$message.error({
                  message: res.message
                })
              }
            })
          } else {
            this.$message.error({
              message: 'Thông tin biên nhận không thể để trống！'
            })
            return;
          }
        }) 
      },
      offlineSub() {
        let para = Object.assign({}, this.subForm);
        para.orderId = get('orderId');
        offlinePay(para).then(res => {
          if(res.code === 0) {
            this.$message.success({
              message: 'Chuyển thông tin đã nhận được, chờ đợi Bixy xác nhận'
            })
            remove('orderId');
            remove('orderCart');
            this.$router.push('/');
            this.dialogVisible = false
          } else {
            this.$message.error({
              message: res.message
            })
          }
        }) 
      },
      initSub() {
        this.$refs.orderForm.resetFields();
      },
      initDialog() {
        this.$refs.subForm.resetFields();
      }
    },
  };
</script>
<style scoped>
.checkout {
  min-height: 200px;
  background: #fff;
  margin-top: 20px;
  box-sizing: border-box;
  padding: 30px 20px;
}
.total {
  font-size: 24px;
  text-align: left;
  padding-top: 20px;
}
.total span {
  padding: 0 10px;
}
.my-box {
  font-size:  16px;
  padding: 5px 0;
  text-align: left;
}
.my-box span {
  font-weight:  bold;
}
.address {
  width: 50%;
  margin-top: 20px;
}

.item-wrap > div {
  text-align: left;
  font-size: 18px;
}
.tag-class {
  margin-top: 7px;
   width: 100%;
   overflow: hidden;
   white-space: nowrap;
   text-overflow: ellipsis
}
</style>
