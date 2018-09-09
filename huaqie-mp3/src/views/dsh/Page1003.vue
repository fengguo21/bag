<template>
	<section>
	<el-tabs v-model="activeName" @tab-click="handleClick">
	    	<el-tab-pane label="渠道" name="p1">
	    	<!--工具条-->
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" :model="filters">
						<el-form-item>
							<el-input v-model="filters.title" placeholder="渠道名称"></el-input>
						</el-form-item>
						<el-form-item>
							<el-input v-model="filters.phone" placeholder="联系人手机号"></el-input>
						</el-form-item>
						<el-form-item>
						<el-date-picker
					      v-model="filters.period"
					      type="datetimerange"
					      :picker-options="pickerOptions"
					      placeholder="上次转账时间"
					      align="right">
					    </el-date-picker>
					</el-form-item>
						<el-form-item>
							<el-button type="primary" v-on:click="query">查询</el-button>
						</el-form-item>
						<el-form-item>
							<el-button  @click="handleAdd">新增渠道</el-button>
						</el-form-item>
					</el-form>
				</el-col>

			<!--列表-->
				<el-table :data="agents" highlight-current-row v-loading="listLoading" style="width: 100%;" @selection-change="handleSelectionChange">
				    <el-table-column type="index" width="60"></el-table-column>
				    <el-table-column prop="feedId" label="ID" width="250">
					</el-table-column>
					<el-table-column prop="basic.title" label="名称" width="150">
					</el-table-column>
					<el-table-column prop='basic.phone' label="联系人手机号" width='150'>
					</el-table-column>
					<el-table-column prop="basic.address" label="小程序码" width='150'>
						<template scope="scope">
							<img :src="scope.row.basic.qrcode" />
						</template>
					</el-table-column>
					<el-table-column prop='basic.text' label="备注" width='200'>
					</el-table-column>
					<el-table-column prop='created' label="上次转账时间" width='180' :formatter="formatDate2">
					</el-table-column>
					<el-table-column prop="created" label="创建时间" :formatter="formatDate" min-width="180" >
					</el-table-column>
					
					<el-table-column label="操作" width="320">
						<template scope="scope">
							<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
							<el-button type="primary" size="small" @click="handleReport(scope.$index, scope.row)">转账</el-button>
							<el-button type="warning" size="small" @click="handleQrcode(scope.$index, scope.row)">生成小程序码</el-button>
							<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>

			<!--工具条-->
				<el-col :span="24" class="toolbar">
					<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
					</el-pagination>
				</el-col>
				</el-tab-pane>
				<el-tab-pane label="转账记录" name="p2">
				<!--工具条-->
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" :model="filters">
						<el-form-item>
							<el-input v-model="filters.title" placeholder="渠道名称"></el-input>
						</el-form-item>
						<el-form-item>
							<el-input v-model="filters.phone" placeholder="联系人手机号"></el-input>
						</el-form-item>
						<el-form-item>
						<el-date-picker
					      v-model="filters.period"
					      type="datetimerange"
					      :picker-options="pickerOptions"
					      placeholder="转账时间"
					      align="right">
					    </el-date-picker>
					</el-form-item>
						<el-form-item>
							<el-button type="primary" v-on:click="query2">查询</el-button>
						</el-form-item>
					</el-form>
				</el-col>

			<!--列表-->
				<el-table :data="transfors" highlight-current-row v-loading="listLoading" style="width: 100%;" @selection-change="handleSelectionChange">
				    <el-table-column type="index" width="60"></el-table-column>
					<el-table-column prop="feedId" label="渠道ID" width="260" >
					</el-table-column>
					<el-table-column prop="agent.title" label="渠道名称" width="200">
					</el-table-column>
					<el-table-column prop='agent.phone' label="渠道联系人手机号" width='150'>
					</el-table-column>
					<el-table-column prop='basic.amount' label="转账金额" width='150'>
					</el-table-column>
					<el-table-column prop="people.name" label="操作人" width='150'>
					</el-table-column>
					<el-table-column prop='basic.text' label="备注" width='150'>
					</el-table-column>
					<el-table-column prop="created" label="转账时间" :formatter="formatDate" min-width="180" >
					</el-table-column>
					
					<el-table-column label="操作" width="200">
						<template scope="scope">
							
						</template>
					</el-table-column>
				</el-table>

			<!--工具条-->
				<el-col :span="24" class="toolbar">
					<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange2" :page-size="10" :total="total2" style="float:right;">
					</el-pagination>
				</el-col>
				</el-tab-pane>
				</el-tabs>
		

		<!--新增渠道弹窗-->
		<el-dialog title="新增渠道" v-model="addFormVisible" :close-on-click-modal="false" @close='closeAdd'>
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="名称">
					<el-input v-model="addForm.title" class='small-el-input' auto-complete="off" placeholder='请输入渠道名称'></el-input>
				</el-form-item>
				
				<el-form-item label="联系人手机号" prop='phone'>
					<el-input type="text" v-model="addForm.phone" class='small-el-input' placeholder='请输入联系人手机号'></el-input>
				</el-form-item>

				<el-form-item label="备注" prop='text'>
					<el-input type="textarea" v-model="addForm.text" class='small-el-input' placeholder='请输入备注'></el-input>
				</el-form-item>
				
			</el-form>
			
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="cancelAdd">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--编辑渠道弹窗-->
		<el-dialog title="编辑渠道" v-model="editFormVisible" :close-on-click-modal="false" @close='closeAdd'>
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="名称">
					<el-input v-model="editForm.title" class='small-el-input' auto-complete="off" placeholder='请输入渠道名称'></el-input>
				</el-form-item>
				
				<el-form-item label="联系人手机号" prop='phone'>
					<el-input type="text" v-model="editForm.phone" class='small-el-input' placeholder='请输入联系人手机号'></el-input>
				</el-form-item>

				<el-form-item label="备注" prop='text'>
					<el-input type="textarea" v-model="editForm.text" class='small-el-input' placeholder='请输入备注'></el-input>
				</el-form-item>
			</el-form>
			
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="cancelEdit">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--显示详情-->
		<el-dialog title="转账" v-model="showFormVisible" :close-on-click-modal="false">

		<el-row class="detail">
			<el-col :span="6">
				渠道名称:
			</el-col>
			<el-col :span="18">
				{{ showForm.agentTitle }}
			</el-col>
			</el-row>

			<el-row class="detail">
			<el-col :span="6">
				上次转账时间:
			</el-col>
			<el-col :span="18">
				{{ moment(showForm.transforTime).format('YYYY-MM-DD HH:mm:ss') }}
			</el-col>
			</el-row>

			<el-row class="detail">
			<el-col :span="6">
				选择月份:
			</el-col>
			<el-col :span="18">
				<el-date-picker
			      v-model="reportDate"
			      type="daterange"
			      :picker-options="pickerOptions"
			      placeholder="选择时间范围"
			      align="right">
			    </el-date-picker>
			</el-col>
			</el-row>

			<el-row class="detail">
			<el-col :span="6">
				月交易金额:
			</el-col>
			<el-col :span="18">
				{{ showForm.amount }}
			</el-col>
			</el-row>

			<el-row class="detail">
			<el-col :span="6">
				月交易笔数:
			</el-col>
			<el-col :span="18">
				{{ showForm.volume }}
			</el-col>
			</el-row>

			<el-row class="detail">
			<el-col :span="6">
				转账金额:
			</el-col>
			<el-col :span="18">
				 <el-input-number v-model="showForm.money" :min="0.01" :max="100000"></el-input-number>
			</el-col>
			</el-row>
			<el-row class="detail">
			<el-col :span="6">
				转账备注:
			</el-col>
			<el-col :span="18">
				 <el-input v-model="showForm.text"></el-input>
			</el-col>
			</el-row>
			
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="showFormVisible = false">关闭</el-button>
				<el-button type="primary" @click.native="transforSubmit" :loading="addLoading">确认转账</el-button>
			</div>
		</el-dialog>
		
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { dshCreateAgent, dshUpdateAgent, dshRemoveAgent, dshFindAgentByState, dshFindAgentById, dshFindAgentTransforByState } from '../../api/api';
	import moment from 'moment'


	export default {
		filters: {
			filterAgentName(data) {
				if(data) {
					return data.basic.name
				} else {
					return '未设置'
				}
			},
			filterAgentPhone(data) {
				if(data) {
					return data.basic.phone
				} else {
					return '未设置'
				}
			}
		},
		data() {
			return {
				activeName: 'p1',
				agentLevel: '',
				multipleSelection: [],
				options: [],
				reportDate: '',
				pickerOptions: {
		          shortcuts: [{
		            text: '最近一周',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
		              picker.$emit('pick', [start, end]);
		            }
		          }, {
		            text: '最近一个月',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
		              picker.$emit('pick', [start, end]);
		            }
		          }, {
		            text: '最近三个月',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
		              picker.$emit('pick', [start, end]);
		            }
		          }]
		        },
				agent: '',
				filters: {
					period: '',
					title: '',
					phone: ''
				},
				multiple: false,
				agents: [],
				total: 0,
				page: 1,
				transfors: [],
				total2: 0,
				page2: 1,
				listLoading: true,	
				editOrAdd: '',		
				device: {},	
				showFormVisible: false,
				showForm: {
					feedId: '',
					amount: 0,
					volume: 0,
					money: 0,
					text: '',
					transforTime: ''
				},
				// 增加新渠道
				addForm: {
					title: '',
					phone: '',
					text: ''
				},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					title: [
						{ required: true, message: '请输入渠道名称', trigger: 'blur' }
					]
				},
				addPriceVisible: false,	
				addPriceFrom: {
					chargeTime: '',
					cost: '',
					payFee: ''
				},
				addPriceRules: {
					chargeTime: [
						{ required: true, message: '请输入充电时长', trigger: 'blur' }
					],
					cost: [
						{ required: true, message: '请输入成本价格', trigger: 'blur' }
					],
					payFee: [
						{ required: true, message: '请输入服务价格', trigger: 'blur' }
					]
				},
				// 编辑新渠道
				editForm: {
					feedId: '',
					title: '',
					phone: '',
					text: ''
				},
				editFormVisible: false,//新增界面是否显示
				editFormRules: {
					title: [
						{ required: true, message: '请输入渠道名称', trigger: 'blur' }
					]
				},
				controlFormVisible: false,
				controlForm: {
					productId: '',
					phone: ''
				},
				moment: moment		
			}
		},
		computed: {
			level() {
				return this.store.get('user').role.level
			}
		},
		methods: {
			formatDate: function (row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm:ss')
			},
			formatDate2: function (row, column) {
				return (row.basic.transforTime)?moment(row.basic.transforTime).format('YYYY-MM-DD HH:mm:ss'):''
			},
		      // 图片上传成功钩子
			handleUploadSuccess(res, file) {
				if(res.code){
					this.$message.error({
						message: res.message
					})
					return
				}
				console.log(res.data.url)
				this.addBatchPath = res.data.url
			},
			//获取代理商列表
			getAgentList() {
				let para = {
					title: this.filters.title,
					phone: this.filters.phone,
					page: this.page,
					size: 10
				};
				if(this.filters.period && this.filters.period.length == 2){
					para.startTime = (this.filters.period[0])?this.filters.period[0].valueOf():''
					para.endTime = (this.filters.period[1])?this.filters.period[1].valueOf():''
				}
				dshFindAgentByState(para).then((res) => {
					this.listLoading = false
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					this.agents = res.data.list;
					this.total = res.data.total
				});
			},
			//获取代理商转账列表
			getTransforList() {
				let para = {
					title: this.filters.title,
					phone: this.filters.phone,
					page: this.page2,
					size: 10
				};
				if(this.filters.period && this.filters.period.length == 2){
					para.startTime = (this.filters.period[0])?this.filters.period[0].valueOf():''
					para.endTime = (this.filters.period[1])?this.filters.period[1].valueOf():''
				}
				dshFindAgentTransforByState(para).then((res) => {
					this.listLoading = false
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					this.transfors = res.data.list;
					this.total2 = res.data.total
				});
			},
			
			// 分页
			handleCurrentChange(val) {
				this.page = val;
				this.getAgentList();
			},
			// 分页
			handleCurrentChange2(val) {
				this.page2 = val;
				this.getTransforList();
			},

			handleReport(index, row) {
				this.showFormVisible = true
				this.showForm = Object.assign({}, {
					feedId: row.feedId,
					agentTitle: row.basic.title,
					volume: 0,
					amount: 0,
					money: 0,
					text: '',
					transforTime: row.basic.transforTime
				})
			},
			
			// 增加渠道
			handleAdd() {
				this.editOrAdd = 'add';
				this.addFormVisible = true;
			},
			// 批量增加渠道
			handleAddBatch() {
				this.addBatchFormVisible = true;
			},
			// 取消增加
			cancelAdd() {
				this.addFormVisible = false;
			},
			// 确认增加
			addSubmit() {
				let cast = this.addForm;
				let para = Object.assign({}, this.addForm)
				// console.log(para)
				this.addLoading = true;
				dshCreateAgent(para).then(res => {
					// console.log(res);
					if(res.code === 0) {
						this.$message({
							type: 'success',
							message: '添加成功'
						})
						this.getAgentList();
						this.addFormVisible = false;
					} else {
						this.$message({
							type: 'error',
							message: res.message
						})
					}
				})
			},
			closeAdd() {
				this.addForm = {
					title: '',
					devCode: '',
					position: '',
					address: '',
					desc: '',
					price: []
				}
			},
			handleClick() {
				if(this.activeName == 'p2'){
					this.getTransforList()
				}
			},
			// 编辑渠道
			handleEdit(index, row) {
				// console.log(index, row);
				this.editOrAdd = 'edit';
				this.editFormVisible = true;
				this.editForm = Object.assign({
					feedId: row.feedId
				}, row.basic)
			},
			// 取消编辑
			cancelEdit() {
				this.editFormVisible = false;
			},
			// 确认修改
			editSubmit() {
				let para = Object.assign({}, this.editForm)
				this.addLoading = true;
				dshUpdateAgent(para).then(res => {
					// console.log(res);
					if(res.code === 0) {
						this.$message({
							type: 'success',
							message: '修改成功'
						})
						this.getAgentList();
						this.cancelEdit();
						this.addLoading = false;
					} else {
						this.$message({
							type: 'error',
							message: res.message
						})
					}
				})
			},
			// 删除渠道
			handleDel(index, row) {
				this.$confirm(`确定要删除渠道：${row.basic.title} 吗?`, '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          this.delAgent(row);
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });          
		        });
			},
			delAgent(row) {
				// console.log(row);
				dshRemoveAgent({
					feedId: row.feedId
				}).then(res => {
					// console.log(res);
					if(res.code === 0) {
						this.$message({
						  type: 'success',
						  message: '删除成功!'
						});
						this.getAgentList();
					} else {
						this.$message({
						  type: 'error',
						  message: res.message
						});
					}
					// console.log(res);
				})
				// console.log(index, row);
			},
			// 生成小程序码
			handleQrcode(index, row) {
				this.$confirm(`确定要生成渠道：${row.basic.title} 的小程序码吗?`, '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          
		        })
			},
			uploadSubmit() {
				this.addBatchFormVisible = false
				createNewDevBatch({
					path: this.addBatchPath
				}).then( res => {
					if(res.code){
						this.$message({
						  type: 'error',
						  message: res.message
						});
						return
					}
					this.$message({
						  type: 'success',
						  message: '新增渠道数量：'+res.data.length
						});
					this.getAgentList()
				})
			},
			transforSubmit() {
				dshUpdateAgent({
					feedId: this.showForm.feedId,
					amount: this.showForm.money,
					amountText: this.showForm.text
				}).then( res => {
					if(res.code){
						this.$message({
						  type: 'error',
						  message: res.message
						});
						return
					}
					this.$message({
						  type: 'success',
						  message: '转账成功'
						});
					this.showFormVisible = false
					this.getAgentList()
				})
			},
			// 批量移库
			handleSelectionChange(val) {
		        this.multipleSelection = val;
		    },
		    delSelect() {
		    	this.controlFormVisible = true;
		    	// console.log(this.multipleSelection);
		    },
		    query() {
		    	this.page = 1
		    	this.getAgentList()
		    },
		    query2() {
		    	this.page2 = 1
		    	this.getTransforList()
		    }
		},
		mounted() {
			this.getAgentList()
			this.getTransforList()
		}
	}

</script>

<style scoped lang='scss'>
.detail{
	margin-bottom: 10px;
}
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .avatar-2 {
  	width: 200px;
    height: 100px;
    display: block;
  }
  .el-vue-amap-container{
  	height: 500px;
  }
  .server-wrap, .port-wrap {
  	float: left;
  }
  .port-wrap {
  	margin-left: 40px;
  }
  .price-list__wrap {
  	width: 100%;
  	.price-table {
  		width: auto;
  		overflow:hidden;
  		&:first-child {
  			span {
  				border-top: 1px solid #999;	
  			}
  		}
  		.success {
  			color: #13CE66
  		}
  		.error {
  			color: #FF4949
  		}
  		span {
  			float: left;
  			box-sizing: border-box;
  			min-width: 150px;
  			padding: 5px 10px;
  			height: 30px;	
  			line-height: 19px;	
  			border: 1px solid #999;
  			border-top: 0;
  			&:first-child {
  				border-right: 0
  			}
  		}
  	}
  }
</style>