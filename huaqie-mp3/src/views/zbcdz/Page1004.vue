<template>
	<section>
	
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.phone" placeholder="手机号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getAgent">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-if="agentLevel!=3" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column label="头像" width="120">
				<template scope="scope">
					<img :src="scope.row.basic.avatar" style="width:40px;height:40px;vertical-align:middle;margin:5px 0;" />
				</template>
			</el-table-column>
			<el-table-column prop="basic.name" label="姓名" width="150" >
			</el-table-column>
			<el-table-column prop="basic.sex" label="性别" width="100" :formatter="formatSex" >
			</el-table-column>
			<el-table-column prop="basic.phone" label="手机号" width="200" >
			</el-table-column>
			<el-table-column prop="basic.zone" label="代理区域" :formatter="formatArea" width="300"  >
			</el-table-column>
			<el-table-column prop="extra.level" label="代理等级" width="150" :formatter="formatLevel"   :filters="[{ text: '省级', value: 1 }, { text: '市级', value: 2 }, { text: '地区', value: 3 }]"
      :filter-method="filterTag">
			</el-table-column>
			<el-table-column prop="basic.ratio" label="提现费率" :formatter="formatRatio" width="140" >
			</el-table-column>
			<el-table-column prop="extra.count" label="下级代理数" width="140" >
			</el-table-column>
			<el-table-column prop="created" :formatter="formatDate" label="注册时间" min-width="180" >
			</el-table-column>
			<el-table-column label="操作" width="220">
				<template scope="scope">
				<el-button type="primary" size="small" @click="handleShow(scope.$index, scope.row)">查看</el-button>
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
		<el-dialog title="新增代理商" size='tiny' v-model="addFormVisible" @close='initForm' :close-on-click-modal="false">
			<el-form :model="addForm" label-width="100px" :rules='addFormRule' ref="addForm">
				<el-form-item label="姓名" prop='name'>
					<el-input v-model="addForm.name" class='small-el-input' auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop='sex'>
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="2">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="头像">
					<el-upload
					  class="avatar-uploader"
					  :action=avatarUrl
					  :show-file-list="false"
					  :on-success="handleAvatarSuccess"
					  :before-upload="beforeAvatarUpload">
					  <img v-if="addForm.avatar" :src="addForm.avatar" class="avatar">
					  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="手机号" prop='phone'>
					<el-input v-model="addForm.phone" class='small-el-input'></el-input>
				</el-form-item>
				<el-form-item label="密码">
					<el-input v-model="addForm.password" class='small-el-input'></el-input>
				</el-form-item>
				<el-form-item label="区域">
					<el-select v-model="province" placeholder="请选择省/直辖市" @visible-change='getProvince' v-if='level == 1'>
					    <el-option
					      v-for="item in provinceList"
					      :key="item.name"
					      :label="item.name"
					      :value="item.name">
					    </el-option>
					</el-select>
					<el-select v-model="city" style='margin-top:10px;' placeholder="请选择市/区" @visible-change='getCity' v-if='address.length <= 1'>
					    <el-option
					      v-for="item in cityList"
					      :key="item.name"
					      :label="item.name"
					      :value="item.name">
					    </el-option>
					</el-select>
					<el-input placeholder="请填写代理小区" class='small-el-input' v-model="area" style='margin-top:10px;'></el-input>
					<!-- <el-select v-model="area" style='margin-top:10px;' placeholder="请选择地区" @visible-change='getArea' v-if='address.length == 2||isProCity'>
					    <el-option
					      v-for="item in areaList"
					      :key="item.name"
					      :label="item.name"
					      :value="item.name">
					    </el-option>
					</el-select> -->
				</el-form-item>
				<el-form-item label="提现费率">
					<el-input-number v-model="addForm.ratio" class='small-el-input'></el-input-number> %
				</el-form-item>
				<el-form-item label="分配上级代理" v-if="city || area">
					<el-select v-model="parentAgentId" placeholder="分配上级代理商(非必选)">
					    <el-option
					      v-for="item in allAgentList"
					      :key="item.basic.name"
					      :label="item.basic.name"
					      :value="item.agentId">
					    </el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--编辑界面-->
		<el-dialog title="编辑代理商" size='tiny' v-model="editFormVisible" :close-on-click-modal="false" @close='initEdit'>
			<el-form :model="editForm" label-width="100px" ref="editForm">
				<el-form-item label="姓名">
					<el-input class='small-el-input' v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="2">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="头像">
					<el-upload
					  class="avatar-uploader"
					  :action=avatarUrl
					  :show-file-list="false"
					  :on-success="handleAvatarSuccess"
					  :before-upload="beforeAvatarUpload">
					  <img v-if="editForm.avatar" :src="editForm.avatar" class="avatar">
					  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="区域">
					<el-select v-model="province" placeholder="请选择省/直辖市" @visible-change='getProvince' v-if='level == 1'>
					    <el-option
					      v-for="item in provinceList"
					      :key="item.name"
					      :label="item.name"
					      :value="item.name">
					    </el-option>
					</el-select>
					<el-select v-model="city" style='margin-top:10px;' placeholder="请选择市/区" @visible-change='getCity' v-if='address.length <= 1'>
					    <el-option
					      v-for="item in cityList"
					      :key="item.name"
					      :label="item.name"
					      :value="item.name">
					    </el-option>
					</el-select>
					<el-input placeholder="请填写代理小区" v-model="area" style='margin-top:10px;'></el-input>
					<!-- <el-select v-model="area" style='margin-top:10px;' placeholder="请选择地区" @visible-change='getArea' v-if='address.length == 2||isProCity'>
					    <el-option
					      v-for="item in areaList"
					      :key="item.name"
					      :label="item.name"
					      :value="item.name">
					    </el-option>
					</el-select> -->
				</el-form-item>
				<el-form-item label="提现费率">
					<el-input-number v-model="editForm.ratio" class='small-el-input'></el-input-number> %
				</el-form-item>
				<el-form-item label="分配上级代理" v-if="city || area">
					<el-select v-model="parentAgentId" placeholder="分配上级代理商(非必选)">
					    <el-option
					      v-for="item in allAgentList"
					      :key="item.basic.name"
					      :label="item.basic.name"
					      :value="item.agentId">
					    </el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--详情界面-->
		<el-dialog title="代理商详情" v-model="showFormVisible" :close-on-click-modal="false">
			<p>姓名：{{showForm.basic && showForm.basic.name}}</p>
			<p>手机号：{{showForm.basic && showForm.basic.phone}}</p>

			 <el-tabs v-model="cardActiveName" type="card">
    <el-tab-pane label="下级代理商" name="first">
    		<!--列表-->
		<el-table :data="subAgentList" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column label="头像" width="120">
				<template scope="scope">
					<img :src="scope.row.basic.avatar" style="width:40px;height:40px;vertical-align:middle;margin:5px 0;" />
				</template>
			</el-table-column>
			<el-table-column prop="basic.name" label="姓名" width="150" >
			</el-table-column>
			<el-table-column prop="basic.sex" label="性别" width="100" :formatter="formatSex" >
			</el-table-column>
			<el-table-column prop="basic.phone" label="手机号" width="200" >
			</el-table-column>
			<el-table-column prop="basic.zone" label="代理区域" :formatter="formatArea" width="300"  >
			</el-table-column>
			<el-table-column prop="extra.level" label="代理等级" width="150" :formatter="formatLevel"   :filters="[{ text: '省级', value: 1 }, { text: '市级', value: 2 }, { text: '地区', value: 3 }]"
      :filter-method="filterTag">
			</el-table-column>
			<el-table-column prop="basic.ratio" label="提现费率" :formatter="formatRatio" width="140" >
			</el-table-column>
			<el-table-column prop="extra.count" label="下级代理数" width="140" >
			</el-table-column>
			<el-table-column prop="created" :formatter="formatDate" label="注册时间" min-width="180" >
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="total, prev, pager, next" @current-change="handleSubCurrentChange" :page-size="10" :total="subTotal" style="float:right;">
			</el-pagination>
		</el-col>
    </el-tab-pane>
    <el-tab-pane label="资金概览" name="second">
    <el-row><el-col :span="12">总收入</el-col><el-col :span="12">¥{{moneyForm.total}}</el-col></el-row>
    <el-row><el-col :span="12">余额</el-col><el-col :span="12">¥{{moneyForm.has}}</el-col></el-row>
    <el-row><el-col :span="12">提现</el-col><el-col :span="12">¥{{moneyForm.out}}</el-col></el-row>
    <el-row><el-col :span="12">下级余额</el-col><el-col :span="12">¥{{moneyForm.toHas}}</el-col></el-row>
    <el-row><el-col :span="12">下级提现</el-col><el-col :span="12">¥{{moneyForm.toOut}}</el-col></el-row>
    </el-tab-pane>
  </el-tabs>

			

			<div slot="footer" class="dialog-footer">
				<el-button @click.native="showFormVisible = false">关闭</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import address from '@/api/address'
	//import NProgress from 'nprogress'
	import { getAgentList, avatarUrl, createAgent, removeAgent, updateAgent, getCurrentAgent, getAllAgent, getAgentById, getAgentBalance } from '../../api/api';
	import moment from 'moment'

	export default {
		data() {
			return {
				cardActiveName: 'first',
				agentLevel: '',
				province: '',
				city: '',
				area: '',
				level: '',
				isProCity: false,
				provinceList: [],
				cityList: [],
				areaList: [],
				address: [],
				parentAgentId: '',
				parents: [],
				allAgentList: [],
				avatarUrl: avatarUrl,
				filters: {
					name: ''
				},
				users: [],
				total: 0,
				page: 1,
				subAgentList: [],
				subTotal: 0,
				subPage: 1,
				listLoading: false,

				moneyForm: {},

				showForm: {},
				showFormVisible: false,

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				//新增界面数据
				addForm: {
					name: '',
					sex: 1,
					avatar: 'https://dn-huaqie.qbox.me/483023546.jpg',
					password: '123456',
					ratio: 0,
					zone: {
						province: '',
						city: '',
						area: ''
					},
					level: ''
				},
				addFormRule: {
					name: [
						{ required: true, message: '请输入代理商姓名', trigger: 'blur' },
					],
					phone: [
						{ required: true, message: '请输入手机号', trigger: 'blur' },
					]
				},
				editFormVisible: false,
				editForm: {
					name: '',
					sex: 1,
					phone: '',
					password: '123456',
					avatar: '',
					ratio: 0,
					zone: {
						province: '',
						city: '',
						area: ''
					},
					level: ''
				},
			}
		},
		computed: {
			// showCity() {
			// 	if(!this.isProCity) {
			// 		if(this.address.length == 1) {
			// 			return true;
			// 		} else if(this.address.length == 2) {
			// 			return false
			// 		}
			// 	} else {
			// 		return false
			// 	}
			// }
		},
		methods: {
			//性别显示转换
			formatSex(row, column) {
				return row.basic.sex == 1 ? '男' : row.basic.sex == 2 ? '女' : '未知';
			},
			formatLevel(row, column) {
				return row.extra.level == 1? '省级' : row.extra.level == 2? '市级' : '地区'
			},
			formatRatio(row, column) {
				return row.basic.ratio>0 ? (row.basic.ratio*100).toFixed(2)+'%' : 0
			},
			formatArea(row, col) {
				let zone = row.basic.zone;
				if(typeof zone == 'object') {
					if(zone.city) {
						if(zone.area) {
							return zone.province+'-'+zone.city+'-'+zone.area
						}
						return zone.province+'-'+zone.city
					} else {
						return zone.province
					}
				}
				return row.basic.zone
			},
			formatDate(row, column) {
				return moment(row.created).format('YYYY-MM-DD HH:mm:ss')
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getAgent();
			},
			filterTag(value, row) {
				return row.extra.level == value;
			},
			checkForm(form) {
				this[form].parentAgentId = this.parentAgentId;
				if(this.parents.length > 0) {
					this.allAgentList.forEach(item => {
						if(item.agentId == this.parentAgentId && this.parents.indexOf(item.extra.peopleId) == -1) {
							this.parents.push(item.extra.peopleId)
						}
					})
					this[form].parents = this.parents;
				}	
				// console.log(this[form]);
				if(!this.area) {
					if(!this.city) {
						// 省级
						this[form].zone.province = this.province;
						this[form].level = 1;
						if(this.level == 1) {
							if(form == 'addForm') {
								this.sendAdd();
							} else if(form == 'editForm') {
								this.sendEdit()
							}
						} else {
							this.$message.error({
								message: '请选择市/区'
							})
						}
					} else {
						// 市级
						this[form].zone.province = this.province;
						this[form].zone.city = this.city;
						this[form].level = 2;
						// console.log(this[form]);
						if(form == 'addForm') {
							this.sendAdd();
						} else if(form == 'editForm') {
							this.sendEdit()
						}
					}
				} else {
					if(this.province) {
						if(this.city) {
							// 小区
							this[form].zone = {
								province: this.province,
								city: this.city,
								area: this.area
							};
							this[form].level = 3;
							if(form == 'addForm') {
								this.sendAdd();
							} else if(form == 'editForm') {
								this.sendEdit()
							}
						} else {
							this.$message.error({
								message: '分配小区必须选择省和市'
							})
						}	
					} else {
						this.$message.error({
							message: '分配小区必须选择省和市'
						})
					}
				}
			},
			//获取代理商列表
			getAgent() {
				let para = {
					phone: this.filters.phone,
					name: this.filters.name,
					page: this.page,
					size: 10
				};
				this.listLoading = true;
				//NProgress.start();
				getAgentList(para).then((res) => {
					// console.log(res);
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					this.total = res.data.total;
					this.users = res.data.list;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			// 获取所有代理商
			getAllAgent() {
				getAllAgent({}).then(res => {
					if(res.code > 0) {
						this.$message.error({
							message: res.message
						})
					}
					// console.log(res.data);
					console.log('========= ALL AGENT', res.data)
					this.allAgentList = res.data
					// console.log(res);
				})
			},
			// 编辑
			initEdit() {
				this.initAllAgent();
				// this.initProvince();
				// this.initCity();
				// this.initArea();
				// this.getProvince();
			},
			handleShow(index, row) {
				this.showForm = row
				this.showFormVisible = true
				//this.listLoading = true;
				//NProgress.start();
				getAgentList({
					parentPeopleId: row.extra.peopleId,
					page: this.subPage,
					size: 10
				}).then((res) => {
					this.listLoading = false;
					// console.log(res);
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					this.subTotal = res.data.total;
					this.subAgentList = res.data.list;
					
					//NProgress.done();
				});
				this.moneyForm = {
					has: 0,
					out: 0,
					total: 0,
					toHas: 0,
					toOut: 0
				}
				getAgentBalance({
					peopleId: this.showForm.extra.peopleId
				}).then(res => {
					console.log('====', res)
					if(res.code === 0) {
						if(res.data) {
							this.moneyForm.has = res.data.balance.toFixed(2);
							this.moneyForm.out = res.data.withdraw?res.data.withdraw.toFixed(2):0;
							this.moneyForm.total = ((res.data.frozen?Number(res.data.frozen.toFixed(2)):0)+Number(this.moneyForm.has)+Number(this.moneyForm.out)).toFixed(2);
							this.moneyForm.toOut = res.data.toWithdraw?res.data.toWithdraw.toFixed(2):0;
							this.moneyForm.toHas = (this.moneyForm.total-this.moneyForm.toOut).toFixed(2)
						} else {
							this.moneyForm.has = 0;
							this.moneyForm.out = 0;
							this.moneyForm.toOut = 0;
							this.moneyForm.toHas = 0;
							this.moneyForm.total = 0;
						}
					} else {
						this.$message.error({
							message: res.message
						}) 
					}
				})
			},
			handleSubCurrentChange(val) {
				this.page = val;
				getAgentList({
					parentPeopleId: this.showForm.extra.peopleId,
					page: this.subPage,
					size: 10
				}).then((res) => {
					this.listLoading = false;
					// console.log(res);
					if(res.code){
						this.$message.error({
							message: res.message
						})
						return
					}
					this.subTotal = res.data.total;
					this.subAgentList = res.data.list;
					
					//NProgress.done();
				});
			},
			handleEdit(index, row) {
				// console.log(row);
				getAgentById({
					peopleId: row.extra.parents[row.extra.parents.length-1]
				}).then((res) => {
					if(res.code > 0){
						this.$message.error({
							message: res.message
						})
						return
					}
					this.parents = JSON.parse(JSON.stringify(row.extra.parents));
					if(res.data) {
						this.parentAgentId = res.data.agentId;
					} else {
						this.parentAgentId = '';
					}
					let rowMsg = {
						name: row.basic.name,
						sex: row.basic.sex,
						avatar: row.basic.avatar,
						ratio: row.basic.ratio*100,
						zone: row.basic.zone
					};
					let addressArr = row.basic.zone;
					if(typeof addressArr == 'object') {
						this.province = addressArr.province;
						this.city = addressArr.city?addressArr.city: '';
						this.area = addressArr.area?addressArr.area: '';
						// console.log(this.address);
					} else {
						this.province = addressArr.split('-')[0];
						this.city = addressArr.split('-')[1]?addressArr.split('-')[1]: '';
						this.area = addressArr.split('-')[2]?addressArr.split('-')[2]: '';
					}
					this.editForm = JSON.parse(JSON.stringify(rowMsg));
					this.editForm.agentId = row.agentId;
					this.editFormVisible = true;

					// this.editForm = JSON.parse(JSON.stringify(rowMsg));	
					// this.total = res.data.total;
					// this.users = res.data.list;
					// this.listLoading = false;
				})	
			},
			editSubmit() {
				// console.log(this.editForm);
				this.checkForm('editForm');	
				// console.log(this.editForm);
			},
			sendEdit() {
				this.editForm.zone = {
					area: this.area,
					city: this.city,
					province: this.province
				}
				// console.log(this.editForm);
				updateAgent(this.editForm).then(res => {
					// console.log(res);
					if(res.code === 0) {
						this.$message({
							type: 'success',
							message: '修改成功'
						})
						this.editFormVisible = false;
						this.getAgent();
					} else {
						this.$message.error({
							message: res.message
						})
						this.editForm.parents.pop()
					}
				})
			},
			//删除
			handleDel(index, row) {
				// console.log(row);
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { agentId: row.agentId };
					removeAgent(para).then((res) => {
						// console.log(res);
						if(res.code === 0) {
							this.listLoading = false;
							//NProgress.done();
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getAgent();
						} else {
							this.$message.error({
								message: res.message
							}); 
						}
					});
				}).catch(() => {

				});
			},
			initForm() {
				this.initAllAgent();
				// this.initProvince();
				// this.initCity();
				// this.initArea();
				// this.getProvince();
				this.addForm = {
					name: '',
					sex: 1,
					phone: '',
					password: '123456',
					avatar: 'https://dn-huaqie.qbox.me/483023546.jpg',
					zone: {
						province: '',
						city: '',
						area: ''
					},
					level: ''
				}
			},
			//显示新增界面
			handleAdd() {
				this.addFormVisible = true;
				this.addForm.avatar = ''
			},
			// 图片上传成功钩子
			handleAvatarSuccess(res, file) {
				if(res.code){
					this.$message.error({
						message: res.message
					})
					return
				}
				this.addForm.avatar = res.data.url
				this.editForm.avatar = res.data.url
			},
			// 图片上传前
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
			//新增
			addSubmit() {
				// console.log(this.addForm);
				this.checkForm('addForm');
				// console.log(this.addForm);		
			},
			sendAdd() {
				this.$refs.addForm.validate((valid) => {
					if(valid) {
						// console.log(this.addForm);
						createAgent(this.addForm).then(res => {
							// console.log(res);
							if(res.code === 0) {
								this.$message({
									type: 'success',
									message: '新增成功'
								})
								this.addFormVisible = false;
								this.getAgent();
							} else {
								this.$message.error({
									message: res.message
								})
							}
						})
					} else {
						this.$message.error({
							message: '信息不能为空'
						})
					}
				})
			},
			// 三级的联动
			getProvince(val) {
				// console.log(val);
				if(val) {
					this.initCity();
					this.initArea();
					if(this.provinceList.length == 0) {
						address.forEach(item => {
							// console.log(item);
							this.provinceList.push({
								name: item.name
							})
						})
					}
				}	
			},
			getCity(val) {
				if(val) {
					this.initCity();
					this.initArea();
					address.forEach(item => {
						if(item.name == this.province) {
							if(item.city.length > 1) {
								item.city.forEach(child => {
									this.cityList.push({
										name: child.name
									})
								})
								return;
							} else {
								item.city[0].area.forEach(child => {
									this.cityList.push({
										name: child
									})
								})
							}
							return;
						}
					})
				}
			},
			getArea(val) {
				if(val) {
					// console.log(this.province, this.city);
					this.initArea();
					address.forEach(item => {
						if(item.name == this.province) {
							item.city.forEach(child => {
								if(child.name == this.city) {
									child.area.forEach(area => {
										this.areaList.push({
											name: area
										})
									})
									return;
								}
							})
							return;
						}
					})
				}
			},
			initProvince() {
				this.province = '';
				this.provinceList = []
			},
			initCity() {
				this.city = '';
				this.cityList = []
			},
			initArea() {
				this.area = '';
				this.areaList = []
			},
			initAllAgent() {
				this.parentAgentId = ''
			}
		},
		mounted() {
			this.getAgent();
			this.getAllAgent();
			if(this.store.get('user').role.level == 1) {
				this.level = 1;
			} else {
				getCurrentAgent({}).then(res => {
					if(res.code) {
						this.$message.error({
							message: res.message
						})
					}
					this.agentLevel = res.data.extra.level
					let zone = res.data.basic.zone;
					if(typeof zone == 'object') {
						for(const item in zone) {
							if(zone[item]) {
								this.address.push(zone[item])
							}
						}
						// console.log(this.address);
					} else {
						this.address = res.data.basic.zone.split('-');
					}
					
					this.province = this.address[0];
					// console.log(this.address);
					this.city = this.address[1]? this.address[1]: '';
					this.area = this.address[2]? this.address[2]: '';

					// console.log(res.data.basic.zone.split('-'));
				})
			}
		}
	}

</script>

<style scoped>
  .avatar-uploader .el-upload {
    overflow: hidden;
    position: relative;
  }
  .avatar-uploader .el-upload:hover {
    /* border-color: #20a0ff; */
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 175px;
    height: 175px;
    line-height: 175px;
    text-align: center;
    border: 1px dashed #d9d9d9 ;
    cursor: pointer;
  }
  .avatar-uploader-icon:hover {
  	border-color: #20a0ff;
  }
  .avatar {
    width: 175px;
    height: 175px;
    display: block;
  }
</style>