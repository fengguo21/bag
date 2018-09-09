<template>
	<section>
	
    	<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
			<el-form-item>
					<el-input v-model="filters.customId" placeholder="会员号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.huoyunNo" placeholder="货运单号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.destinate" placeholder="目的地"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="query">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button  @click="handleAdd">新增货运单</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="products" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			
			<el-table-column type="index" width="60">
			</el-table-column>

			<el-table-column type="expand">
		      <template scope="props">
		        <el-card class="box-card box-card-expand" v-for="box in props.row.basic.boxes">
				  <div slot="header" class="clearfix">
				    <span style="line-height: 36px;">箱号：{{ box.boxNo }}</span>
				  </div>
				  <div v-for="o in box.list" :key="o.kuaidiNo" class="text item">
				    {{'快递单号：' + o.kuaidiNo }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{'快递公司：' + o.company }}
				  </div>
				</el-card>
		          
		      </template>
		    </el-table-column>
			
			<el-table-column prop="basic.customId" label="会员号" width="150" >
			</el-table-column>
			<el-table-column prop="basic.huoyunNo" label="货运单号" width="150" >
			</el-table-column>
			<el-table-column prop="basic.date" label="货运单日期" width="150" >
			</el-table-column>
			<el-table-column prop="basic.destinate" label="目的地" width="auto" >
			</el-table-column>
			<!--
			<el-table-column prop="basic.amount" label="件数" width="100" >
			</el-table-column>
			<el-table-column prop="basic.weight" label="重量" width="100" >
			</el-table-column>
			<el-table-column prop="basic.fee" label="本运费" width="100" >
			</el-table-column>
			<el-table-column prop="basic.opayment" label="代付" width="100" >
			</el-table-column>
			<el-table-column prop="basic.exchange" label="汇率" width="100" >
			</el-table-column>
			<el-table-column prop="basic.totalFee" label="合计费用" width="150" >
			</el-table-column>
			<el-table-column prop="basic.note" label="备注" width="150" >
			</el-table-column>
			-->
			
			<el-table-column prop="created" label="创建时间" :formatter="formatDate" width="180" >
			</el-table-column>
			
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
					
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
		
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
    
		

		

		<!--新增界面-->
		<el-dialog title="新增货运单" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
			<el-form-item label="会员号" prop="customId">
					<el-input v-model="addForm.customId" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="货运单号" prop="huoyunNo">
					<el-input v-model="addForm.huoyunNo" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="货运单日期" prop="date">
				<el-date-picker
				      v-model="addForm.receiveDate"
				      type="date"
				      placeholder="选择日期">
				    </el-date-picker>
					
				</el-form-item>

				<el-form-item label="目的地">
					<el-input v-model="addForm.destinate" :min="0" :max="100000"></el-input>
				</el-form-item>

				<el-form-item label="集装箱">
				<el-card class="box-card" v-for="(box, index) in addForm.boxes">
				  <div slot="header" class="clearfix">
				    <span style="line-height: 36px;">箱号：<el-input style="width:200px" v-model="box.boxNo" auto-complete="off" size="small"></el-input></span>
				    <el-button style="float: right;" type="danger" icon="delete" size="small" @click="removeBox(index)"></el-button>
				  </div>
				  <div v-for="(o, sIndex) in box.list"  class="text item">
				    <el-input style="width:180px" v-model="o.kuaidiNo" placeholder="快递单号" size="small"></el-input>
				    <el-input style="width:180px" v-model="o.company" placeholder="快递公司" size="small"></el-input>
				    <el-button style="float: right;" type="danger" icon="delete" size="small" @click="removeBoxList(index, sIndex)"></el-button>
				  </div>
				  <el-button type="success" icon="plus" size="small" @click="addBoxList(index)"></el-button>
				</el-card>
				<el-button type="success" icon="plus" size="small" @click="addBox()"></el-button>
				</el-form-item>

				<!--

				<el-form-item label="件数">
					<el-input v-model="addForm.amount"></el-input>
				</el-form-item>

				<el-form-item label="重量">
					<el-input-number v-model="addForm.weight" debounce="2000"></el-input-number> kg
				</el-form-item>

				<el-form-item label="本运费">
					<el-input-number v-model="addForm.fee" debounce="2000"></el-input-number>
				</el-form-item>
				
				<el-form-item label="代付">
					<el-input-number v-model="addForm.opayment" debounce="2000" auto-complete="off"></el-input-number>
				</el-form-item>

				<el-form-item label="汇率">
					<el-input-number v-model="addForm.exchange" debounce="2000" auto-complete="off"></el-input-number>
				</el-form-item>

				<el-form-item label="合计费用">
					<el-input v-model="addForm.totalFee" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="备注">
					<el-input v-model="addForm.note" auto-complete="off"></el-input>
				</el-form-item>
				-->
				

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--编辑界面-->
		<el-dialog title="修改货运单" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="会员号" prop="customId">
					<el-input v-model="editForm.customId" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="货运单号" prop="huoyunNo">
					<el-input v-model="editForm.huoyunNo" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="货运单日期" prop="date">
				<el-date-picker
				      v-model="editForm.date"
				      type="date"
				      placeholder="选择日期">
				    </el-date-picker>
					
				</el-form-item>

				<el-form-item label="目的地">
					<el-input v-model="editForm.destinate" :min="0" :max="100000"></el-input>
				</el-form-item>

				<el-form-item label="集装箱">
				<el-card class="box-card" v-for="(box, index) in editForm.boxes">
				  <div slot="header" class="clearfix">
				    <span style="line-height: 36px;">箱号：<el-input style="width:200px" v-model="box.boxNo" auto-complete="off" size="small"></el-input></span>
				    <el-button style="float: right;" type="danger" icon="delete" size="small" @click="removeEditBox(index)"></el-button>
				  </div>
				  <div v-for="(o, sIndex) in box.list" class="text item">
				    <el-input style="width:180px" v-model="o.kuaidiNo" placeholder="快递单号" size="small"></el-input>
				    <el-input style="width:180px" v-model="o.company" placeholder="快递公司" size="small"></el-input>
				    <el-button style="float: right;" type="danger" icon="delete" size="small" @click="removeEditBoxList(index, sIndex)"></el-button>
				  </div>
				  <el-button type="success" icon="plus" size="small" @click="addEditBoxList(index)"></el-button>
				</el-card>
				<el-button type="success" icon="plus" size="small" @click="addEditBox()"></el-button>
				</el-form-item>

				<!--

				<div v-for="(o, sIndex) in box.list"  class="text item">
				    <el-input style="width:180px" v-model="o.kuaidiNo" placeholder="快递单号" size="small"></el-input>
				    <el-input style="width:180px" v-model="o.company" placeholder="快递公司" size="small"></el-input>
				    <el-button style="float: right;" type="danger" icon="delete" size="small" @click="removeBoxList(index, sIndex)"></el-button>
				  </div>

				<el-form-item label="件数">
					<el-input v-model="editForm.amount"></el-input>
				</el-form-item>

				<el-form-item label="重量">
					<el-input-number v-model="editForm.weight" debounce="2000"></el-input-number> kg
				</el-form-item>

				<el-form-item label="本运费">
					<el-input-number v-model="editForm.fee" debounce="2000"></el-input-number>
				</el-form-item>
				
				<el-form-item label="代付">
					<el-input v-model="editForm.opayment" debounce="2000" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="汇率">
					<el-input-number v-model="editForm.exchange" debounce="2000" auto-complete="off"></el-input-number>
				</el-form-item>

				<el-form-item label="合计费用">
					<el-input v-model="editForm.totalFee" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="备注">
					<el-input v-model="editForm.note" auto-complete="off"></el-input>
				</el-form-item>
				-->

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--编辑库存界面-->
		<el-dialog title="修改货运单库存" v-model="editStockFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="标题" prop="title">
					{{editForm.title}}
				</el-form-item>

				<el-form-item label="头像">
				
				  <img v-if="imageUrl" :src="imageUrl" class="avatar">
				 
				</el-form-item>

				<el-form-item label="库存">
					<el-input-number v-model="editForm.stock" :min="0" :max="2000000"></el-input-number>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editStockFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getZtwlHuoyunList, addZtwlHuoyun, editZtwlHuoyun, removeZtwlHuoyun } from '../../api/api';
	import moment from 'moment'

	export default {
		data() {
			return {
				activeName: 'first',
				percentStep: false,
				catalogOptions: [],
				catalogChildrenOptions: [],
				options: [{
					label: '待发货',
					value: 1
				},{
					label: '已发货',
					value: 2
				},{
					label: '已提货',
					value: 3
				}],
				imageUrl: '',
				imageList: [],
				albumList: [],
				checkList: [],
				filters: {
					customId: '',
					huoyunNo: '',
					destinate: ''
				},
				percentages: [{
					count: 0,
					percentage: 0
				}],
				products: [],
				tags: [],
				catalogs: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editStockFormVisible: false,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					huoyunNo: [
						{ required: true, message: '请输入货运单号', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					customId: '',
					huoyunNo: '',
					date: '',
					destinate: '',
					amount: '',
					weight: 0,
					fee: 0,
					opayment: 0,
					exchange: 0,
					totalFee: '',
					note: '',
					boxes: []
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					customId: [
						{ required: true, message: '请输入会员号', trigger: 'blur' }
					],
					huoyunNo: [
						{ required: true, message: '请输入货运单号', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					customId: '',
					huoyunNo: '',
					date: '',
					destinate: '',
					amount: '',
					weight: 0,
					fee: 0,
					opayment: 0,
					exchange: 0,
					totalFee: '',
					note: '',
					boxes: []
				}

			}
		},
		methods: {
			catalogChange(catalog) {
				const t = []
				this.catalogs.forEach(c => {
					if(c.basic.title == catalog){
						c.basic.children.forEach( cc => {
							t.push({
								label: cc.title,
								value: cc.title
							})
						})			
					}
				})
				this.catalogChildrenOptions = t
				this.addForm.childCatalog = ''
			},
			 handleRemove(file, fileList) {
		        this.imageList = fileList
		      },
		      handlePreview(file) {
		        console.log('handlePreview',file);
		      },
		       handleAlbumSuccess(res, file) {
				if(res.code){
					this.$message.error({
						message: res.message
					})
					return
				}
				this.albumList.push({
					name: file.name,
					url: res.data.url//file.response.data.url
				})
				//console.log(res, file)
				//this.imageUrl = 'https://'+file.response.data.url
        		//this.imageUrl = URL.createObjectURL(file.raw);
		      },
		      handleImageSuccess(res, file) {
				if(res.code){
					this.$message.error({
						message: res.message
					})
					return
				}
				this.imageList.push({
					name: file.name,
					url: res.data.url//file.response.data.url
				})
				//console.log(res, file)
				//this.imageUrl = 'https://'+file.response.data.url
        		//this.imageUrl = URL.createObjectURL(file.raw);
		      },

			handleAvatarSuccess(res, file) {
				if(res.code){
					this.$message.error({
						message: res.message
					})
					return
				}
				this.imageUrl = res.data.url
				console.log(this.imageUrl)
        		//this.imageUrl = URL.createObjectURL(file.raw);
		      },
		      beforeAvatarUpload(file) {
		        const isJPG = file.type === 'image/jpeg';
		        const isPNG = file.type === 'image/png';
		        const isLt2M = file.size / 1024 / 1024 < 2;

		        if (!isJPG && !isPNG) {
		          this.$message.error('上传头像图片只能是 JPG或PNG 格式!');
		        }
		        if (!isLt2M) {
		          this.$message.error('上传头像图片大小不能超过 2MB!');
		        }
		        return (isJPG || isPNG) && isLt2M;
		      },
			//性别显示转换
			formatDate: function (row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm')
			},
			formatChildren: function (row, column) {
				return row.basic.children.map(c => c.title).join(',')
			},
			formatPercent1: function(row, column) {
				if(typeof(row.basic.percent) == 'object')
					return row.basic.percent[0]
				return row.basic.percent
			},
			formatPercent2: function(row, column) {
				if(typeof(row.basic.percent) == 'object')
					return row.basic.percent[1]
				return row.basic.percent
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getHuoyuns();
			},
			handleClick(){

			},
			//获取用户列表
			getHuoyuns() {
				let para = {
					customId: this.filters.customId,
					huoyunNo: this.filters.huoyunNo,
					destinate: this.filters.destinate,
					page: this.page,
					size: 10
				};
				this.listLoading = true;
				//NProgress.start();
				getZtwlHuoyunList(para).then((res) => {
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					
					this.total = res.data.total;
					this.products = res.data.list;
					this.listLoading = false;
					console.log(this.products)
					//NProgress.done();
				});
			},

			minusPercentage() {
				this.percentages.pop()
			},

			plusPercentage() {
				this.percentages.push({
					count: 0,
					percentage: 0
				})
			},

			addBox() {
				this.addForm.boxes.push({
					boxNo: '',
					list: [{kuaidiNo: '', company: ''}]
				})
			},

			removeBox(index) {
				this.addForm.boxes.forEach((e, k) => {
					if(k == index)
						this.addForm.boxes.splice(k, 1)
				})
			},

			addBoxList(index) {
				this.addForm.boxes.forEach((e, k) => {
					if(k == index)
						e.list.push({
							kuaidiNo: '',
							company: ''
						})
				})
			},

			removeBoxList(index, sIndex) {
				this.addForm.boxes.forEach((e, k) => {
					if(k == index)
						e.list.forEach((l, j) => {
							if(j == sIndex)
								e.list.splice(j, 1)
						})
				})
			},

			addEditBox() {
				this.editForm.boxes.push({
					boxNo: '',
					list: [{kuaidiNo: '', company: ''}]
				})
			},

			removeEditBox(index) {
				this.editForm.boxes.forEach((e, k) => {
					if(k == index)
						this.editForm.boxes.splice(k, 1)
				})
			},

			addEditBoxList(index) {
				this.editForm.boxes.forEach((e, k) => {
					if(k == index)
						e.list.push({
							kuaidiNo: '',
							company: ''
						})
				})
			},

			removeEditBoxList(index, sIndex) {
				this.editForm.boxes.forEach((e, k) => {
					if(k == index)
						e.list.forEach((l, j) => {
							if(j == sIndex)
								e.list.splice(j, 1)
						})
				})
			},

			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除货运单：'+row.basic.huoyunNo+' 吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { feedId: row.feedId };

					removeZtwlHuoyun(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getHuoyuns();
					});
				}).catch(() => {

				});
			},
			//删除标签
			handleDelTag: function (index, row) {
				this.$confirm('确认删除标签：'+row.basic.title+' 吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { tagId: row.tagId };

					removeTag(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getTags();
					});
				}).catch(() => {

				});
			},
			//删除分类
			handleDelCatalog: function (index, row) {
				this.$confirm('确认删除分类：'+row.basic.title+' 吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { catalogId: row.catalogId };

					removeCatalog(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getCatalogs();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row.basic, {
					feedId: row.feedId
				});
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					customId: '',
					huoyunNo: '',
					date: '',
					destinate: '',
					amount: '',
					weight: 0,
					fee: 0,
					opayment: 0,
					exchange: 0,
					totalFee: '',
					note: '',
					boxes: []
				};
				this.imageUrl = ''
				this.images = []
				this.percentages = [{
					count: 0,
					percentage: 0
				}]
			},
			
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.date = (para.date)?moment(para.date).format('YYYY-MM-DD'):''		

							editZtwlHuoyun(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.editStockFormVisible = false
								this.getHuoyuns();
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
							para.date = (para.receiveDate)?moment(para.receiveDate).format('YYYY-MM-DD'):''

						

							addZtwlHuoyun(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getHuoyuns();
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
						this.getHuoyuns();
					});
				}).catch(() => {

				});
			},
			query() {
				this.page = 1
				this.getHuoyuns()
			}
		},
		mounted() {
			this.getHuoyuns();
		}
	}

</script>

<style scoped>
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
  .box-card {
  	margin-bottom: 10px;
  }
  .box-card-expand{
  	width: 45%;
  	float: left;
  	margin-right: 20px;
  	margin-bottom: 20px;
  }
</style>