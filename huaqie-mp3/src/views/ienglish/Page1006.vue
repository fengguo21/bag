<template>
	<section>
	 <el-tabs v-model="activeName">
    <el-tab-pane label="阅读管理" name="p1">
    	<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.title" clearable placeholder="课程"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.title" clearable placeholder="昵称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="query">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="orders" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
		
			<el-table-column type="index" width="60">
			</el-table-column>
		
			<el-table-column label="用户头像" width="100">
				<template scope="scope">
					<img :src="scope.row.people.avatar" style="width:40px;height:40px;vertical-align:middle;margin:5px 0;" />
				</template>
			</el-table-column>
			<el-table-column prop="people.name" label="用户昵称" width="200" >
			</el-table-column>
			<el-table-column prop="basic.phone" label="用户手机号" width="150" >
			</el-table-column>
			<el-table-column prop="product.title" label="课程" width="250" >
			</el-table-column>
			<el-table-column prop="basic.states" label="已读课时" width="100" :formatter="formatReadingCount" >
			</el-table-column>
			<el-table-column prop="basic.states" label="已读时长" width="100" :formatter="formatReadingTime" >
			</el-table-column>
			<el-table-column label="推荐" width="100" >
				<template scope="scope">
					<el-tag v-if="scope.row.basic.recommend == 1" type="primary">是</el-tag>
					<el-tag v-else>否</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="created" label="购买时间" :formatter="formatDate"  >
			</el-table-column>
			<el-table-column label="操作" width="200">
				<template scope="scope">
				<el-button size="small" @click="handleShow(scope.$index, scope.row)">查看</el-button>
					<el-button size="small" type="primary"  v-if="scope.row.basic.recommend != 1" @click="handleRecommend(scope.row)">推荐</el-button>
					<el-button size="small" type="warning"  v-if="scope.row.basic.recommend == 1" @click="handleCancelRecommendSubmit(scope.row)">取消推荐</el-button>
					<!--<el-button type="danger" v-if="scope.row.step==1" size="small" @click="handleDel(scope.$index, scope.row)">取消</el-button>-->
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
    </el-tab-pane>
    <el-tab-pane label="录音管理" name="p2">
    	<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.orderId" clearable placeholder="课程号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.step" :clearable="true" placeholder="请选择课程类型">
					    <el-option
					      v-for="item in options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="query">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="comments" highlight-current-row v-loading="listLoading" style="width: 100%;">
		
			<el-table-column type="index" width="60">
			</el-table-column>
		
			<el-table-column label="用户头像" width="100">
				<template scope="scope">
					<img :src="scope.row.people.avatar" style="width:40px;height:40px;vertical-align:middle;margin:5px 0;" />
				</template>
			</el-table-column>
			<el-table-column prop="people.name" label="用户昵称" width="200" >
			</el-table-column>
			<el-table-column prop="product.title" label="课程" width="250" >
			</el-table-column>
			<el-table-column prop="product.title" label="课时" width="250" >
			</el-table-column>
			<el-table-column prop="created" label="提交时间" :formatter="formatDate"  >
			</el-table-column>
			<el-table-column label="操作" width="200">
				<template scope="scope">
				<el-button size="small" @click="handleShow(scope.$index, scope.row)">查看</el-button>
					
					<el-button type="danger" v-if="scope.row.step==1" size="small" @click="handleDel(scope.$index, scope.row)">取消</el-button>
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
		

		<!--编辑界面-->
		<el-dialog title="课程发货" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="课程号">
					{{editForm.orderId}}
				</el-form-item>
				<el-form-item label="课程标题">
					{{editForm.basic.title}}
				</el-form-item>
				<el-form-item label="付款金额">
					¥{{editForm.amount}}
				</el-form-item>
				<el-form-item label="退款金额" v-if="editForm.extra.refund">
					<span style="color:red">¥{{editForm.extra.refund || 0}}</span>
				</el-form-item>
				<el-form-item label="商品清单">
					<el-row v-for="p in editForm.basic.products" :key='p.basic.title'>
						<el-col :span="4">
						{{p.basic.title}}
						</el-col>
						<el-col :span="12">
						x{{p.count}}
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="收货人">
					<el-row>
					<el-col :span="4">
					姓名
					</el-col>
					<el-col :span="12">
					{{editForm.basic && editForm.basic.address && editForm.basic.address.name}}
					</el-col>
					</el-row>
					<el-row>
					<el-col :span="4">
					手机号
					</el-col>
					<el-col :span="12">
					{{editForm.basic && editForm.basic.address && editForm.basic.address.phone}}
					</el-col>
					</el-row>
					<el-row>
					<el-col :span="4">
					地址
					</el-col>
					<el-col :span="12">
					{{editForm.basic && editForm.basic.address && editForm.basic.address.zone.join(',')+editForm.basic.address.detail}}
					</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="快递公司" v-if="!editForm.shipment.self" prop="shipment.company">
				  <shipment :company="editForm.shipment.company" @on-company-change="onCompanyChange"></shipment>
				</el-form-item>

				<el-form-item label="快递单号" v-if="!editForm.shipment.self" prop="shipment.code">
					<el-input v-model="editForm.shipment.code"  auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="自有配送" prop="shipment.self">
				  <el-switch
					  v-model="editForm.shipment.self"
					  on-text=""
					  off-text="">
					</el-switch>
				</el-form-item>
				

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="addForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--推荐界面-->
		<el-dialog title="推荐" v-model="recommendFormVisible" :close-on-click-modal="false">
			<el-form :model="recommendForm" label-width="80px" :rules="recommendFormRules" ref="addForm">
				
				<el-form-item label="推荐组别">
					<el-radio-group v-model="recommendForm.recommendGroupIndex">
						<el-radio class="radio" :label="0">0-6岁组</el-radio>
						<el-radio class="radio" :label="1">6-12岁组</el-radio>
						<el-radio class="radio" :label="2">12-18岁组</el-radio>
						<el-radio class="radio" :label="3">成人组</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="推荐课时" prop="index">
					<el-input-number v-model="recommendForm.recommendIndex" auto-complete="off" :min="1" :max="100"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="recommendFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="recommendSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--显示详情-->
		<el-dialog title="课程详情" v-model="showFormVisible" :close-on-click-modal="false">
			<el-row>
			<el-col :span="6">
				阅读ID:
			</el-col>
			<el-col :span="18">
				{{ showForm.feedId }}
			</el-col>
			</el-row>
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				课程标题:
			</el-col>
			<el-col :span="18">
				{{ showForm.product && showForm.product.title }}
			</el-col>
			</el-row>
			
			
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				开始时间:
			</el-col>
			<el-col :span="18">
				{{ formatTime(showForm.created) }}
			</el-col>
			</el-row>
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				已读课时:
			</el-col>
			<el-col :span="18">
				{{ showForm.basic && showForm.basic.states && showForm.basic.states.reduce((pre, cur, index, array)=>{
					return (array[index].step == 3)?pre+1:pre
				}, 0) }}
			</el-col>
			</el-row>
			<el-row style="margin-top:5px;">
			<el-col :span="6">
				已读时长:
			</el-col>
			<el-col :span="18">
				{{ showForm.basic && showForm.basic.states && showForm.basic.states.reduce((pre, cur, index, array)=>{
					return pre + array[index].time
				}, 0) }}
			</el-col>
			</el-row>

			<el-row style="margin-top:5px;">
			<el-col :span="6">
				录音列表:
			</el-col>
			<el-col :span="18">
				<p class="audio" v-for="(audio, index) in showForm.basic && showForm.basic.audios" @click="play(index)"><img :src="voice" v-if="!audio.on"/><img :src="voiceOn" v-else />{{audio && audio.duration}}s</p>
			</el-col>
			</el-row>

			<el-row style="margin-top:5px;">
			<el-col :span="6">
				学员:
			</el-col>
			<el-col :span="18">
				<p><img v-if="showForm.people && showForm.people.avatar" :src="showForm.people && showForm.people.avatar" class="avatar" /></p>
				<p>ID：{{ showForm.basic && showForm.basic.peopleId }}</p>
				<p>昵称：{{ showForm.people && showForm.people.name }}</p>

			</el-col>
			</el-row>
			
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="showFormVisible = false">关闭</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getReadingList, getCourse, iEnglishUpdateCourse, iEnglishGetCommentList } from '../../api/api';
	import moment from 'moment'
	import Shipment from '@/components/system/shipment'

	export default {
		components: {
			Shipment
		},
		data() {
			return {
				activeName: 'p1',
				filters: {
					orderId: '',
					step: ''
				},
				voice: '',
				voiceOn: '',
				options: [{
					label: '待付款',
					value: 1
				}, {
					label: '待发货',
					value: 2
				}, {
					label: '待收货',
					value: 3
				}, {
					label: '已完成',
					value: 4
				}, {
					label: '已取消',
					value: 6
				}],
				orders: [],
				total: 0,
				page: 1,
				comments: [],
				total2: 0,
				page2: 1,
				listLoading: false,
				sels: [],//列表选中列

				showFormVisible: false,
				showForm: {},

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					'shipment.company': [
						{ required: true, message: '请选择快递公司', trigger: 'blur' }
					],
					'shipment.code': [
						{ required: true, message: '请输入快递单号', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					basic: {},
					extra: {},
					shipment: {
						company: '',
						code: '',
						self: false
					}
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},

				recommendFormVisible: false,//新增界面是否显示
				recommendLoading: false,
				recommendFormRules: {
					recommendGroupIndex: [
						{ required: true, message: '请选择组别', trigger: 'blur' }
					]
				},
				//新增界面数据
				recommendForm: {
					recommendGroupIndex: 0,
					recommendIndex: 0
				}

			}
		},
		methods: {
			//性别显示转换
			formatDate: function (row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm:ss')
			},
			formatTime( time ) {
				return moment( time ).format('YYYY-MM-DD HH:mm:ss')
			},
			formatChannel(row, column ) {
				const channels = {
					'wepay.widget': '小程序支付'
				}
				return (row.channel in channels)?channels[row.channel]:'未知'
			},
			formatReadingCount(row, column) {
				return row.basic && row.basic.states && row.basic.states.reduce((pre, cur, index, array)=>{
					return (array[index].step == 3)?pre+1:pre
				}, 0) 
			},
			formatReadingTime(row, column) {
				return row.basic && row.basic.states && row.basic.states.reduce((pre, cur, index, array)=>{
					return pre + array[index].time
				}, 0) 
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getOrders();
			},
			handleCurrentChange2(val) {
				this.page2 = val;
				this.getComments();
			},
			onCompanyChange(val) {
				console.log('VAL======', val)
				this.editForm.shipment.company = val
			},
			play(index) {
				this.showForm.basic.audios.forEach( (a, i) => {
						if(typeof(a) != 'object')
							return
						
						if(index == i){
							const audio = new Audio(a.audio)
							audio.play()
							this.showForm.basic.audios[i].on = true
						}
						else
							this.showForm.basic.audios[i].on = false
				})
			},
			//获取用户列表
			getOrders() {
				let para = {
					orderId: this.filters.orderId,
					step: this.filters.step,
					page: this.page,
					size: 10
				};
				this.listLoading = true;
				//NProgress.start();
				getReadingList(para).then((res) => {
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					this.total = res.data.total;
					this.orders = res.data.list;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			getComments() {
				let para = {
					page: this.page2,
					size: 10
				};
				this.listLoading = true;
				iEnglishGetCommentList(para).then((res) => {
					
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					this.total2 = res.data.total;
					this.comments = res.data.list;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认取消课程：'+row.basic.title+' 吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { orderId: row.orderId };
					cancelOrder(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '取消成功',
							type: 'success'
						});
						this.getOrders();
					});
				}).catch(() => {

				});
			},
			//推荐
			handleRecommend: function (row) {
				this.recommendFormVisible = true
				this.recommendForm = {
					feedId: row.feedId,
					recommendGroupIndex: row.basic.recommendGroupIndex || 0,
					recommendIndex: row.basic.recommendIndex && (row.basic.recommendIndex+1) || 1
				}
			},
			recommendSubmit: function() {
				//this.listLoading = true;
				this.recommendFormVisible = false
				//NProgress.start();
				let para = { 
					feedId: this.recommendForm.feedId, 
					recommend: 1,
					recommendGroupIndex: this.recommendForm.recommendGroupIndex,
					recommendIndex: this.recommendForm.recommendIndex - 1
				};
				iEnglishUpdateCourse(para).then((res) => {
					this.listLoading = false;
					//NProgress.done();
					if(res.code){
						this.$message.error(res.message)
						return
					}
					this.$message({
						message: '推荐成功',
						type: 'success'
					});
					this.getOrders();
				});
			},
			handleCancelRecommendSubmit: function(row) {
				//this.listLoading = true;
				this.$confirm(`确认取消推荐：${row.people.name}/${row.product.title} ?`, '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
				//NProgress.start();
				let para = { 
					feedId: row.feedId, 
					recommend: 2
				};
				iEnglishUpdateCourse(para).then((res) => {
					this.listLoading = false;
					//NProgress.done();
					if(res.code){
						this.$message.error(res.message)
						return
					}
					this.$message({
						message: '推荐成功',
						type: 'success'
					});
					this.getOrders();
				});
						 }).catch(() => {
		           
		        });
			},
			// 退款
			handleRefund: function (index, row) {
				const refund = (row.extra.refund)?row.extra.refund:0
				this.$prompt(`课程号：${row.orderId}，付款人：${row.basic.name}，最多可退款：${(row.amount-refund).toFixed(2)}，请输入退款金额：`, '课程退款', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          inputPattern: /^\d+(?:\.\d{1,2})?$/,
		          inputErrorMessage: '退款金额必须为数字且不超过两位小数'
		        }).then(({ value }) => {
		          this.listLoading = true;
					//NProgress.start();
					let para = { orderId: row.orderId, refund: value };
					orderRefund(para).then((res) => {
						this.listLoading = false;
						if(res.code){
							this.$message({
								message: res.message,
								type: 'error'
							})
							return
						}
						//NProgress.done();
						this.$message({
							message: '退款成功',
							type: 'success'
						});
						this.getOrders();
					});
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '取消退款'
		          });       
		        });
			},
			//显示查看界面
			handleShow: function (index, row) {
				this.showFormVisible = true;
				//this.showForm = row
				this.showForm = Object.assign({}, row);
				
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				row.shipment = {
					company: '',
					code: '',
					self: false
				}
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({
								orderId: this.editForm.orderId
							}, this.editForm.shipment);

							if(para.self){
								para.company = '自有配送'
								para.code = '无'
							}

							shipment(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getOrders();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getOrders();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getOrders();
					});
				}).catch(() => {

				});
			},
			query() {
				this.page = 1
				this.getOrders()
			}
		},
		mounted() {
			this.getOrders();
			this.getComments()
			this.voice = require('../../assets/voice.png')
			this.voiceOn = require('../../assets/voice.gif')
		}
	}

</script>

<style scoped>
.avatar{
	width: 96px;
	height: 96px;
}
.audio{
	background: green;
	border-radius: 20px;
	color: white;
	width: 120px;
	padding: 8px 20px;
	cursor: default;
}
.audio img{
	vertical-align: middle;
	margin-right: 30px;
	width: 24px;
	height: 24px;
}
</style>