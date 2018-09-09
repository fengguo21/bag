<template>
	<div class='checkout'>
		<div class="order-wrap" v-for='item in tableData'>
        <div class='order-id'>
          <div>Đơn đặt hàng：{{item.orderId}}</div>
          <div>Tình trạng đặt hàng：<span :class='[{"error": item.step == 1}, {"success": item.step == 2}]'>{{item.step|filterStep}}</span></div>
        </div>
        <el-table
          :data="item.basic.products"
          stripe
          border
          style="width: 100%">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="basic.avatar"
            label="Hình ảnh"
            width='120'
          >
            <template scope='scope'>
              <img :src="scope.row.basic.avatar" width='60' height='60' style='vertical-align: middle' />
            </template>
          </el-table-column>
          <el-table-column
            prop="basic.title"
            label="Tên sản phẩm"
          >
          </el-table-column>
          <el-table-column
            prop="specs"
            label="Tham số"
          >
          </el-table-column>
          <!-- <el-table-column
            prop="specs"
            label="颜色"
          >
          </el-table-column>
          <el-table-column
            prop="specs"
            label="参数"
          >
          </el-table-column> -->
          <el-table-column
            prop="count"
            label="Số lượng"
          >
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
          </el-table-column> -->
        </el-table> 
        <div class='order-bottom'>
          <div class='total'>
            <span>Tổng:</span>
            <span style='color: #f00'>{{item.extra.total.toFixed(2)}}</span>
          </div>
          <div class="btn">
            <el-button type="info" v-if='item.step == 1' @click='pay(item)'>Tiếp tục trả tiền</el-button>
            <el-button type="info" v-if='item.step == 3' @click='checked(item.orderId)'>Xác nhận nhận</el-button>
          </div>
        </div>
    </div>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
      </el-pagination>
    </el-col> 


    <!-- 支付后 -->
    <el-dialog
      title="Chuyển tiền"
      :visible.sync="dialogVisible"
      size="tiny"
      @close='initDialog'
    >
      <span style='font-size: 18px; text-align: left'><i class='el-icon-warning' style='color: #20A0FF'></i>Vui lòng chuyển tiền vào tài khoản sau bằng chuyển khoản qua ngân hàng hoặc internet:</span>
      <div class='my-box'>
        <span>Tên ngân hàng:</span> {{ bank.bank }}
      </div>
      <div class='my-box'>
        <span>Địa chỉ ngân hàng:</span> {{ bank.address }}
      </div>
      <div class='my-box'>
        <span>Số tài khoản:</span> {{ bank.account }}
      </div>
      <div class='my-box'>
        <span>Tên chủ tài khoản:</span> {{ bank.name }}
      </div>
      <el-form :model="subForm" ref='subForm'>
        <el-form-item prop='transactionId'>
          <div style='text-align: left;'>Số biên nhận chuyển khoản ngân hàng</div>
          <el-input v-model="subForm.transactionId" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop='transactionName'>
          <div style='text-align: left;'>Tên</div>
          <el-input v-model="subForm.transactionName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop='transactionAmount'>
          <div style='text-align: left;'>Số tiền chuyển khoản</div>
          <el-input v-model="subForm.transactionAmount" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Hủy bỏ</el-button>
        <el-button type="primary" @click="offlineSub">Xác nhận</el-button>
      </span>
    </el-dialog>
	</div>
</template>
<script>
import { getOrderList, getApp, offlinePay, collectOrder } from '@/api/api'
export default {
	data() {
		return {
			tableData:[],
      dialogVisible: false,
      submitVisible: false,
      bank: {},
      subForm: {
        orderId: '',
        transactionId: '',
        transactionName: '',
        transactionAmount: ''
      },
      total: 0,
      page: 1
		}
	},
  filters: {
    filterStep(val) {
      switch(val) {
        case 1: return 'Thanh toán đang chờ xử lý';break;
        case 2: return 'Để được vận chuyển';break;
        case 3: return 'Để nhận được';break;
        case 4: return 'Đã nhận';break;
        case 5: return 'Hoàn lại tiền';break;
        case 6: return 'Đơn đặt hàng đã hủy';break;
        default: return 'Trạng thái không xác định'
      }
    }
  },
  created() {
    this.getOrderList();
    getApp({}).then(res => {
      // console.log(res.data.extra.bank);
      this.bank = res.data.extra.bank
    })
  },
	methods: {
		formatTotal(row, col) {
      // console.log(row);
      let length = row.basic.prices.length;
      let num = Number(row.count);
      // num>=Number(row.prices[i-1].count)
      for(let i = 0; i < length; i++ ) {
        if(row.basic.prices[i].count != -1 && num < Number(row.basic.prices[i].count)) {
          return (row.count*row.basic.prices[i].price).toFixed(2);
        } else if(row.basic.prices[i].count == -1 && num >= Number(row.basic.prices[i-1].count)) {
          return (row.count*row.basic.prices[i].price).toFixed(2);
        }
      }
		},
    getOrderList() {
      getOrderList({
        page: this.page,
        size: 10,
      }).then(res => {
        if(res.code > 0) {
          this.$message.error({
            message: res.message
          });
          return;
        }
        this.tableData = res.data.list;
        this.total = res.data.total;
        // console.log(res.data.list);
      })
    },
    pay(item) {
      this.subForm.orderId = item.orderId;
      this.dialogVisible = true;
    },
    offlineSub() {
      let para = Object.assign({}, this.subForm);
      offlinePay(para).then(res => {
        if(res.code === 0) {
          this.$message.success({
            message: 'Chuyển thông tin đã nhận được, chờ đợi Bixy xác nhận'
          })
          this.dialogVisible = false
        } else {
          this.$message.error({
            message: res.message
          })
        }
      }) 
    },
    checked(orderId) {
      this.$confirm('Sẽ xác nhận nhận, có nên tiếp tục?', 'Mẹo', {
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning'
      }).then(() => {
        collectOrder({
          orderId: orderId
        }).then(res => {
          if(res.code > 0) {
            this.$message.error({
              message: res.message
            })
            return;
          }
          this.page = 1;
          this.getOrderList();
          this.$message({
            type: 'success',
            message: 'Thành công nhận!'
          });
        })     
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Biên nhận đã hủy'
        });          
      });
    },
    initSub() {
      this.$refs.orderForm.resetFields();
    },
    initDialog() {
      this.$refs.subForm.resetFields();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getOrderList();
    }
	}
}
</script>
<style scoped>
.checkout {
  min-height: 200px;
  background: #fff;
  margin-top: 20px;
  overflow: hidden;
  box-sizing: border-box;
  padding: 30px 20px;
}
.order-id {
  text-align: left;
  font-size: 16px;
  margin: 20px 0 10px;
  display: flex;
  justify-content: space-between
}
.order-bottom {
  margin: 10px 0;
  height: 40px;
  line-height: 40px;
  display: flex;
  justify-content: space-between;
}
.total {
  font-size: 20px;
  text-align: left;
}
.total span {
  padding: 0 10px;
}
.toolbar {
  background: #f2f2f2;
  padding: 10px;
  margin: 10px 0px;
}
.toolbar .el-form-item {
  margin: 10px 0;
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
.item-wrap {
  display: flex;
}
.item-wrap > span {
  display: block;
  width: 200px;
  font-size: 18px;
}

.error {
  color: #b4282d;
}
.success {
  color: #13CE66;
}
</style>